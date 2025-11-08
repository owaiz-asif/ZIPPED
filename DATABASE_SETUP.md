# AI Heir Database Setup

## Overview
This project uses Neon PostgreSQL for storing user data, mood entries, meetings, tasks, and chat history.

## Required Environment Variable
Make sure you have `DATABASE_URL` set in your environment variables from Neon.

## Setup Instructions

### 1. Create the Database Tables
Run the SQL initialization script in your Neon console or using the v0 scripts system:

\`\`\`bash
npm run db:init
\`\`\`

### 2. Available API Endpoints

#### Mood Entries
- `GET /api/db/mood?userId=1` - Get all mood entries for a user
- `POST /api/db/mood` - Save a new mood entry
  \`\`\`json
  {
    "userId": 1,
    "moodScore": 75,
    "energyScore": 80,
    "notes": "Feeling great today"
  }
  \`\`\`

#### Meetings
- `GET /api/db/meetings?userId=1` - Get all meetings for a user
- `POST /api/db/meetings` - Schedule a new meeting
  \`\`\`json
  {
    "userId": 1,
    "title": "Team Standup",
    "attendees": "5 people",
    "duration": 30,
    "scheduledTime": "2024-01-20T10:00:00Z"
  }
  \`\`\`
- `PUT /api/db/meetings` - Update meeting status
  \`\`\`json
  {
    "meetingId": 1,
    "status": "scheduled"
  }
  \`\`\`

#### Tasks
- `GET /api/db/tasks?userId=1` - Get all tasks for a user
- `POST /api/db/tasks` - Create a new task
  \`\`\`json
  {
    "userId": 1,
    "name": "Complete project",
    "category": "work"
  }
  \`\`\`
- `PUT /api/db/tasks` - Toggle task completion
  \`\`\`json
  {
    "taskId": 1,
    "completed": true
  }
  \`\`\`

## Database Schema

### users
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE)
- `name` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### mood_entries
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FK)
- `mood_score` (INTEGER 0-100)
- `energy_score` (INTEGER 0-100)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

### meetings
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FK)
- `title`, `attendees`, `duration`
- `scheduled_time`, `energy_score`
- `status` (proposed/scheduled/completed)
- `created_at` (TIMESTAMP)

### tasks
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FK)
- `name`, `category`
- `completed` (BOOLEAN)
- `time_spent` (DECIMAL)
- `created_at`, `updated_at` (TIMESTAMP)

### emotion_analyses
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FK)
- `text_input`, `sentiment`, `intensity`
- `emotions` (JSONB)
- `recommendation` (TEXT)
- `created_at` (TIMESTAMP)

### chat_messages
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FK)
- `message_text`, `sender`
- `created_at` (TIMESTAMP)
