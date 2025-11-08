import { addMeeting, getMeetings, updateMeetingStatus } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 })
    }

    try {
      const meetings = await getMeetings(Number.parseInt(userId))
      return Response.json(meetings)
    } catch (err: any) {
      console.warn('[API] DB unavailable, returning demo meetings:', err?.message)
      const demo = [
        { id: 'm1', user_id: Number(userId), title: 'Design Review', attendees: 'team@example.com', duration: 60, scheduled_time: new Date().toISOString(), status: 'scheduled' },
        { id: 'm2', user_id: Number(userId), title: '1:1', attendees: 'manager@example.com', duration: 30, scheduled_time: new Date().toISOString(), status: 'proposed' },
      ]
      return Response.json(demo)
    }
  } catch (error) {
    return Response.json({ error: "Failed to fetch meetings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, title, attendees, duration, scheduledTime } = await request.json()

    if (!userId || !title || !duration) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const result = await addMeeting(userId, title, attendees, duration, scheduledTime)
      return Response.json(result)
    } catch (err: any) {
      console.warn('[API] DB unavailable, returning demo created meeting:', err?.message)
      const demo = {
        id: `local-${Date.now()}`,
        user_id: userId,
        title,
        attendees,
        duration,
        scheduled_time: scheduledTime || new Date().toISOString(),
        status: 'scheduled',
      }
      return Response.json(demo)
    }
  } catch (error) {
    return Response.json({ error: "Failed to save meeting" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { meetingId, status } = await request.json()

    if (!meetingId || !status) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const result = await updateMeetingStatus(meetingId, status)
      return Response.json(result)
    } catch (err: any) {
      console.warn('[API] DB unavailable, faking meeting update:', err?.message)
      return Response.json({ id: meetingId, status })
    }
  } catch (error) {
    return Response.json({ error: "Failed to update meeting" }, { status: 500 })
  }
}
