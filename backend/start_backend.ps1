# Edify Backend Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Edify Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = mongosh --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "✗ MongoDB is not running!" -ForegroundColor Red
        Write-Host "  Start MongoDB with: net start MongoDB" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "✗ MongoDB is not installed or not running!" -ForegroundColor Red
    Write-Host "  Install MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\.venv\Scripts\Activate.ps1

Write-Host "✓ Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Check if demo users exist
Write-Host "Checking demo users..." -ForegroundColor Yellow
$userCount = mongosh Edify --eval "db.users.countDocuments()" --quiet 2>&1
if ($userCount -eq "0" -or $userCount -eq 0) {
    Write-Host "✗ No users found in database" -ForegroundColor Red
    Write-Host "  Creating demo users..." -ForegroundColor Yellow
    python create_demo_users.py
    Write-Host ""
} else {
    Write-Host "✓ Demo users exist" -ForegroundColor Green
}

Write-Host ""

# Start backend server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will be available at:" -ForegroundColor Green
Write-Host "  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  http://localhost:8000/docs (API Documentation)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

uvicorn main:app --reload --host localhost --port 8000

# Made with Bob
