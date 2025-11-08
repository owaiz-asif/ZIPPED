import { describe, it, expect, beforeEach } from 'vitest'
import { generateDraft } from '@/lib/email-drafts'

describe('email-drafts generator (local fallback)', () => {
  beforeEach(() => {
    // Ensure provider env vars are not set so we test local fallback
    delete process.env.OPENAI_API_KEY
    delete process.env.VERCEL_AI_TOKEN
    delete process.env.AI_API_KEY
  })

  it('returns a draft string for normal input', async () => {
    const res = await generateDraft({ incomingEmailText: 'Hello, can we reschedule?', senderName: 'Alice' })
    expect(typeof res).toBe('string')
    expect(res.length).toBeGreaterThan(10)
  })

  it('throws on sensitive content without consent', async () => {
    await expect(
      generateDraft({ incomingEmailText: 'My SSN is 123-45-6789', senderName: 'Bob' } as any),
    ).rejects.toThrow()
  })
})
