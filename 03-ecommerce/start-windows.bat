@echo off
echo ===================================================
echo   NOVA SUPPLY - CODSOFT Level 3 E-Commerce Platform
echo ===================================================
echo.
echo Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org/ to run the full-stack server.
    echo.
    echo In the meantime, you can double-click 'double-click-to-run.html'
    echo to preview and interact with the full store immediately in your browser!
    pause
    exit /b 1
)

echo [1/3] Installing dependencies for server and client...
call npm run install:all

echo.
echo [2/3] Building production client...
call npm run build

echo.
echo [3/3] Starting NOVA SUPPLY server on http://localhost:5000 ...
start http://localhost:5000
node server/server.js
pause
