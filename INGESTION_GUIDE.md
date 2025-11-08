# 📚 Business Data Ingestion Guide

## Overview

The `ingest_business_data.py` script automatically uploads business documents (meeting summaries and schedules) to your RAG knowledge base.

## Quick Start

### Step 1: Start RAG Service
```bash
python rag_service.py
```
Wait for: "✅ LegalRAG initialized successfully"

### Step 2: Run Ingestion Script
```bash
python ingest_business_data.py
```

## Directory Structure

The script processes `.txt` files from:
```
data/
├── meeting_summaries/
│   ├── team_standup_2024.txt
│   ├── client_presentation_2024.txt
│   └── ... (add your files here)
│
└── schedules/
    ├── weekly_schedule_january.txt
    ├── quarterly_planning_2024.txt
    └── ... (add your files here)
```

## Sample Files Included

✅ **Meeting Summaries:**
- `team_standup_2024.txt` - Example team standup meeting
- `client_presentation_2024.txt` - Example client presentation

✅ **Schedules:**
- `weekly_schedule_january.txt` - Weekly meeting schedule
- `quarterly_planning_2024.txt` - Q1 planning schedule

## How It Works

1. **Checks RAG Service**: Verifies RAG is running before starting
2. **Scans Directories**: Finds all `.txt` files in specified directories
3. **Reads Files**: Reads each file's content
4. **Uploads to RAG**: POSTs content to `http://localhost:5000/upload`
5. **Reports Status**: Shows success/failure for each file

## Output Example

```
============================================================
RAG Business Data Ingestion Script
============================================================

✅ RAG Service is running. Documents: 0

📁 Directory ready: data/meeting_summaries
📁 Directory ready: data/schedules

--- Starting RAG Ingestion Process ---

📂 Scanning directory: data/meeting_summaries
-> Attempting to ingest: team_standup_2024.txt
   [SUCCESS] 'team_standup_2024.txt' added. Total documents: 1
-> Attempting to ingest: client_presentation_2024.txt
   [SUCCESS] 'client_presentation_2024.txt' added. Total documents: 2

📂 Scanning directory: data/schedules
-> Attempting to ingest: weekly_schedule_january.txt
   [SUCCESS] 'weekly_schedule_january.txt' added. Total documents: 3
-> Attempting to ingest: quarterly_planning_2024.txt
   [SUCCESS] 'quarterly_planning_2024.txt' added. Total documents: 4

============================================================
--- Ingestion Summary ---
============================================================

✅ Files processed: 4
   Check the output above for success/failure status of each file.
```

## Adding Your Own Files

1. **Place files** in the appropriate directory:
   - Meeting summaries → `data/meeting_summaries/`
   - Schedules → `data/schedules/`

2. **File format**: Plain text (`.txt`) files

3. **Run the script**:
   ```bash
   python ingest_business_data.py
   ```

## Troubleshooting

### Error: "Cannot connect to RAG service"
**Solution:** Start RAG service first:
```bash
python rag_service.py
```

### Error: "No .txt files found"
**Solution:** 
- Check that files are in `data/meeting_summaries/` or `data/schedules/`
- Ensure files have `.txt` extension
- Files must not be empty

### Error: "Request timeout"
**Solution:**
- RAG service may be slow (especially on first run)
- Wait for models to finish loading
- Try again after RAG is fully initialized

### Files Not Appearing in RAG
**Solution:**
- Check RAG service logs for errors
- Verify files contain actual text (not empty)
- Check network connectivity to localhost:5000

## Features

✅ **Automatic Directory Creation**: Creates directories if they don't exist  
✅ **Health Check**: Verifies RAG service before starting  
✅ **Error Handling**: Handles connection errors, timeouts, file errors  
✅ **Status Reporting**: Clear success/failure messages  
✅ **Recursive Scanning**: Finds files in subdirectories  
✅ **UTF-8 Support**: Handles international characters  

## Integration with Chat

After ingestion, you can ask questions like:
- "What was discussed in the team standup?"
- "When is the next client meeting?"
- "What are the quarterly objectives?"
- "Show me the weekly schedule"

The RAG system will use the ingested documents to answer!

## Best Practices

1. **Organize Files**: Keep meeting summaries and schedules separate
2. **Use Descriptive Names**: Name files clearly (e.g., `team_standup_2024_01_15.txt`)
3. **Regular Updates**: Run ingestion after important meetings
4. **Backup**: Keep original files as backup
5. **Clean Text**: Ensure files are readable and well-formatted

## Advanced Usage

### Process Specific Directory
Modify `DATA_DIRS` in the script:
```python
DATA_DIRS = [
    "data/meeting_summaries",  # Only this directory
]
```

### Change RAG URL
Modify `RAG_SERVICE_URL`:
```python
RAG_SERVICE_URL = "http://localhost:5001"  # Different port
```

### Add More Directories
```python
DATA_DIRS = [
    "data/meeting_summaries",
    "data/schedules",
    "data/notes",  # Add new directory
    "data/reports"  # Add another
]
```

## Script Dependencies

Required Python packages:
```bash
pip install requests
```

Already included in `requirements-rag.txt` if you installed RAG dependencies.

