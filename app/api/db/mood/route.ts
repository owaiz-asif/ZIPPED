import { addMoodEntry, getMoodEntries } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 })
    }

    try {
      const entries = await getMoodEntries(Number.parseInt(userId))
      return Response.json(entries)
    } catch (err: any) {
      // If DB isn't configured, return demo entries so the app remains usable offline.
      console.warn('[API] DB unavailable, returning demo mood entries:', err?.message)
      const demo = [
        { id: 1, user_id: Number(userId), mood_score: 65, energy_score: 70, created_at: new Date().toISOString() },
        { id: 2, user_id: Number(userId), mood_score: 72, energy_score: 85, created_at: new Date().toISOString() },
      ]
      return Response.json(demo)
    }
  } catch (error) {
    return Response.json({ error: "Failed to fetch mood entries" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, moodScore, energyScore, notes } = await request.json()

    if (!userId || moodScore === undefined || energyScore === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const result = await addMoodEntry(userId, moodScore, energyScore, notes)
      return Response.json(result)
    } catch (err: any) {
      console.warn('[API] DB unavailable, returning demo saved mood entry:', err?.message)
      const demo = {
        id: Date.now(),
        user_id: userId,
        mood_score: moodScore,
        energy_score: energyScore,
        notes: notes || null,
        created_at: new Date().toISOString(),
      }
      return Response.json(demo)
    }
  } catch (error) {
    return Response.json({ error: "Failed to save mood entry" }, { status: 500 })
  }
}
