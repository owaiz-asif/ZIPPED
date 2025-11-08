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

  return responses[category][Math.floor(Math.random() * responses[category].length)]
}

export default function ChatInterface() {
  const { messages: dbMessages, addMessage, isLoading } = useChatData(DEMO_USER_ID)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm AI Heir, your emotionally intelligent assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

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
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("")
          setInput(transcript)
        }
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
    }
  }, []) // Only run once on component mount

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
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
    try {
      const ragResult = await queryRAG(input, 3)
      responseText = ragResult.answer
      
      // If RAG found sources, append them as context
      if (ragResult.sources && ragResult.sources.length > 0) {
        responseText += `\n\n[Based on ${ragResult.sources.length} relevant document(s)]`
      }
    } catch (error) {
      // RAG not available or failed, use fallback
      console.warn("RAG query failed, using fallback:", error)
      responseText = generateResponse(input)
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
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
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
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
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-700 text-slate-100 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <Button
            onClick={toggleListening}
            variant="outline"
            size="icon"
            className={`border-slate-600 ${isListening ? "bg-red-600 text-white hover:bg-red-700" : ""}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
