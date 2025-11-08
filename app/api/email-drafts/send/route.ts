import { type NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-sender'

interface SendRequest {
  to: string
  subject: string
  draft: string
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, draft } = (await request.json()) as SendRequest
    if (!to || !subject || !draft) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
      const info = await sendEmail({ to, subject, text: draft })
      return NextResponse.json({ success: true, info })
    } catch (err: any) {
      console.error('[email-send] error:', err)
      return NextResponse.json({ error: 'Failed to send email', details: err?.message }, { status: 500 })
    }
  } catch (error) {
    console.error('[API] Email send error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
