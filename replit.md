# AI Heir - Emotionally Intelligent Assistant Platform

## Overview

AI Heir is a comprehensive emotionally intelligent assistant platform that combines mood tracking, productivity management, meeting scheduling, and AI-powered chat capabilities. The system uses a hybrid architecture with a Next.js frontend, Python-based RAG (Retrieval-Augmented Generation) service, and PostgreSQL database for persistent storage.

The platform focuses on understanding user emotions, optimizing productivity through intelligent scheduling, and providing contextual assistance through a knowledge base system.

## Recent Changes (November 2025)

### Replit Migration & Feature Enhancements
- **Navigation System**: Created comprehensive NavigationEnhanced component with all features accessible from top navbar (Dashboard, AI Chat, Tasks, Meetings, Emotions, Email, Blockchain, Social Media, RAG Upload, Settings)
- **Next.js 16 Compatibility**: Migrated from middleware.ts to proxy.ts per Next.js 16 requirements
- **Security Improvements**: Removed API key inputs from settings page frontend; now uses secure Replit secrets/environment variables
- **UX Enhancements**: Added global ErrorBoundary and app/loading.tsx for proper loading states
- **Replit Configuration**: Updated port binding to 5000 and 0.0.0.0 for proper Replit deployment
- **Production Deployment**: Configured autoscale deployment with proper build/start commands

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14+ with App Router
- **UI Library**: React with shadcn/ui components (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: SWR (stale-while-revalidate) for server state
- **Type Safety**: TypeScript with strict mode enabled

**Key Design Decisions**:
- Uses client-side rendering for interactive components (`"use client"` directive)
- Implements optimistic updates through SWR mutations for responsive UX
- Component-based architecture with isolated, reusable UI elements
- Custom hooks pattern for data fetching and business logic separation

### Backend Architecture

**API Layer**: Next.js API Routes (`/api/*`)
- RESTful endpoints for CRUD operations
- Serverless functions deployed on Vercel-compatible platforms
- Middleware for security headers and validation

**Python Services**: Flask-based microservice architecture
- **RAG Service** (`rag_service.py`): Standalone Flask server for document retrieval
- **RAG Engine** (`rag_engine.py`): FAISS-based vector search with sentence transformers
- Runs independently on port 5000 (configurable)
- CORS enabled for cross-origin requests from Next.js frontend

**Design Rationale**:
- Separation of concerns: Next.js handles UI/API, Python handles ML/NLP workloads
- Python chosen for RAG due to superior ML library ecosystem (FAISS, transformers)
- Microservice approach allows independent scaling and deployment

### Data Storage Solutions

**Primary Database**: Neon PostgreSQL (serverless)
- Connection via `@neondatabase/serverless` package
- Lazy initialization pattern to prevent startup crashes with invalid credentials
- Tables:
  - `users`: User account information
  - `mood_entries`: Mood and energy tracking with timestamps
  - `emotion_analyses`: Emotion analysis results
  - `meetings`: Meeting schedules with energy scores
  - `tasks`: Task management with categories and completion status
  - `chat_messages`: Chat history with sender identification

**Local Storage**: JSON files in `/data` directory
- `blockchain_log.json`: Immutable audit log with SHA-256 hashes
- Used for demonstration and lightweight persistence

**Design Decisions**:
- Neon chosen for serverless PostgreSQL with generous free tier
- Schema includes proper indexing on `user_id` and `created_at` for query performance
- All tables include `created_at` and `updated_at` timestamps for audit trails

### Authentication and Authorization

**Current Implementation**: Demo mode with hardcoded user ID (1)
- No authentication layer implemented yet
- All API endpoints assume authenticated user
- Ready for integration with Auth0, Supabase Auth, or NextAuth.js

**Security Measures**:
- Input sanitization functions in `lib/auth-guard.ts`
- Security headers via middleware (CSP, X-Frame-Options, etc.)
- Environment variable validation on startup
- Sensitive data exclusion patterns (SSN, credit card detection)

**Future Considerations**:
- Row-level security in PostgreSQL for multi-tenant isolation
- JWT-based session management
- OAuth integration for social login

### External Dependencies

**AI/ML Services**:
- **OpenAI API** (optional): GPT models for email draft generation
- **Vercel AI SDK**: Abstraction layer for multiple LLM providers
- **Local Models**: Sentence transformers and FAISS for RAG (offline-capable)

**Email Services**:
- **SMTP** (optional): Nodemailer for sending drafted emails
- Graceful degradation if not configured

**Social Media Integration** (optional):
- Gmail API
- LinkedIn OAuth
- Twitter API
- Slack webhooks

**Design Philosophy**:
- All external services are optional with fallback mechanisms
- Local-first approach for core features (emotion analysis, RAG)
- Environment variables control feature enablement

### Key Architectural Patterns

**Emotion Analysis**: 
- Local keyword-based NLP engine (`lib/emotion-analyzer.ts`)
- No external API dependencies
- Plutchik's wheel of emotions model (8 primary emotions)
- Deterministic scoring based on keyword matching and frequency

**RAG Pipeline**:
1. Document ingestion via Python scripts (`populate_rag_database.py`)
2. Text chunking with sentence boundary detection
3. Vector embeddings using sentence-transformers
4. FAISS index for similarity search
5. Context retrieval and answer generation
6. Next.js API proxy layer for frontend access

**Meeting Scheduling**:
- Energy-level based time slot recommendation
- Historical mood data analysis for optimal scheduling
- Rule-based system with configurable constraints
- Integrates with Google Calendar API (optional)

**Data Flow**:
```
User Input → React Component → SWR Hook → API Route → Database/Service
                    ↓                                         ↓
            Optimistic Update ← ← ← ← Response ← ← ← ← ← ← ←
```

**Error Handling Strategy**:
- Global error boundary for React component errors
- Try-catch blocks with fallback UI in async operations
- SWR automatic retry with exponential backoff
- Graceful degradation when external services unavailable

### Development Workflow

**Build System**: Next.js built-in bundler with Turbopack support
**Package Management**: npm (with pnpm/yarn alternatives supported)
**Python Dependencies**: pip with `requirements-rag.txt`

**Environment Setup**:
- `.env.local` for local development secrets
- `.env.example` template for required variables
- Vercel dashboard for production environment variables

**Deployment Architecture**:
- Next.js app: Vercel serverless functions
- PostgreSQL: Neon serverless database
- Python RAG service: Requires separate hosting (e.g., Railway, Render, or VM)

### Performance Optimizations

- SWR caching reduces unnecessary API calls
- Lazy loading of Python ML models on first RAG request
- Database connection pooling via Neon's serverless driver
- Client-side computation for emotion analysis (no round-trip)
- Component code splitting through Next.js automatic bundling

### Scalability Considerations

- Stateless API design allows horizontal scaling
- RAG service can be replicated with shared FAISS index
- Database uses connection pooling for concurrent requests
- SWR deduplicates simultaneous identical requests
- Serverless architecture auto-scales with traffic