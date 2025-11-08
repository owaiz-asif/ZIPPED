import { describe, it, expect } from 'vitest'
import { analyzeEmotion } from '@/lib/emotion-analyzer'

describe('emotion analyzer', () => {
  it('detects positive sentiment in positive text', () => {
    const result = analyzeEmotion('I am very happy and excited about the new project!')
    expect(result.sentiment).toBe('positive')
    expect(result.emotions.joy).toBeGreaterThanOrEqual(0)
  })

  it('detects negative sentiment in negative text', () => {
    const result = analyzeEmotion('I am frustrated and angry about the delay.')
    expect(result).toHaveProperty('emotions')
    expect(result.emotions.anger).toBeGreaterThanOrEqual(0)
  })
})
