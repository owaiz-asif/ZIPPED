# How to Populate RAG Database

## Quick Start

1. **Start the RAG Service** (in a separate terminal):
   ```bash
   cd ZIPPED
   python rag_service.py
   ```
   The service will start on `http://localhost:5000`

2. **Populate the Database** (in another terminal):
   ```bash
   cd ZIPPED
   python populate_rag_database.py
   ```

## What This Does

The script will:
- ✅ Check if RAG service is running
- ✅ Scan all data directories for `.txt` files
- ✅ Upload each file to the RAG database
- ✅ Show you how many documents were added
- ✅ List all indexed documents

## Data Files Included

The script will ingest files from:
- `data/meeting_summaries/` - Meeting notes and summaries
- `data/schedules/` - Schedules and timelines
- `data/business_policies/` - Company policies and guidelines

## Verify It Worked

After running the script, you should see:
```
✅ Files successful: X
📚 Total documents in RAG: X
```

## Test the RAG System

1. Make sure the RAG service is running (`python rag_service.py`)
2. Open your AI Assistant in the browser
3. Try asking questions like:
   - "What meetings are scheduled for February?"
   - "What was discussed in the product launch meeting?"
   - "What is the project timeline for Q1?"
   - "What are the company policies for work from home?"
   - "What are the development guidelines?"

## Troubleshooting

### RAG Service Not Running
If you see "Cannot connect to RAG service":
1. Make sure `rag_service.py` is running
2. Check if port 5000 is available
3. Verify Python dependencies are installed: `pip install -r requirements-rag.txt`

### No Documents Found
If the script says "No .txt files found":
1. Check that files exist in `data/` subdirectories
2. Make sure files have `.txt` extension
3. Verify files are not empty

### Same Answer for All Questions
If the AI gives the same answer:
1. Check if documents were actually ingested (look at the script output)
2. Verify RAG service is running and has documents: `curl http://localhost:5000/health`
3. Check browser console for errors
4. Make sure you're asking questions related to the ingested data

## Manual Verification

Check RAG service health:
```bash
curl http://localhost:5000/health
```

List all documents:
```bash
curl http://localhost:5000/documents
```

Test a query:
```bash
curl -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What meetings are scheduled?", "top_k": 3}'
```

