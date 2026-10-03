@echo off
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm are required.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Run npm install before starting Myeok.
  pause
  exit /b 1
)
call npm run dev -- --open
pause
