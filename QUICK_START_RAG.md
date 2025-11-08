# Quick Start: Populate RAG Database

## The Problem
If your AI Assistant is giving the same answer for all questions, it means the RAG database is empty or not connected.

## Solution: Populate the Database

### Step 1: Start RAG Service
Open a terminal and run:
```bash
cd ZIPPED
python rag_service.py
```
You should see:
```
 * Running on http://0.0.0.0:5000
```

**Keep this terminal open!** The service must be running.

### Step 2: Populate Database
Open a **NEW** terminal and run:
```bash
cd ZIPPED
python populate_rag_database.py
```

You should see output like:
```
✅ RAG Service is running. Current documents: 0
📄 Ingesting: client_presentation_2024.txt
     ✅ Success! Total documents: 15
...
✅ Files successful: 10
📚 Total documents in RAG: 150
```

### Step 3: Test It
1. Go to your AI Assistant in the browser
2. Ask: "What meetings are scheduled for February?"
3. You should get a detailed answer from the RAG database!

## Troubleshooting

### "Cannot connect to RAG service"
- Make sure Step 1 is running (rag_service.py)
- Check if port 5000 is in use: `netstat -ano | findstr :5000` (Windows)

### "No .txt files found"
- Check that files exist in `data/meeting_summaries/`, `data/schedules/`, `data/business_policies/`
- Files must have `.txt` extension

### Still getting same answers
1. Verify documents were added: Check the script output for "Total documents in RAG"
2. Check browser console (F12) for errors
3. Make sure RAG service is still running
4. Try restarting both the RAG service and Next.js app

## Verify RAG is Working

Test directly:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status": "healthy", "documents": 150}
```

If documents is 0, run the populate script again!

