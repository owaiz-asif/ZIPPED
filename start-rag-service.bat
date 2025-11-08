@echo off
echo Starting RAG Service...
echo.
echo This will start the Python RAG service on port 5000
echo First run may take a few minutes to download models (~500MB)
echo.
python rag_service.py
pause

