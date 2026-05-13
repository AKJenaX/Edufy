# Edufy Startup Script
Write-Host "🚀 Starting Edufy System..." -ForegroundColor Cyan

# Start Ollama (if not running)
Write-Host "`n📡 Checking Ollama..." -ForegroundColor Yellow
$ollamaRunning = Get-Process ollama -ErrorAction SilentlyContinue
if (!$ollamaRunning) {
    Write-Host "Starting Ollama service..." -ForegroundColor Yellow
    Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}
Write-Host "✅ Ollama is running" -ForegroundColor Green

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
