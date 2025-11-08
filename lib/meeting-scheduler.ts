export interface MeetingPrediction {
  time: string
  activity: string
  reason: string
  confidence: number
  energyLevel: string
}

export function predictMeetingTimes(): MeetingPrediction[] {
  // Lightweight, deterministic predictor used for demo/offline mode.
  // Production should analyze user calendar, energy, and historical data.
  return [
    {
      time: '10:00 AM',
      activity: 'Design Review',
      reason: 'Peak energy & focus detected',
      confidence: 95,
      energyLevel: 'High',
    },
    {
      time: '2:30 PM',
      activity: 'Team Sync',
      reason: 'Good mood, open to discussion',
      confidence: 88,
      energyLevel: 'Medium-High',
    },
    {
      time: '4:00 PM',
      activity: 'Creative Brainstorm',
      reason: 'High creativity index observed',
      confidence: 92,
      energyLevel: 'High-Creative',
    },
  ]
}

export function getScheduleWarnings(): string[] {
  return [
    'Avoid back-to-back meetings before 9 AM based on energy patterns',
    'Consider buffer time between meetings for mental reset',
    'Late afternoon meetings should be kept under 30 minutes',
  ]
}
