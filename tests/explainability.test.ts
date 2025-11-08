import { describe, it, expect } from 'vitest'
import { explainEmotion } from '@/lib/explainability'

describe('explainability', () => {
  it('returns explanation tokens for text', () => {
    const r = explainEmotion('I am very happy and excited')
    expect(r.score).toBeDefined()
    expect(Array.isArray(r.explanation)).toBe(true)
  })
})
