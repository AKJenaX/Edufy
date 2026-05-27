# Edufy Setup Guide

## Prerequisites

- Python 3.14 or newer
- Node.js and npm
- MongoDB Community Server with `mongosh`
- Optional: Ollama with the `llama3` and `mistral` models for AI assistant responses

## Backend

If you want AI responses locally, install both configured Ollama models first:

```powershell
ollama pull llama3
ollama pull mistral
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
