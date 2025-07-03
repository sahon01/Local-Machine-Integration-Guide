@echo off
echo ================================================
echo AI Management Dashboard - Windows Installation
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js found...
node --version

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Please run this script from the project root directory.
    echo.
    pause
    exit /b 1
)

echo [INFO] Installing dependencies...
echo.

REM Install npm dependencies
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    echo.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Dependencies installed successfully!
echo.

REM Check if .env.local exists, if not create it
if not exist ".env.local" (
    echo [INFO] Creating .env.local file...
    echo # AI Management Dashboard Environment Variables > .env.local
    echo NEXT_PUBLIC_API_URL=http://localhost:3307 >> .env.local
    echo DATABASE_HOST=127.0.0.1 >> .env.local
    echo DATABASE_PORT=3307 >> .env.local
    echo DATABASE_USER=root >> .env.local
    echo DATABASE_PASSWORD=105585 >> .env.local
    echo DATABASE_NAME=modelsraver1 >> .env.local
    echo ELEVENLABS_API_KEY=your_api_key_here >> .env.local
    echo.
    echo [INFO] .env.local created with default values.
    echo Please update the values as needed.
    echo.
)

REM Try to build the project
echo [INFO] Building the project...
npm run build
if %errorlevel% neq 0 (
    echo [WARNING] Build failed, but you can still run in development mode.
    echo.
)

echo [INFO] Starting development server...
echo.
echo ================================================
echo Your AI Management Dashboard will be available at:
echo http://localhost:3000
echo http://localhost:3000/admin (Admin Panel)
echo ================================================
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev

pause
