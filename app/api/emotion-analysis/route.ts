import { type NextRequest, NextResponse } from "next/server"
import { withSecurityMiddleware } from "@/app/api/middleware"
import { sanitizeInput } from "@/lib/security-middleware"

interface TextData {
  text: string
  source: string
}

interface EmotionResult {
  sentiment: string
  score: number
  emotions: {
    positive: number
    negative: number
    neutral: number
  }
  tone: string
  recommendations: string[]
}

// Simplified emotion analysis using keyword-based approach
function analyzeEmotions(text: string): EmotionResult {
  const positiveKeywords = [
    "happy",
    "excited",
    "great",
    "love",
    "amazing",
    "wonderful",
    "excellent",
    "fantastic",
    "perfect",
  ]
  const negativeKeywords = [
    "frustrated",
    "angry",
    "upset",
    "sad",
    "terrible",
    "horrible",
    "awful",
    "hate",
    "stressed",
    "worried",
    "anxious",
  ]
  const neutralKeywords = ["ok", "fine", "normal", "regular", "average"]

  const lowerText = text.toLowerCase()
  let positive = 0
  let negative = 0
  let neutral = 0

  positiveKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) positive += 1
  })
  negativeKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) negative += 1
  })
  neutralKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) neutral += 1
  })

  const total = positive + negative + neutral || 1
  const positivePercent = (positive / total) * 100
  const negativePercent = (negative / total) * 100
  const neutralPercent = (neutral / total) * 100

  let sentiment = "neutral"
  let score = 0.5
  let tone = "balanced"

  if (positive > negative && positive > neutral) {
    sentiment = "positive"
    score = Math.min(0.5 + positivePercent / 100, 1)
    tone = "optimistic"
  } else if (negative > positive && negative > neutral) {
    sentiment = "negative"
    score = Math.max(0.5 - negativePercent / 100, 0)
    tone = "stressed"
  }

  const recommendations: string[] = []
  if (negativePercent > 40) {
    recommendations.push("Consider taking a 5-minute break")
    recommendations.push("Recommend scheduling relaxation time")
  }
  if (tone === "optimistic") {
    recommendations.push("Great time for creative tasks")
  }

  return {
    sentiment,
    score,
    emotions: {
      positive: positivePercent,
      negative: negativePercent,
      neutral: neutralPercent,
    },
    tone,
    recommendations,
  }
}

async function handler(request: NextRequest) {
  try {
    const { texts, source } = (await request.json()) as {
      texts: string[]
      source?: string
    }

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: "Invalid text data provided" }, { status: 400 })
    }

    const sanitizedTexts = texts.map((text) => sanitizeInput(text))

    const results = sanitizedTexts.map((text) => ({
      text: text.substring(0, 100),
      analysis: analyzeEmotions(text),
      source: sanitizeInput(source) || "unknown",
      timestamp: new Date().toISOString(),
    }))

    const aggregated = {
      averageSentiment: results.reduce((sum, r) => sum + r.analysis.score, 0) / results.length,
      averageEmotions: {
        positive: results.reduce((sum, r) => sum + r.analysis.emotions.positive, 0) / results.length,
        negative: results.reduce((sum, r) => sum + r.analysis.emotions.negative, 0) / results.length,
        neutral: results.reduce((sum, r) => sum + r.analysis.emotions.neutral, 0) / results.length,
      },
      totalAnalyzed: results.length,
    }

    console.log("[API] Emotion analysis complete:", { source, count: results.length })

    return NextResponse.json({
      success: true,
      results,
      aggregated,
    })
  } catch (error) {
    console.error("[API] Emotion analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze emotions" }, { status: 500 })
  }
}

export const POST = withSecurityMiddleware(handler)
