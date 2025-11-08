@echo off
title AI Heir - Starting Services
color 0A
echo.
echo ========================================
echo    AI HEIR - STARTING SERVICES
echo ========================================
echo.
echo This will start both services:
echo   1. Python RAG Service (Port 5000)
echo   2. Node.js Web App (Port 3000)
echo.
echo ========================================
echo.

echo [1/2] Starting Python RAG Service...
start "RAG Service" python rag_service.py
timeout /t 3 /nobreak >nul

echo [2/2] Starting Node.js Web App...
start "Next.js App" cmd /k "npm run dev"

echo.
echo ========================================
echo    SERVICES STARTING...
echo ========================================
echo.
echo Python RAG Service: http://localhost:5000
echo Node.js Web App:    http://localhost:3000
echo.
echo Two windows will open:
echo   - RAG Service (Python) - Keep this open!
echo   - Next.js App (Node.js) - Keep this open!
echo.
echo Wait 30-60 seconds, then open:
echo   http://localhost:3000
echo.
echo ========================================
echo Press any key to open browser...
pause >nul

start http://localhost:3000
echo.
echo Browser opened! If page doesn't load, wait 30 seconds and refresh.
echo.
pause

