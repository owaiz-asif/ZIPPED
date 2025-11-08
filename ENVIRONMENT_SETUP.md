# Environment Variables Setup Guide

## Quick Start

### Step 1: Create Local Environment File
\`\`\`bash
cp .env.example .env.local
\`\`\`

### Step 2: Add Required Variables
Edit `.env.local` and add:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### Step 3: Add Optional Services (As Needed)

#### For AI/LLM Features
\`\`\`
OPENAI_API_KEY=sk_test_your_key_here
# OR
GROQ_API_KEY=gsk_your_key_here
# OR
DEEPINFRA_API_KEY=your_key_here
\`\`\`

#### For Social Media Integration
\`\`\`
NEXT_PUBLIC_GMAIL_API_KEY=your_gmail_key
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_id
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
\`\`\`

#### For Database (Optional)
\`\`\`
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
\`\`\`

## Production Deployment (Vercel)

### Step 1: Set Environment Variables in Vercel
1. Go to your project at https://vercel.com
2. Select "Settings" → "Environment Variables"
3. Add each variable for Production, Preview, and Development as needed

### Step 2: Recommended Production Variables
\`\`\`
NEXT_PUBLIC_API_URL=https://your-domain.com
NODE_ENV=production
OPENAI_API_KEY=sk_live_your_production_key
\`\`\`

### Step 3: Deploy
\`\`\`bash
git push origin main
# Vercel will automatically deploy with your environment variables
\`\`\`

## Variable Types

### Public Variables (NEXT_PUBLIC_*)
- Accessible in browser and server
- Safe to expose in code
- Use for: API URLs, public configuration
- **Never use for secrets or API keys**

### Secret Variables
- Only available on server
- Hidden from browser/client code
- Use for: API keys, database credentials, secrets
- Recommended for: OPENAI_API_KEY, DATABASE_URL, etc.

## Validation

The application validates environment variables on startup:
- ✅ Valid: Variable is set and not empty
- ⚠️ Warning: Optional variable is missing
- ❌ Error: Required variable is missing (app won't start)

Check the startup logs for validation results:
\`\`\`
[Security] Missing required environment variables: NEXT_PUBLIC_API_URL
[Security] Missing optional environment variables: OPENAI_API_KEY, DATABASE_URL
\`\`\`

## Common Issues

### Issue: "Cannot find module" for environment variables
**Solution:** Make sure variable names start with NEXT_PUBLIC_ if accessing from browser:
\`\`\`javascript
// ✅ Correct - accessible in browser
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// ❌ Wrong - not accessible in browser
const apiKey = process.env.OPENAI_API_KEY  // Server only
\`\`\`

### Issue: Environment variables not loading
**Solution:** 
1. Verify .env.local file exists (development)
2. Verify variables in Vercel dashboard (production)
3. Restart dev server: `npm run dev`
4. Hard refresh browser: Ctrl+Shift+R or Cmd+Shift+R

### Issue: Different values in development vs production
**Solution:** 
1. Use .env.local for development
2. Set separate variables in Vercel for production
3. Use NODE_ENV to check environment:
\`\`\`javascript
const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL 
  : 'http://localhost:3000'
