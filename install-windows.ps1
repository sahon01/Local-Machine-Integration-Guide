# AI Management Dashboard - Windows PowerShell Installation Script

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "AI Management Dashboard - Windows Installation" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[INFO] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] Installing dependencies..." -ForegroundColor Blue
Write-Host ""

# Install npm dependencies
try {
    npm install
    Write-Host ""
    Write-Host "[SUCCESS] Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to install dependencies!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env.local exists, if not create it
if (-not (Test-Path ".env.local")) {
    Write-Host "[INFO] Creating .env.local file..." -ForegroundColor Blue
    
    $envContent = @"
# AI Management Dashboard Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3307
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3307
DATABASE_USER=root
DATABASE_PASSWORD=105585
DATABASE_NAME=modelsraver1
ELEVENLABS_API_KEY=your_api_key_here
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "[INFO] .env.local created with default values." -ForegroundColor Green
    Write-Host "Please update the values as needed." -ForegroundColor Yellow
    Write-Host ""
}

# Try to build the project
Write-Host "[INFO] Building the project..." -ForegroundColor Blue
try {
    npm run build
    Write-Host "[SUCCESS] Project built successfully!" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Build failed, but you can still run in development mode." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[INFO] Starting development server..." -ForegroundColor Blue
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Your AI Management Dashboard will be available at:" -ForegroundColor Cyan
Write-Host "http://localhost:3000" -ForegroundColor White
Write-Host "http://localhost:3000/admin (Admin Panel)" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev
