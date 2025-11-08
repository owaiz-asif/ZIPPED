"use client"

import { useState } from "react"
import { Mic, Volume2 } from "lucide-react"

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [response, setResponse] = useState("")

  const synthSpeak = (text: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utter)
      }
    } catch (e) {
      console.warn('TTS failed', e)
    }
  }

  const handleVoiceQuery = () => {
    // Toggle listening. If starting, use the Web Speech API if available.
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!isListening) {
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.interimResults = false
        recognition.onresult = async (event: any) => {
          const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('')
          setResponse('Processing...')
          // Basic intent matching
          const lower = transcript.toLowerCase()
          let reply = "Sorry, I didn't catch that. Try asking about your mood or meetings."

          if (lower.includes('mood') || lower.includes('feeling') || lower.includes("how am i")) {
            try {
              const res = await fetch('/api/emotion-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texts: [transcript], source: 'voice' }),
              })
              const json = await res.json()
              if (json?.results && json.results.length > 0) {
                const score = json.results[0].analysis.score
                reply = `Based on your input, your sentiment score looks like ${Math.round(score * 100)}%.` 
              }
            } catch (e) {
              console.warn('Emotion API failed', e)
            }
          } else if (lower.includes('summar') || lower.includes('meeting') || lower.includes('schedule')) {
            try {
              const res = await fetch('/api/meeting-scheduler/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 1, meetings: [] }),
              })
              const json = await res.json()
              if (json?.optimizedSchedule) {
                reply = `I recommend ${json.optimizedSchedule[0]?.time || 'a time based on your energy patterns'}.` 
              }
            } catch (e) {
              console.warn('Meeting API failed', e)
            }
          } else if (lower.includes('summarize')) {
            reply = 'I can summarize your recent meetings — open the dashboard to see the summary.'
          }

          setResponse(reply)
          synthSpeak(reply)
        }

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition error', e)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.start()
        setIsListening(true)
      } else {
        // No SpeechRecognition — simulate flow
        setIsListening(true)
        setTimeout(() => {
          const reply = 'Your energy peaks at 10 AM. Perfect for design reviews and creative work.'
          setResponse(reply)
          synthSpeak(reply)
          setIsListening(false)
        }, 1200)
      }
    } else {
      // Stop any running synthesis or recognition
      try {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      } catch {}
      setIsListening(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Mic size={20} className="text-blue-400" />
        Voice Assistant
      </h3>

      <div className="space-y-4">
        <button
          onClick={handleVoiceQuery}
          className={`w-full py-4 rounded-lg font-semibold transition-all ${
            isListening
              ? "bg-red-500/20 border border-red-500 text-red-400"
              : "bg-blue-500/20 border border-blue-500 text-blue-400 hover:bg-blue-500/30"
          }`}
        >
          {isListening ? "⏹ Stop Listening" : "🎤 Ask Anything"}
        </button>

        {response && (
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-start gap-2">
              <Volume2 size={18} className="text-green-400 mt-1 flex-shrink-0" />
              <p className="text-slate-200 text-sm">{response}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Quick Questions</p>
          <div className="space-y-2">
            {["What's my mood trend?", "Summarize my meetings", "Best time for deep work?"].map((q) => (
              <button
                key={q}
                className="w-full text-left text-sm bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-slate-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
