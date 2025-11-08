import { describe, it, expect } from 'vitest'
import { anchorPayload } from '@/lib/blockchain'

describe('blockchain anchor', () => {
  it('creates a hash and log entry for payload', () => {
    const payload = { foo: 'bar', n: 1 }
    const entry = anchorPayload(payload)
    expect(entry.hash).toBeDefined()
    expect(entry.payload).toEqual(payload)
    expect(entry.ts).toBeDefined()
  })
})
