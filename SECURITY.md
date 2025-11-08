# Security Configuration Guide

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_API_URL` - Base URL for API calls (e.g., http://localhost:3000)

### Optional AI/LLM Services
- `OPENAI_API_KEY` - OpenAI API key for GPT models
- `DEEPINFRA_API_KEY` - Deep Infra API key for alternative LLM models
- `GROQ_API_KEY` - Groq API key for fast inference

### Optional Social Media Integration
- `NEXT_PUBLIC_GMAIL_API_KEY` - Gmail API credentials
- `NEXT_PUBLIC_LINKEDIN_CLIENT_ID` - LinkedIn OAuth client ID
- `TWITTER_API_KEY` - Twitter API key
- `TWITTER_API_SECRET` - Twitter API secret
- `TWITTER_ACCESS_TOKEN` - Twitter access token
- `TWITTER_ACCESS_SECRET` - Twitter access secret

### Optional Storage
- `DATABASE_URL` - Database connection string
- `REDIS_URL` - Redis connection for caching

### GCP Configuration (Optional)
- `GCP_PROJECT_ID` - Google Cloud Project ID
- `GCP_PRIVATE_KEY` - GCP service account private key
- `GCP_CLIENT_EMAIL` - GCP service account email
- `GOOGLE_OAUTH_CLIENT_SECRET` - Google OAuth secret

### Blockchain Configuration (Optional)
- `ETHEREUM_RPC_URL` - Ethereum RPC endpoint
- `BLOCKCHAIN_CONTRACT_ADDRESS` - Smart contract address

## Setup Instructions

### 1. Development Environment
\`\`\`bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your API keys
# IMPORTANT: Never commit .env.local to version control
\`\`\`

### 2. Production Environment (Vercel)
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all required and optional variables:
   - Add `NEXT_PUBLIC_API_URL` pointing to your production domain
   - Add all API keys and secrets

### 3. Security Best Practices

#### API Key Management
- Always use environment variables for sensitive data
- Never commit keys to version control
- Rotate keys regularly
- Use different keys for development and production
- Store keys in a secure password manager

#### Request Validation
- All POST requests require `Content-Type: application/json`
- Input is automatically sanitized to prevent XSS attacks
- Rate limiting is enforced at 100 requests per minute per client

#### Security Headers
The application automatically sets the following security headers:
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Enables browser XSS protection
- `Content-Security-Policy` - Restricts resource loading
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information

#### Data Protection
- Sensitive data is masked in logs
- Input is truncated to 5000 characters
- Special characters are filtered from user input
- HTML/JavaScript injection is prevented

## Monitoring & Logging

All API requests are logged with:
- Request method and path
- Response status code
- Timestamp
- Client identifier (IP address)

Errors are logged with sensitive data masked:
\`\`\`javascript
{
  error: "message",
  apiKey: "sk_live_****"  // Masked for security
}
\`\`\`

## Troubleshooting

### "Missing required environment variables"
- Check that `NEXT_PUBLIC_API_URL` is set
- In development: verify .env.local exists and has the correct value
- In production: check Vercel Environment Variables

### "Rate limit exceeded"
- The API enforces 100 requests per minute per IP
- Wait 60 seconds before retrying

### "Content-Type must be application/json"
- Ensure POST requests have the correct header
- Example: `headers: { 'Content-Type': 'application/json' }`

## API Security Headers

All API responses include security headers. Custom API requests should include:
\`\`\`javascript
fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ /* data */ })
})
\`\`\`

## Third-Party Services

When integrating third-party services:
1. Use environment variables for all credentials
2. Implement proper error handling
3. Log requests without exposing sensitive data
4. Validate all responses
5. Set appropriate timeouts
