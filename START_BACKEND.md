# 🚀 How to Start Edufy Backend

## Method 1: Using the Startup Script (Easiest)
This starts both backend and frontend automatically:

```powershell
powershell -ExecutionPolicy Bypass -File start_edufy.ps1
```

---

## Method 2: Start Backend Manually

### Step 1: Open PowerShell/Terminal
Open a new terminal in VS Code or PowerShell window

### Step 2: Navigate to Backend Directory
```powershell
cd backend
```

### Step 3: Activate Virtual Environment
```powershell
.\.venv\Scripts\Activate.ps1
```

You should see `(.venv)` appear in your terminal prompt.

### Step 4: Start the Backend Server
```powershell
uvicorn main:app --reload --host localhost --port 8000
```

### Expected Output:
```
INFO:     Will watch for changes in these directories: ['C:\\Users\\...\\edufy\\backend']
INFO:     Uvicorn running on http://localhost:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using WatchFiles
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Starting up Edufy API...
INFO:     Connected to MongoDB at mongodb://localhost:27017
INFO:     Application startup complete.
```

### ✅ Backend is Running!
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

---

## Method 3: One-Line Command

From the project root directory:
```powershell
cd backend; .\.venv\Scripts\Activate.ps1; uvicorn main:app --reload --host localhost --port 8000
```

---

## Troubleshooting

### Error: "Cannot activate virtual environment"
**Solution:** Run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "MongoDB connection failed"
**Solution:** Make sure MongoDB is running:
```powershell
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# If not running, start it:
net start MongoDB
```

### Error: "Module not found"
**Solution:** Reinstall dependencies:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Error: "Port 8000 already in use"
**Solution:** Kill the process using port 8000:
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## Starting Frontend (Separate Terminal)

### Step 1: Open New Terminal
Open another terminal window

### Step 2: Navigate to Frontend
```powershell
cd frontend
```

### Step 3: Start Frontend
```powershell
npm run dev
```

### Expected Output:
```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### ✅ Frontend is Running!
- App: http://localhost:5173

---

## Quick Reference

### Start Everything:
```powershell
# Terminal 1 - Backend
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --host localhost --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Stop Servers:
Press `Ctrl + C` in each terminal

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@edufy.com | student123 |
| Faculty | faculty@edufy.com | faculty123 |
| Admin | admin@edufy.com | admin123 |

---

**Need help?** Check the main README.md file or the API documentation at http://localhost:8000/docs