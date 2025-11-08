import { neon } from "@neondatabase/serverless"

// Lazily initialize the neon client so missing/placeholder DATABASE_URL
// values don't crash during module import. Callers will receive a clearer
// runtime error when attempting DB access if DATABASE_URL isn't configured.
let _sql: ReturnType<typeof neon> | null = null
function getSql() {
  if (_sql) return _sql

  const conn = process.env.DATABASE_URL
  if (!conn || conn.includes('<username>') || conn.includes('<password>') || conn.includes('<host>')) {
    throw new Error(
      'Missing or invalid DATABASE_URL. Please set a valid connection string in .env.local',
    )
  }

  _sql = neon(conn)
  return _sql
}

export interface MoodEntry {
  id: number
  user_id: number
  mood_score: number
  energy_score: number
  notes?: string
  created_at: string
}

export interface Meeting {
  id: number
  user_id: number
  title: string
  attendees?: string
  duration: number
  scheduled_time?: string
  energy_score?: number
  status: string
  created_at: string
}

export interface Task {
  id: number
  user_id: number
  name: string
  category: string
  completed: boolean
  time_spent: number
  created_at: string
}

// Mood entries
export async function getMoodEntries(userId: number, limit = 10) {
  return await getSql()`SELECT * FROM mood_entries WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`
}

export async function addMoodEntry(userId: number, moodScore: number, energyScore: number, notes?: string) {
  return await getSql()`
    INSERT INTO mood_entries (user_id, mood_score, energy_score, notes)
    VALUES (${userId}, ${moodScore}, ${energyScore}, ${notes})
    RETURNING *
  `
}

// Meetings
export async function getMeetings(userId: number) {
  return await getSql()`SELECT * FROM meetings WHERE user_id = ${userId} ORDER BY scheduled_time`
}

export async function addMeeting(
  userId: number,
  title: string,
  attendees: string,
  duration: number,
  scheduledTime?: string,
) {
  return await getSql()`
    INSERT INTO meetings (user_id, title, attendees, duration, scheduled_time)
    VALUES (${userId}, ${title}, ${attendees}, ${duration}, ${scheduledTime})
    RETURNING *
  `
}

export async function updateMeetingStatus(meetingId: number, status: string) {
  return await getSql()`UPDATE meetings SET status = ${status} WHERE id = ${meetingId} RETURNING *`
}

// Tasks
export async function getTasks(userId: number) {
  return await getSql()`SELECT * FROM tasks WHERE user_id = ${userId} ORDER BY created_at DESC`
}

export async function addTask(userId: number, name: string, category: string) {
  return await getSql()`INSERT INTO tasks (user_id, name, category) VALUES (${userId}, ${name}, ${category}) RETURNING *`
}

export async function updateTask(taskId: number, completed: boolean) {
  return await getSql()`UPDATE tasks SET completed = ${completed}, updated_at = NOW() WHERE id = ${taskId} RETURNING *`
}

// Meeting Summaries
export interface MeetingSummary {
  id: string
  user_id: number
  title: string
  transcript: string
  key_takeaways: string[]
  action_items: string[]
  decisions: string[]
  unresolved_topics: string[]
  insights: {
    mostDiscussedTopic: string
    sentiment: string
    duration: number
    participantCount: number
  }
  audio_file_url?: string
  duration?: number
  created_at: string
}

export async function saveMeetingSummary(summary: MeetingSummary) {
  return await getSql()`
    INSERT INTO meeting_summaries (
      id, user_id, title, transcript, key_takeaways, action_items, 
      decisions, unresolved_topics, insights, audio_file_url, duration
    )
    VALUES (
      ${summary.id}, ${summary.user_id}, ${summary.title}, ${summary.transcript},
      ${JSON.stringify(summary.key_takeaways)}::jsonb,
      ${JSON.stringify(summary.action_items)}::jsonb,
      ${JSON.stringify(summary.decisions)}::jsonb,
      ${JSON.stringify(summary.unresolved_topics)}::jsonb,
      ${JSON.stringify(summary.insights)}::jsonb,
      ${summary.audio_file_url || null}, ${summary.duration || null}
    )
    RETURNING *
  `
}

export async function getMeetingSummaries(userId: number) {
  return await getSql()`
    SELECT * FROM meeting_summaries 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `
}

export async function getMeetingSummary(meetingId: string, userId: number) {
  return await getSql()`
    SELECT * FROM meeting_summaries 
    WHERE id = ${meetingId} AND user_id = ${userId}
  `
}

// Emotion analyses
export async function saveEmotionAnalysis(
  userId: number,
  textInput: string,
  sentiment: string,
  intensity: number,
  emotions: any,
  recommendation: string,
) {
  return await getSql()`
    INSERT INTO emotion_analyses (user_id, text_input, sentiment, intensity, emotions, recommendation)
    VALUES (${userId}, ${textInput}, ${sentiment}, ${intensity}, ${JSON.stringify(emotions)}, ${recommendation})
    RETURNING *
  `
}

export async function getEmotionHistory(userId: number, limit = 20) {
  return await getSql()`SELECT * FROM emotion_analyses WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`
}

// Chat messages
export async function saveChatMessage(userId: number, messageText: string, sender: "user" | "assistant") {
  return await getSql()`INSERT INTO chat_messages (user_id, message_text, sender) VALUES (${userId}, ${messageText}, ${sender}) RETURNING *`
}

export async function getChatHistory(userId: number, limit = 50) {
  return await getSql()`SELECT * FROM chat_messages WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`
}
