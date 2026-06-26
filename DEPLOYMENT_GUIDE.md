# Edufy Deployment Guide

## Backend

1. Provision MongoDB and set `MONGODB_URL`.
2. Set a strong `JWT_SECRET`.
3. Configure `GROQ_API_KEY` with your Groq API key in the environment variables (already defined in `render.yaml` for Render).

4. Install dependencies:

```powershell
cd backend
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

5. Run the API:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## Frontend

```powershell
cd frontend
npm install
npm run build
```

Deploy `frontend/dist` to a static host. Configure the frontend environment or API service layer if the backend is not hosted at `localhost:8000`.

## Production Checklist

- Replace demo secrets and demo credentials.
- Restrict CORS origins to production domains.
- Use HTTPS in front of the API and frontend.
- Configure process supervision for the backend.
- Back up MongoDB regularly.
- Monitor API, database, and Groq API availability.
