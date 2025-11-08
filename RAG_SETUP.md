# RAG (Retrieval-Augmented Generation) Setup Guide

## Overview

AI Heir now includes a RAG system that enhances responses by retrieving relevant information from uploaded documents. This allows the assistant to answer questions based on your specific knowledge base.

## Architecture

```
Next.js Frontend
    ↓
Next.js API Routes (/api/rag/*)
    ↓
Python Flask Service (rag_service.py)
    ↓
RAG Engine (rag_engine.py)
    ↓
FAISS Vector Store + Document Metadata
```

## Prerequisites

1. **Python 3.8+** installed
2. **Node.js 18+** (already installed for Next.js)

## Setup Instructions

### Step 1: Install Python Dependencies

```bash
pip install -r requirements-rag.txt
```

This installs:
- Flask (web framework)
- FAISS (vector search)
- Sentence Transformers (embeddings)
- Transformers (answer generation)
- PyPDF2 (PDF processing)

### Step 2: Start the RAG Service

```bash
python rag_service.py
```

The service will start on `http://localhost:5000` by default.

You can set a custom port using:
```bash
PORT=5001 python rag_service.py
```

### Step 3: Configure Environment Variable (Optional)

Add to your `.env.local`:
```
RAG_SERVICE_URL=http://localhost:5000
```

If not set, it defaults to `http://localhost:5000`.

### Step 4: Verify the Service

Check if the service is running:
```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "status": "healthy",
  "documents": 0
}
```

## Usage

### Upload Documents

#### Via UI Component
1. Navigate to the chat interface
2. Use the RAG Upload component to add documents
3. Upload text directly or upload files (PDF, TXT, MD)

#### Via API
```bash
# Upload text
curl -X POST http://localhost:5000/upload \
  -H "Content-Type: application/json" \
  -d '{"text": "Your document content here", "filename": "my_document"}'

# Upload file
curl -X POST http://localhost:5000/upload \
  -F "file=@document.pdf"
```

### Query the RAG System

#### Via Chat Interface
Simply ask questions in the chat interface. The system will:
1. Try to retrieve relevant information from RAG
2. Generate an answer based on retrieved context
3. Fall back to default responses if RAG is unavailable

#### Via API
```bash
curl -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the best time for meetings?", "top_k": 3}'
```

### Via CLI (Direct Python)

```bash
# Ingest a PDF
python rag_engine.py ingest path/to/document.pdf --name "Meeting Notes"

# Query directly
python rag_engine.py query "What did we discuss in the meeting?" --k 3
```

## API Endpoints

### Python Flask Service (`rag_service.py`)

- `GET /health` - Health check
- `POST /upload` - Upload document (file or text)
- `POST /query` - Query with question, returns answer + sources
- `POST /search` - Search for similar documents (no answer generation)
- `GET /documents` - List all indexed documents

### Next.js API Routes

- `POST /api/rag/query` - Query RAG system
- `POST /api/rag/upload` - Upload document
- `POST /api/rag/search` - Search documents

## Integration with Chat

The chat interface automatically uses RAG when:
1. RAG service is available
2. User asks a question
3. Relevant documents are found

If RAG is unavailable, it falls back to the default response generator.

## Storage

- **Vector Store**: `vector_store/legal_faiss.index`
- **Metadata**: `vector_store/legal_metadata.json`

These files are created automatically and persist between sessions.

## Troubleshooting

### RAG Service Not Starting

1. Check Python version: `python --version` (should be 3.8+)
2. Verify dependencies: `pip list | grep flask`
3. Check port availability: `lsof -i :5000` (Linux/Mac) or `netstat -ano | findstr :5000` (Windows)

### Models Not Downloading

The first run will download models (~500MB):
- `sentence-transformers/all-MiniLM-L6-v2` (embeddings)
- `pszemraj/led-large-book-summary` (answer generation)

Ensure you have internet connection and sufficient disk space.

### No Results from Queries

1. Verify documents are uploaded: `GET /documents`
2. Check if documents contain relevant information
3. Try increasing `top_k` parameter (default: 3)

### Performance Issues

- **CPU Mode**: Models run on CPU by default (slower but works everywhere)
- **GPU Mode**: For faster inference, use a GPU-enabled environment
- **Model Size**: Consider using smaller models for faster responses

## Production Deployment

### Option 1: Separate Service

Deploy `rag_service.py` as a separate service:
- Use gunicorn: `gunicorn -w 4 -b 0.0.0.0:5000 rag_service:app`
- Use Docker for containerization
- Set up reverse proxy (nginx) if needed

### Option 2: Serverless

Convert to serverless functions (AWS Lambda, Vercel Functions, etc.)

### Environment Variables

- `PORT` - Service port (default: 5000)
- `RAG_SERVICE_URL` - URL for Next.js to connect (default: http://localhost:5000)

## Example Use Cases

1. **Meeting Notes**: Upload meeting transcripts, get answers about what was discussed
2. **Project Documentation**: Add project docs, ask questions about features
3. **Personal Knowledge Base**: Upload your notes, get personalized answers
4. **Company Policies**: Add policy documents, ask compliance questions

## Next Steps

- Add more document formats (Word, Excel, etc.)
- Implement document deletion
- Add document categories/tags
- Implement user-specific knowledge bases
- Add document search UI component

