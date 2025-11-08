import { type NextRequest, NextResponse } from "next/server"
import { getMeetingSummaries } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    try {
      const dbMeetings = await getMeetingSummaries(Number.parseInt(userId))
      
      // Transform database format to component format
      const meetings = dbMeetings.map((m: any) => ({
        id: m.id,
        title: m.title,
        transcript: m.transcript,
        keyTakeaways: m.key_takeaways || [],
        actionItems: m.action_items || [],
        decisions: m.decisions || [],
        unresolvedTopics: m.unresolved_topics || [],
        insights: m.insights || {
          mostDiscussedTopic: "General Discussion",
          sentiment: "neutral",
          duration: 0,
          participantCount: 0,
        },
        createdAt: m.created_at,
      }))

      return NextResponse.json({
        success: true,
        meetings,
      })
    } catch (error: any) {
      console.warn("[API] DB unavailable, returning empty list:", error?.message)
      return NextResponse.json({
        success: true,
        meetings: [],
      })
    }
  } catch (error: any) {
    console.error("[API] Error fetching transcripts:", error)
    return NextResponse.json({ error: "Failed to fetch transcripts" }, { status: 500 })
  }
}

