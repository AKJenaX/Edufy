# Edufy Testing Checklist

## Automated Checks

Run from the frontend directory:

```powershell
npm run lint
npm run build
```

Run from the backend directory after starting the API:

```powershell
.\.venv\Scripts\python.exe test_backend.py
```

## Manual Smoke Test

- Backend `/health` returns `{"status":"healthy"}`.
- API docs load at http://localhost:8000/docs.
- Frontend loads at the Vite dev URL.
- Student, faculty, and admin demo accounts can sign in.
- Role dashboards load without console errors.
- Admin can view analytics and user management.
- Faculty can open attendance and timetable views.
- Student can open the AI assistant view.
- Document upload accepts PDF, DOCX, and TXT files.
- Students can select an uploaded document and create, edit, pin, recolor, and delete sticky notes.

## Notes

The AI assistant requires Ollama to be running and the `llama3` and `mistral` models to be available.
