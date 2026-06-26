# Edufy Setup Guide

## Prerequisites

- Python 3.14 or newer
- Node.js and npm
- MongoDB Community Server with `mongosh`
- Required: A Groq API key from console.groq.com for AI assistant features

## Backend

Configure your Groq API key in your backend `.env` file (copied from `.env.example`):

```env
GROQ_API_KEY=your-groq-api-key-here
```

```powershell
cd backend
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --host localhost --port 8000
```

Verify the API:

```powershell
Invoke-WebRequest http://localhost:8000/health -UseBasicParsing
```

The API docs are available at http://localhost:8000/docs.

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually http://localhost:5173.

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | student@edufy.com | student123 |
| Faculty | faculty@edufy.com | faculty123 |
| Admin | admin@edufy.com | admin123 |
