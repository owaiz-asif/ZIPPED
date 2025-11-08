"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { analyzeEmotion, getMoodRecommendation, type EmotionScore } from "@/lib/emotion-analyzer"
import { Brain, Lightbulb } from "lucide-react"

export default function EmotionDetector() {
  const [input, setInput] = useState("")
  const [analysis, setAnalysis] = useState<EmotionScore | null>(null)
  const [recommendation, setRecommendation] = useState("")

  const handleAnalyze = () => {
    if (!input.trim()) return
    const result = analyzeEmotion(input)
    setAnalysis(result)
    setRecommendation(getMoodRecommendation(result))
  }

  const emotionColors = {
    joy: "text-yellow-400",
    trust: "text-blue-400",
    fear: "text-red-400",
    surprise: "text-purple-400",
    sadness: "text-blue-600",
    disgust: "text-green-600",
    anger: "text-red-600",
    anticipation: "text-orange-400",
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Brain className="w-5 h-5 text-purple-400" />
          Emotion Analyzer
        </CardTitle>
        <CardDescription className="text-slate-400">Analyze emotions in your sentences and text</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <textarea
          placeholder="Enter a sentence or paragraph to analyze emotions... (e.g., 'I'm feeling excited about the new project but also a bit nervous about the deadline')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              handleAnalyze()
            }
          }}
          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 min-h-24 transition-all"
          suppressHydrationWarning
        />

        <Button 
          onClick={handleAnalyze} 
          disabled={!input.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all" 
          suppressHydrationWarning
        >
          Analyze Emotion <span className="text-xs opacity-70 ml-2">(Ctrl+Enter)</span>
        </Button>

        {analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Overall Sentiment</p>
                <p
                  className={`text-lg font-bold ${
                    analysis.sentiment === "positive"
                      ? "text-green-400"
                      : analysis.sentiment === "negative"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {analysis.sentiment.toUpperCase()}
                </p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Intensity</p>
                <p className="text-lg font-bold text-white">{analysis.intensity}%</p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-sm font-semibold text-white mb-3">Emotion Breakdown</p>
              <div className="space-y-2">
                {Object.entries(analysis.emotions).map(([emotion, score]) => (
                  <div key={emotion} className="flex items-center justify-between">
                    <span
                      className={`text-sm capitalize font-medium ${emotionColors[emotion as keyof typeof emotionColors]}`}
                    >
                      {emotion}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            emotion === "joy"
                              ? "from-yellow-500 to-yellow-400"
                              : emotion === "fear"
                                ? "from-red-500 to-red-400"
                                : emotion === "sadness"
                                  ? "from-blue-600 to-blue-500"
                                  : "from-slate-500 to-slate-400"
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {recommendation && (
              <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-lg p-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-100">{recommendation}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
