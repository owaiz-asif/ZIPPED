import { type NextRequest, NextResponse } from 'next/server'
import { anchorPayload } from '@/lib/blockchain'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    if (!payload) return NextResponse.json({ error: 'Missing payload' }, { status: 400 })

    const entry = anchorPayload(payload)
    return NextResponse.json({ success: true, entry })
  } catch (err: any) {
    console.error('[blockchain/anchor] error:', err)
    return NextResponse.json({ error: 'Failed to anchor payload' }, { status: 500 })
  }
}
