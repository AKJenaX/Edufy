# Edufy Startup Script
Write-Host "🚀 Starting Edufy System..." -ForegroundColor Cyan

# Check Groq configuration
Write-Host "`n📡 Checking Groq API Key..." -ForegroundColor Yellow
$envPath = "backend/.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $hasKey = $envContent | Select-String -Pattern "^GROQ_API_KEY=\S+"
    if (!$hasKey) {
        Write-Warning "GROQ_API_KEY is not set in backend/.env! AI features will not work."
    } else {
        Write-Host "✅ GROQ_API_KEY is configured in .env" -ForegroundColor Green
    }
} else {
    Write-Warning "backend/.env file not found! AI features will not work without GROQ_API_KEY."
}

# Start Backend
Write-Host "`n🔧 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\.venv\Scripts\Activate.ps1; uvicorn main:app --reload --host localhost --port 8000"

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "`n🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`n✅ Edufy is starting up!" -ForegroundColor Green
Write-Host "`nAccess the application at:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "`nDemo Accounts:" -ForegroundColor Cyan
Write-Host "  Student: student@edufy.com / student123" -ForegroundColor White
Write-Host "  Faculty: faculty@edufy.com / faculty123" -ForegroundColor White
Write-Host "  Admin: admin@edufy.com / admin123" -ForegroundColor White
Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Made with Bob
