import { analyzeEmotion } from './emotion-analyzer'

export function explainEmotion(text: string) {
  // Run the analyzer and also return matched keywords as an explanation
  const score = analyzeEmotion(text)

  const lower = text.toLowerCase()
  const words = lower.split(/\s+/)
  const matched: Record<string, number> = {}

  words.forEach((w) => {
    const clean = w.replace(/[.,!?;:]/g, '')
    if (!clean) return
    if (lower.includes(clean)) {
      if (score.emotions[clean as keyof typeof score.emotions] !== undefined) {
        matched[clean] = (matched[clean] || 0) + 1
      }
    }
  })

  return {
    score,
    explanation: Object.keys(matched).map((k) => ({ token: k, count: matched[k] })),
  }
}
