# 🚀 How to Run AI Heir - Step by Step Guide

## Quick Start (2 Steps)

### Step 1: Start Python RAG Service (FIRST)
**This must run FIRST before the web app can use RAG features.**

**Option A: Double-click the batch file (Easiest)**
```
Double-click: start-rag-service.bat
```

**Option B: Run in terminal**
```bash
python rag_service.py
```

**What you'll see:**
- A Python window will open
- First run: It will download models (~500MB) - takes 5-10 minutes
- Wait for: "✅ LegalRAG initialized successfully"
- Then: "Running on http://0.0.0.0:5000"
- **Keep this window open!**

---

### Step 2: Start Node.js Web Application (SECOND)
**This is your main web interface.**

**Option A: Run in terminal**
```bash
npm run dev
```

**Option B: If npm doesn't work, try:**
```bash
pnpm dev
```
or
```bash
yarn dev
```

**What you'll see:**
- Terminal output showing Next.js starting
- Wait for: "Ready in X seconds"
- Then: "Local: http://localhost:3000"
- **Keep this terminal open!**

---

## Complete Startup Sequence

### Terminal 1: Python RAG Service
```bash
cd C:\Users\shana\OneDrive\Desktop\ZIPPED
python rag_service.py
```
✅ Wait until you see "LegalRAG initialized successfully"

### Terminal 2: Node.js Web App
```bash
cd C:\Users\shana\OneDrive\Desktop\ZIPPED
npm run dev
```
✅ Wait until you see "Ready" and "Local: http://localhost:3000"

### Browser
Open: **http://localhost:3000**

---

## Which to Start First?

### ✅ CORRECT ORDER:
1. **Python RAG Service FIRST** (rag_service.py)
2. **Node.js Web App SECOND** (npm run dev)

### ❌ WRONG ORDER:
- Starting Node.js first is OK, but RAG features won't work until Python service starts

---

## Visual Guide

```
┌─────────────────────────────────────┐
│  STEP 1: Python RAG Service         │
│  ───────────────────────────────    │
│  Double-click: start-rag-service.bat│
│  OR                                  │
│  python rag_service.py              │
│                                      │
│  ✅ Wait for: "LegalRAG initialized" │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  STEP 2: Node.js Web App            │
│  ───────────────────────────────    │
│  npm run dev                         │
│                                      │
│  ✅ Wait for: "Ready"                │
│  ✅ URL: http://localhost:3000      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  STEP 3: Open Browser               │
│  ───────────────────────────────    │
│  Visit: http://localhost:3000       │
│                                      │
│  🎉 Your app is running!            │
└─────────────────────────────────────┘
```

---

## Troubleshooting

### "Python not found"
- Install Python 3.8+ from python.org
- Make sure Python is in your PATH

### "npm not found"
- Install Node.js from nodejs.org
- Restart terminal after installation

### "Port 5000 already in use"
- Another RAG service is running
- Close it or change port in rag_service.py

### "Port 3000 already in use"
- Another Next.js app is running
- Close it or use: `npm run dev -- -p 3001`

### RAG Service won't start
- Check Python dependencies: `pip install -r requirements-rag.txt`
- Check Python window for error messages

### Web App won't start
- Check Node.js dependencies: `npm install`
- Check terminal for error messages

---

## Quick Commands Reference

```bash
# Start RAG Service
python rag_service.py

# Start Web App
npm run dev

# Install Python dependencies (if needed)
pip install -r requirements-rag.txt

# Install Node.js dependencies (if needed)
npm install
```

---

## What Each Service Does

### Python RAG Service (Port 5000)
- Handles document uploads
- Provides AI-powered search
- Generates answers from your knowledge base
- **Required for:** Chat RAG features, document queries

### Node.js Web App (Port 3000)
- Main web interface
- Dashboard, Emotion Analyzer, Chat, etc.
- Connects to RAG service when available
- **Required for:** Everything (main app)

---

## Pro Tips

1. **Keep both windows open** - Don't close them while using the app
2. **First run is slow** - Python downloads models (5-10 min), be patient
3. **Check the windows** - Error messages appear in the terminal windows
4. **Restart if stuck** - Close both, then restart in order (Python first, then Node.js)

---

## Need Help?

- Check `RAG_TROUBLESHOOTING.md` for RAG issues
- Check terminal/console windows for error messages
- Make sure both services show "running" or "ready" messages

