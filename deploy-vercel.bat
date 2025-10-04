@echo off
setlocal ENABLEDELAYEDEXPANSION
title HOK Showcase - One Click Deploy to Vercel

echo =============================================
echo  HOK Showcase - One Click Deploy to Vercel
echo  This script will install deps and deploy.
echo =============================================
echo.

REM 1) Check npm
where npm >nul 2>&1
IF ERRORLEVEL 1 (
  echo [ERROR] npm not found. Please install Node.js LTS from https://nodejs.org/ first.
  pause
  exit /b 1
)

REM 2) Install project deps (prefer npm ci if package-lock exists)
if exist package-lock.json (
  echo [+] Installing deps via npm ci ...
  npm ci
) else (
  echo [+] Installing deps via npm install ...
  npm install
)

REM 3) Ensure vercel CLI exists
where vercel >nul 2>&1
IF ERRORLEVEL 1 (
  echo [+] Installing Vercel CLI globally ...
  npm i -g vercel
)

REM 4) Login if necessary
vercel whoami >nul 2>&1
IF ERRORLEVEL 1 (
  echo [+] Vercel login required. A browser window may open...
  vercel login
)

REM 5) Build locally to catch errors early
echo [+] Building locally ...
npm run build
IF ERRORLEVEL 1 (
  echo [ERROR] Build failed. Please fix errors above and run again.
  pause
  exit /b 1
)

REM 6) Deploy to production
echo [+] Deploying to Vercel (production) ...
vercel --prod --yes --confirm

echo.
echo [DONE] If no error shown above, your site is live at the printed vercel.app URL.
pause
