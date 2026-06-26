// Central API configuration.
// In production, set VITE_API_URL to your backend's deployed URL.
// Locally it falls back to http://localhost:8000.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
