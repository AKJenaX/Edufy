import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getStudentInsight = () => {
  return api.get('/student/insight').then(res => res.data);
};

export const getFacultyDashboard = () => {
  return api.get('/faculty/dashboard').then(res => res.data);
};

export const getAdminDashboard = () => {
  return api.get('/admin/dashboard').then(res => res.data);
};

export const markAttendance = (data) => {
  return api.post('/faculty/attendance/mark', data).then(res => res.data);
};

export const generateTimetable = (data) => {
  return api.post('/admin/timetable/generate', data).then(res => res.data);
};

export default api;
