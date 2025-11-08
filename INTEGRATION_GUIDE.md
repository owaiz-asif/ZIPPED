# Backend Integration Details

## Data Fetching with SWR
The application uses SWR (stale-while-revalidate) for efficient data fetching and caching.

### How It Works
1. Custom hooks use SWR to fetch data from API endpoints
2. Data is cached locally while fresh data is fetched in background
3. UI updates automatically when data changes
4. Optimistic updates for better UX

### Example: Adding a Mood Entry
\`\`\`tsx
const { moodData, addMood } = useMoodData(userId)

// When user clicks mood button:
await addMood(moodScore, energyScore)
// -> POST /api/db/mood
// -> Database updates
// -> Local cache updates
// -> UI re-renders
\`\`\`

## Database Schema
All tables include:
- Primary key (id)
- User relationship (user_id)
- Timestamps (created_at, updated_at)
- Proper indexes for performance

## API Response Format
All API endpoints return either:
- Success: `data` or `[data]`
- Error: `{ error: "error message" }` with appropriate HTTP status

## Error Handling
- 400: Missing required fields
- 500: Database or server error
- Check console for detailed error messages

## Real-Time Updates
Data updates in real-time through:
1. SWR automatic revalidation
2. Manual cache mutation after operations
3. Instant local state updates

## Authentication
Currently using demo user (ID: 1). For production, implement:
- User authentication (Supabase, Auth0, etc.)
- Row-level security in Neon
- Protected API endpoints
- User-specific data queries
