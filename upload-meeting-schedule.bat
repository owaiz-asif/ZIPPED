@echo off
title Upload Meeting Schedule to RAG
color 0A
echo.
echo ========================================
echo   UPLOADING MEETING SCHEDULE TO RAG
echo ========================================
echo.
echo This will upload meeting scheduling information
echo to your RAG knowledge base.
echo.
echo Make sure RAG service is running first!
echo (python rag_service.py)
echo.
echo ========================================
pause

python upload-meeting-schedule.py

echo.
echo ========================================
echo.
pause

