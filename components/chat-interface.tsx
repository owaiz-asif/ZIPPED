"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Send, Mic, MicOff } from "lucide-react"
import { useChatData } from "@/hooks/use-chat-data"
import { queryRAG } from "@/lib/rag-client"

const DEMO_USER_ID = 1

interface Message {
  id: string
  text: string
  sender: "user" | "assistant"
  timestamp: Date
}

// Deterministic response generator to avoid hydration issues
const generateResponse = (input: string): string => {
  const responses: { [key: string]: string[] } = {
    hello: [
      "Hello! I'm AI Heir, your emotionally intelligent assistant. How can I help you today?",
      "Hey there! Ready to optimize your productivity and well-being?",
    ],
    mood: [
      "It sounds like you're experiencing some emotions. Would you like to talk about what's on your mind?",
      "I'm here to listen. Tell me more about how you're feeling.",
    ],
    meeting: [
      "I can help you schedule meetings at optimal times based on your energy levels. When would you like to meet?",
      "Based on your patterns, the best meeting times are 10am-12pm or 3pm-4pm.",
    ],
    schedule: [
      "Let's work on your schedule. What tasks do you want to prioritize?",
      "I can help organize your day for maximum productivity.",
    ],
  }

  const lowerInput = input.toLowerCase()
  let category = "hello"

  if (lowerInput.includes("mood") || lowerInput.includes("feeling")) category = "mood"
  else if (lowerInput.includes("meeting") || lowerInput.includes("schedule")) category = "meeting"
  else if (lowerInput.includes("schedule") || lowerInput.includes("task")) category = "schedule"

  // Use deterministic selection based on input hash to avoid hydration issues
  const hash = input.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % responses[category].length
  return responses[category][index]
}

