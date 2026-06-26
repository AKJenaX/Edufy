# Edufy Project Summary

Edufy is a smart campus platform built with FastAPI, React, MongoDB, and a Groq-backed AI assistant.

## Core Areas

- Student dashboard with performance, attendance, recommendations, and AI assistant access.
- Faculty dashboard for class analytics, attendance marking, and timetable generation.
- Admin dashboard for system overview, analytics, user creation, and system stats.
- JWT-based authentication with role-aware routes.
- Document upload, sticky study notes, and AI actions for summarization, quiz generation, and chat.

## Tech Stack

- Backend: FastAPI, Motor, PyMongo, Pydantic
- Frontend: React, Vite, Tailwind CSS, Recharts
- Database: MongoDB
- AI: Groq Cloud API using `openai/gpt-oss-20b` by default with `openai/gpt-oss-120b` available as fallback model

## Current Status

The application builds successfully, frontend lint passes, and the backend can run locally at http://localhost:8000 when MongoDB is available.
