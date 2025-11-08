import { type NextRequest, NextResponse } from "next/server"
import { predictMeetingTimes, getScheduleWarnings } from '@/lib/meeting-scheduler'

export async function GET(request: NextRequest) {
  try {
    const predictions = predictMeetingTimes()
    const warnings = getScheduleWarnings()

    console.log('[API] Meeting predictions generated')

    return NextResponse.json({
      success: true,
      predictions,
      warnings,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[API] Meeting prediction error:', error)
    return NextResponse.json({ error: 'Failed to predict meeting times' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, date } = await request.json()

    if (!userId || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const predictions = predictMeetingTimes()

    console.log('[API] Custom meeting predictions for user:', userId)

    return NextResponse.json({
      success: true,
      predictions,
      optimizedSchedule: predictions.map((p) => ({
        ...p,
        date,
      })),
    })
  } catch (error) {
    console.error('[API] Meeting scheduling error:', error)
    return NextResponse.json({ error: 'Failed to create meeting schedule' }, { status: 500 })
  }
}
