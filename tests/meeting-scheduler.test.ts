import { describe, it, expect } from 'vitest'
import { predictMeetingTimes, getScheduleWarnings } from '@/lib/meeting-scheduler'

describe('meeting-scheduler predictor', () => {
  it('returns an array of predictions', () => {
    const preds = predictMeetingTimes()
    expect(Array.isArray(preds)).toBe(true)
    expect(preds.length).toBeGreaterThan(0)
    preds.forEach((p) => {
      expect(typeof p.time).toBe('string')
      expect(typeof p.activity).toBe('string')
      expect(typeof p.confidence).toBe('number')
    })
  })

  it('returns some schedule warnings', () => {
    const warnings = getScheduleWarnings()
    expect(Array.isArray(warnings)).toBe(true)
    expect(warnings.length).toBeGreaterThan(0)
    expect(typeof warnings[0]).toBe('string')
  })
})
