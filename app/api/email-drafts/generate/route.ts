import { type NextRequest, NextResponse } from 'next/server'
import { generateDraft } from '@/lib/email-drafts'

interface EmailDraftRequest {
  incomingEmailText: string
  senderName: string
  context?: string
  allowSensitive?: boolean
}

// Very small in-memory rate limiter: max 10 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 10
const ipMap = new Map<string, number[]>()

function getIpKey(req: NextRequest) {
  return (
    req.headers.get('x-forwarded-for') || (req as any).ip || req.headers.get('x-real-ip') || 'unknown'
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EmailDraftRequest
    const { incomingEmailText, senderName, allowSensitive } = body

    if (!incomingEmailText || !senderName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Rate limiting per IP
    const ip = getIpKey(request)
    const now = Date.now()
    const timestamps = ipMap.get(ip) || []
    const recent = timestamps.filter((t) => t > now - RATE_LIMIT_WINDOW_MS)
    if (recent.length >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }
    recent.push(now)
    ipMap.set(ip, recent)

    // Basic sensitive PII check — generation module will also reject
    const ssnLike = /\b\d{3}-\d{2}-\d{4}\b/
    const ccLike = /\b(?:\d[ -]*?){13,16}\b/
    if ((ssnLike.test(incomingEmailText) || ccLike.test(incomingEmailText)) && !allowSensitive) {
      return NextResponse.json({
        error: 'Message appears to contain sensitive personal data. Set allowSensitive=true to proceed after redacting or obtaining consent.',
      }, { status: 400 })
    }

    const draftResponse = await generateDraft({ incomingEmailText, senderName, context: body.context })

    console.log('[API] Email draft generated for:', senderName)

    return NextResponse.json({
      success: true,
      draft: draftResponse,
      context: {
        originalEmail: incomingEmailText,
        sender: senderName,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('[API] Email draft generation error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to generate email draft' }, { status: 500 })
  }
}
