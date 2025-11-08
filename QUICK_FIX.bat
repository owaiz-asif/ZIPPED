@echo off
title Fixing Connection Issue
color 0E
echo.
echo ========================================
echo    FIXING "CONNECTION REFUSED" ERROR
echo ========================================
echo.
echo Step 1: Stopping old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Step 2: Starting Next.js server...
echo.
echo A new window will open with the server.
echo Wait for "Ready" message, then visit:
echo   http://localhost:3000
echo.
echo ========================================
echo.
timeout /t 3 /nobreak

start "Next.js Server" cmd /k "npm run dev"

echo.
echo Server is starting in the new window...
echo.
echo Wait 30-60 seconds, then:
echo   1. Check the new window for "Ready" message
echo   2. Open browser: http://localhost:3000
echo.
echo ========================================
pause

