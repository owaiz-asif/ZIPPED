import { type NextRequest, NextResponse } from "next/server"

interface SummaryRequest {
  transcript: string
  userId: number
  title: string
}

// AI-powered summarization using NLP patterns
function extractActionItems(text: string): string[] {
  const actionPatterns = [
    /(?:will|should|need to|must|going to)\s+([^.!?]+(?:by|before|until|on)\s+\w+[^.!?]*)/gi,
    /(?:action|todo|task):\s*([^\n]+)/gi,
    /(?:assign|delegate|responsible for):\s*([^\n]+)/gi,
  ]

  const actions: string[] = []
  actionPatterns.forEach((pattern) => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const action = match[1]?.trim()
      if (action && action.length > 10) {
        actions.push(action)
      }
    }
  })

  // Extract numbered/bulleted action items
  const numberedActions = text.match(/\d+\.\s+([^\n]+)/g)
  if (numberedActions) {
    numberedActions.forEach((item) => {
      const action = item.replace(/^\d+\.\s+/, "").trim()
      if (action.length > 10 && !actions.includes(action)) {
        actions.push(action)
      }
    })
  }

  return actions.slice(0, 10) // Limit to 10 action items
}

function extractDecisions(text: string): string[] {
  const decisionPatterns = [
    /(?:decided|agreed|concluded|chose|selected|approved)\s+(?:to|that|on|with)\s+([^.!?]+)/gi,
    /(?:decision|conclusion):\s*([^\n]+)/gi,
    /(?:we|team|group)\s+(?:will|are going to|have decided to)\s+([^.!?]+)/gi,
  ]

  const decisions: string[] = []
  decisionPatterns.forEach((pattern) => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const decision = match[1]?.trim()
      if (decision && decision.length > 15) {
        decisions.push(decision)
      }
    }
  })

  return decisions.slice(0, 8)
}

function extractKeyTakeaways(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
  
  // Score sentences by keywords
  const scored = sentences.map(sentence => {
    const lower = sentence.toLowerCase()
    let score = 0
    
    // Important keywords
    if (lower.includes('important') || lower.includes('critical') || lower.includes('key')) score += 3
    if (lower.includes('deadline') || lower.includes('timeline') || lower.includes('schedule')) score += 2
    if (lower.includes('progress') || lower.includes('completed') || lower.includes('finished')) score += 2
    if (lower.includes('issue') || lower.includes('problem') || lower.includes('blocker')) score += 2
    if (lower.includes('next') || lower.includes('future') || lower.includes('upcoming')) score += 1
    
    return { sentence: sentence.trim(), score }
  })

  // Sort by score and take top takeaways
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.sentence)
    .filter(s => s.length > 30)
}

function extractUnresolvedTopics(text: string): string[] {
  const unresolvedPatterns = [
    /(?:haven't|have not|didn't|did not|need to|still need|pending|unresolved|open question)\s+([^.!?]+)/gi,
    /(?:to be determined|TBD|TBA|under discussion|needs discussion):\s*([^\n]+)/gi,
    /(?:question|issue|concern|topic)\s+(?:about|regarding|regarding)\s+([^.!?]+)/gi,
  ]

  const topics: string[] = []
  unresolvedPatterns.forEach((pattern) => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const topic = match[1]?.trim()
      if (topic && topic.length > 15) {
        topics.push(topic)
      }
    }
  })

  return topics.slice(0, 6)
}

function extractInsights(text: string, duration: number) {
  const lowerText = text.toLowerCase()
  
  // Find most discussed topic (word frequency)
  const words = lowerText.split(/\s+/).filter(w => w.length > 4)
  const wordFreq: { [key: string]: number } = {}
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  const mostDiscussed = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)
    .find(w => !['meeting', 'discuss', 'project', 'team', 'client'].includes(w)) || "General Discussion"

  // Sentiment analysis
  const positiveWords = ['great', 'excellent', 'good', 'happy', 'progress', 'completed', 'success']
  const negativeWords = ['issue', 'problem', 'blocker', 'delay', 'concern', 'risk', 'challenge']
  
  const positiveCount = positiveWords.reduce((sum, word) => sum + (lowerText.match(new RegExp(word, 'g')) || []).length, 0)
  const negativeCount = negativeWords.reduce((sum, word) => sum + (lowerText.match(new RegExp(word, 'g')) || []).length, 0)
  
  let sentiment = "neutral"
  if (positiveCount > negativeCount + 2) sentiment = "positive"
  else if (negativeCount > positiveCount + 2) sentiment = "negative"

  // Estimate participant count (count unique names or "I" statements)
  const participantCount = Math.max(2, Math.min(10, (text.match(/\b(I|we|they|he|she)\b/gi) || []).length / 10)))

  return {
    mostDiscussedTopic: mostDiscussed.charAt(0).toUpperCase() + mostDiscussed.slice(1),
    sentiment,
    duration,
    participantCount,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SummaryRequest = await request.json()
    const { transcript, userId, title } = body

    if (!transcript || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Extract structured information
    const keyTakeaways = extractKeyTakeaways(transcript)
    const actionItems = extractActionItems(transcript)
    const decisions = extractDecisions(transcript)
    const unresolvedTopics = extractUnresolvedTopics(transcript)
    
    // Estimate duration (words per minute ~ 150, average)
    const wordCount = transcript.split(/\s+/).length
    const estimatedDuration = Math.max(60, Math.floor((wordCount / 150) * 60))
    
    const insights = extractInsights(transcript, estimatedDuration)

    const summary = {
      id: `meeting-${Date.now()}`,
      title: title || `Meeting ${new Date().toLocaleDateString()}`,
      transcript,
      keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : ["No specific takeaways identified"],
      actionItems: actionItems.length > 0 ? actionItems : ["No action items identified"],
      decisions: decisions.length > 0 ? decisions : ["No explicit decisions recorded"],
      unresolvedTopics: unresolvedTopics.length > 0 ? unresolvedTopics : [],
      insights,
      createdAt: new Date().toISOString(),
    }

    // Save to database
    try {
      const { saveMeetingSummary } = await import("@/lib/db")
      await saveMeetingSummary({
        ...summary,
        user_id: userId,
      })
    } catch (error) {
      console.warn("[API] Failed to save meeting summary to database:", error)
      // Continue even if DB save fails
    }

    return NextResponse.json({
      success: true,
      summary,
    })
  } catch (error: any) {
    console.error("[API] Summarization error:", error)
    return NextResponse.json({ error: "Failed to generate summary", details: error.message }, { status: 500 })
  }
}