export default function ChatInterface() {
  const { messages: dbMessages, addMessage, isLoading } = useChatData(DEMO_USER_ID)
  const messageIdCounter = useRef(1) // Start at 1 since we have initial message with id "1"

  const [messages, setMessages] = useState<Message[]>([])

  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Some browsers expose SpeechRecognition under different names and
      // TypeScript's Window typing may not include these. Use a safe any cast
      // to avoid type errors while retaining runtime checks.
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'
        
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("")
          setInput(prev => prev ? `${prev} ${transcript}` : transcript)
          setIsListening(false)
        }
        
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          if (event.error === 'no-speech') {
            alert("No speech detected. Please try again.")
          } else if (event.error === 'not-allowed') {
            alert("Microphone permission denied. Please enable microphone access.")
          }
        }
        
        recognition.onend = () => {
          setIsListening(false)
        }
        
        recognitionRef.current = recognition
      } else {
        console.warn("Speech recognition not supported in this browser")
      }
    }
  }, [])

  useEffect(() => {
    if (dbMessages && dbMessages.length > 0 && !hasInitialized) {
      const transformed = dbMessages.map((msg) => ({
        id: msg.id.toString(),
        text: msg.message_text,
        sender: msg.sender as "user" | "assistant",
        timestamp: new Date(msg.created_at),
      }))
      setMessages(transformed)
      setHasInitialized(true)
      // Update counter to avoid ID conflicts
      messageIdCounter.current = Math.max(...transformed.map(m => Number.parseInt(m.id) || 0), 1) + 1
    } else if (!hasInitialized) {
      // Only set initial message on client side to avoid hydration mismatch
      setMessages([
        {
          id: "1",
          text: "Hello! I'm AI Heir, your emotionally intelligent assistant. How can I help you today?",
          sender: "assistant",
          timestamp: new Date(),
        },
      ])
      setHasInitialized(true)
    }
  }, [dbMessages, hasInitialized])

  const handleSend = async () => {
    if (!input.trim()) return

    messageIdCounter.current += 1
    const userMessage: Message = {
      id: `msg-${messageIdCounter.current}`,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Save user message to database
    try {
      await addMessage(input, "user")
    } catch (error) {
      console.error("Error saving user message:", error)
    }

    // Try RAG first, fallback to simple response
    let responseText = ""
    let ragError: string | null = null
    try {
      const ragResult = await queryRAG(input, 3)
      
      // Check if RAG actually found relevant information
      if (ragResult.sources && ragResult.sources.length > 0) {
        responseText = ragResult.answer
        responseText += `\n\n📚 *Based on ${ragResult.sources.length} relevant document(s)*`
      } else if (ragResult.answer && !ragResult.answer.includes("No Information Available")) {
        // RAG responded but no sources - might still be useful
        responseText = ragResult.answer
      } else {
        // No relevant data found in RAG, use fallback
        throw new Error("No relevant documents found in RAG database")
      }
    } catch (error: any) {
      // RAG not available or failed, use fallback
      console.warn("RAG query failed:", error)
      ragError = error.message || "RAG service unavailable"
      
      // Provide helpful error message
      if (error.message?.includes("timeout") || error.message?.includes("connect")) {
        responseText = `⚠️ I'm unable to connect to my knowledge base right now. Please ensure the RAG service is running.\n\n${generateResponse(input)}`
      } else if (error.message?.includes("No relevant documents")) {
        responseText = `I couldn't find specific information about that in my knowledge base. Here's a general response:\n\n${generateResponse(input)}\n\n💡 *Tip: Make sure the RAG database has been populated with data. Run 'python populate_rag_database.py' to add documents.*`
      } else {
        responseText = generateResponse(input)
      }
    }

    messageIdCounter.current += 1
    const assistantMessage: Message = {
      id: `msg-${messageIdCounter.current}`,
      text: responseText,
      sender: "assistant",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])

    // Save assistant message to database
    try {
      await addMessage(responseText, "assistant")
    } catch (error) {
      console.error("Error saving assistant message:", error)
    }

    setInput("")
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not available in your browser. Please use Chrome or Edge.")
      return
    }

    if (isListening) {
      try {
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        recognitionRef.current.stop()
        setIsListening(false)
      } catch (error) {
        console.error("Error stopping recognition:", error)
        setIsListening(false)
      }
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        // Auto-stop after 10 seconds if no speech detected
        timeoutRef.current = setTimeout(() => {
          setIsListening((current) => {
            if (current) {
              recognitionRef.current?.stop()
              return false
            }
            return current
          })
          timeoutRef.current = null
        }, 10000)
      } catch (error: any) {
        console.error("Error starting recognition:", error)
        if (error.message?.includes('already started')) {
          // Recognition already running, just update state
          setIsListening(true)
        } else {
          alert("Could not start microphone. Please check your browser permissions.")
          setIsListening(false)
        }
      }
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col" suppressHydrationWarning>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          AI Heir Assistant
        </CardTitle>
        <CardDescription>Your emotionally intelligent productivity partner</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-lg shadow-blue-500/20"
                    : "bg-gradient-to-r from-slate-700/90 to-slate-800/90 text-slate-100 rounded-bl-none border border-slate-600/50"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words">
                  {msg.text.split('\n').map((line, idx) => {
                    // Handle markdown-style formatting
                    if (line.startsWith('## ')) {
                      return <h2 key={idx} className="font-bold text-base mt-2 mb-1 text-blue-300">{line.replace('## ', '')}</h2>
                    } else if (line.startsWith('### ')) {
                      return <h3 key={idx} className="font-semibold text-sm mt-2 mb-1 text-blue-200">{line.replace('### ', '')}</h3>
                    } else if (line.startsWith('• ') || line.startsWith('- ')) {
                      return <div key={idx} className="ml-2 mb-1">{line}</div>
                    } else if (line.trim() === '') {
                      return <br key={idx} />
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={idx} className="font-semibold mb-1">{line.replace(/\*\*/g, '')}</p>
                    }
                    return <p key={idx} className="mb-1">{line}</p>
                  })}
                </div>
                <span className="text-xs opacity-70 mt-2 block">
                  {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 relative">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            suppressHydrationWarning
          />
          <div className="relative">
            <Button
              onClick={toggleListening}
              variant="outline"
              size="icon"
              className={`border-slate-600 transition-all ${
                isListening 
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 animate-pulse shadow-lg shadow-red-500/30" 
                  : "hover:bg-slate-700 hover:border-blue-500"
              }`}
              suppressHydrationWarning
              title={isListening ? "Click to stop recording" : "Click to start voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            {isListening && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-red-400 font-medium animate-pulse bg-slate-900 px-2 py-1 rounded border border-red-500/30">
                🎤 Listening...
              </span>
            )}
          </div>
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700" suppressHydrationWarning>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
