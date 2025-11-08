# AI Heir - Complete Setup Guide

## Overview
AI Heir is a fully integrated emotionally intelligent assistant platform with a complete backend-frontend system.

## Features
- **Real-time Mood Tracking**: Track mood and energy levels throughout the day
- **Voice-Enabled Chat**: Talk to your AI assistant using the Web Speech API
- **Emotion Analysis**: Local NLP engine that analyzes emotional content
- **Task Management**: Organize tasks by category with time tracking
- **Meeting Scheduler**: Intelligent meeting time recommendations based on energy levels
- **Productivity Analytics**: Track productivity metrics and trends

## Prerequisites
- Node.js 18+ 
- Neon PostgreSQL database
- Environment variables configured

## Installation & Setup

### Step 1: Database Setup
1. Create a Neon PostgreSQL database (free tier available at neon.tech)
2. Copy your `DATABASE_URL` connection string
3. Add it to your `.env.local` file:
\`\`\`
DATABASE_URL=postgresql://user:password@project.neon.tech/dbname
\`\`\`

### Step 2: Initialize Database
Run the database initialization script:
\`\`\`bash
npm run db:init
# or manually execute: scripts/setup-database.sql in your Neon dashboard
\`\`\`

This creates all necessary tables:
- `users` - User accounts
- `mood_entries` - Mood and energy tracking
- `emotion_analyses` - Emotion analysis results
- `meetings` - Scheduled meetings
- `tasks` - Task management
- `chat_messages` - Chat history

### Step 3: Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### Step 4: Run Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Visit `http://localhost:3000` to see the application.

### Step 5: Create Demo User
The database initialization creates a demo user with:
- Email: `demo@aiheir.com`
- Name: `Demo User`
- ID: 1 (used by default in the app)

## API Endpoints

### Mood Management
- `GET /api/db/mood?userId=1` - Fetch mood entries
- `POST /api/db/mood` - Create mood entry
\`\`\`json
{
  "userId": 1,
  "moodScore": 75,
  "energyScore": 80,
  "notes": "feeling great today"
}
\`\`\`

### Task Management
- `GET /api/db/tasks?userId=1` - Fetch tasks
- `POST /api/db/tasks` - Create task
\`\`\`json
{
  "userId": 1,
  "name": "Complete project",
  "category": "work"
}
\`\`\`
- `PATCH /api/db/tasks/[id]` - Update task status

### Meeting Management
- `GET /api/db/meetings?userId=1` - Fetch meetings
- `POST /api/db/meetings` - Create meeting
\`\`\`json
{
  "userId": 1,
  "title": "Team Standup",
  "attendees": "team@company.com",
  "duration": 30,
  "scheduledTime": "2024-01-15T10:00:00Z"
}
\`\`\`

### Chat Management
- `GET /api/db/chat?userId=1` - Fetch chat history
- `POST /api/db/chat` - Save chat message
\`\`\`json
{
  "userId": 1,
  "messageText": "How can you help me?",
  "sender": "user"
}
\`\`\`

## Data Persistence
All data is automatically persisted to your Neon PostgreSQL database:
- Mood entries are saved when you click quick mood buttons or submit mood data
- Tasks are saved when created and updated when toggled
- Chat messages are saved for both user and assistant
- Meetings are saved when scheduled

## Custom Hooks
The app uses custom React hooks for data management:

### useMoodData
\`\`\`tsx
const { moodData, addMood, isLoading, error } = useMoodData(userId)
\`\`\`

### useTasksData
\`\`\`tsx
const { tasks, addTask, toggleTask, isLoading, error } = useTasksData(userId)
\`\`\`

### useMeetingsData
\`\`\`tsx
const { meetings, addMeeting, isLoading, error } = useMeetingsData(userId)
\`\`\`

### useChatData
\`\`\`tsx
const { messages, addMessage, isLoading, error } = useChatData(userId)
\`\`\`

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correctly set in `.env.local`
- Check Neon dashboard for connection status
- Ensure the database hasn't reached connection limit

### Data Not Persisting
- Check browser console for API errors
- Verify API routes are working: `/api/db/mood?userId=1`
- Confirm database tables exist in Neon dashboard

### Voice Recognition Not Working
- Ensure HTTPS or localhost (required for Web Speech API)
- Check browser permissions for microphone access
- Note: Not all browsers support Web Speech API (works best in Chrome/Edge)

## Production Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set `DATABASE_URL` environment variable in Vercel settings
4. Deploy

### Environment Variables Required
\`\`\`
DATABASE_URL=your_neon_connection_string
\`\`\`

## Architecture

\`\`\`
Frontend (React + Next.js)
├── Dashboard (Mood & Energy tracking)
├── Chat Interface (Voice + Text)
├── Productivity Tracker (Tasks)
└── Meeting Scheduler (Time optimization)
        ↓
   Custom Data Hooks (SWR)
        ↓
   API Routes (Next.js)
        ↓
   Database Functions (Neon SQL)
        ↓
   Neon PostgreSQL
\`\`\`

## Support
For issues or questions, check the browser console and API responses for detailed error messages.
