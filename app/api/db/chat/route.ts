import { saveChatMessage, getChatHistory } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 })
    }

    try {
      const history = await getChatHistory(Number.parseInt(userId), 50)
      return Response.json(history)
    } catch (err: any) {
      console.warn('[API] DB unavailable, returning demo chat history:', err?.message)
      const demo = [
        { id: 1, user_id: Number(userId), message_text: 'Welcome to AI Heir!', sender: 'assistant', created_at: new Date().toISOString() },
      ]
      return Response.json(demo)
    }
  } catch (error) {
    console.error("[v0] Error fetching chat history:", error)
    return Response.json({ error: "Failed to fetch chat history" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, messageText, sender } = await request.json()

    if (!userId || !messageText || !sender) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const result = await saveChatMessage(Number.parseInt(userId), messageText, sender)
      return Response.json(result)
    } catch (err: any) {
      console.warn('[v0] DB unavailable, echoing chat message locally:', err?.message)
      const demo = { id: Date.now(), user_id: Number(userId), message_text: messageText, sender, created_at: new Date().toISOString() }
      return Response.json(demo)
    }
  } catch (error) {
    console.error("[v0] Error saving chat message:", error)
    return Response.json({ error: "Failed to save message" }, { status: 500 })
  }
}
