# RAG Service Troubleshooting Guide

## Issue: "I'm currently unable to access my knowledge base"

### Solution 1: Start the RAG Service

**Windows:**
```bash
# Option 1: Double-click start-rag-service.bat
# Option 2: Run in terminal
python rag_service.py
```

**Linux/Mac:**
```bash
python3 rag_service.py
```

### Solution 2: Check if Service is Running

Open a new terminal and run:
```bash
curl http://localhost:5000/health
```

Or in PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/health"
```

### Solution 3: Check for Port Conflicts

If port 5000 is already in use:
1. Find the process: `netstat -ano | findstr :5000` (Windows)
2. Kill the process or change the port in `rag_service.py`

### Solution 4: First Run - Model Download

On first run, the service needs to download models (~500MB):
- This can take 5-10 minutes
- Check the Python window for progress
- Ensure you have internet connection
- Ensure you have enough disk space

### Solution 5: Check Python Dependencies

Make sure all dependencies are installed:
```bash
pip install -r requirements-rag.txt
```

### Solution 6: Check Environment Variable

Ensure `.env.local` has:
```
RAG_SERVICE_URL=http://localhost:5000
```

## Common Errors

### Error: "ModuleNotFoundError: No module named 'flask'"
**Fix:** Install dependencies: `pip install -r requirements-rag.txt`

### Error: "Address already in use"
**Fix:** Port 5000 is taken. Either:
- Kill the process using port 5000
- Change port in `rag_service.py`: `port = int(os.environ.get("PORT", 5001))`

### Error: "Connection refused"
**Fix:** RAG service is not running. Start it with `python rag_service.py`

### Error: "Model download failed"
**Fix:** 
- Check internet connection
- Check disk space
- Try again (downloads are cached)

## Verification

Once running, you should see:
```
✅ LegalRAG initialized successfully.
 * Running on http://0.0.0.0:5000
```

Then test with:
```bash
curl -X POST http://localhost:5000/query -H "Content-Type: application/json" -d "{\"question\":\"test\"}"
```

## Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Dependencies installed: `pip install -r requirements-rag.txt`
- [ ] RAG service started: `python rag_service.py`
- [ ] Service accessible: `curl http://localhost:5000/health`
- [ ] `.env.local` has `RAG_SERVICE_URL=http://localhost:5000`
- [ ] Next.js app restarted (to pick up env changes)

## Still Having Issues?

1. Check Python window for error messages
2. Check browser console for connection errors
3. Verify firewall isn't blocking port 5000
4. Try restarting both services

