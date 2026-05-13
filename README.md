# 🎓 Edufy - Smart Campus AI System

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Educational-yellow.svg)]()

A comprehensive Smart Campus AI System featuring role-based dashboards, AI-powered assistance with voice interaction, attendance tracking, and advanced analytics.

---

## 🌟 Features

### 🎯 Core Capabilities
- **Role-Based Access Control** - Student, Faculty, and Admin dashboards
- **AI-Powered Assistant** - Integrated with Ollama (llama3 model)
- **Voice Interaction** - Speech recognition for hands-free queries
- **Document Processing** - Upload and analyze PDFs, DOCX, TXT files
- **Smart Attendance** - Automated tracking and risk assessment
- **Timetable Generation** - AI-powered schedule optimization
- **Real-Time Analytics** - Comprehensive system-wide insights

### 👨‍🎓 Student Features
- Personal academic insights dashboard
- Attendance percentage tracking
- Performance metrics and risk assessment
- AI learning assistant with voice input
- Document upload and analysis
- Personalized recommendations
- Quiz generation from study materials

### 👨‍🏫 Faculty Features
- Class management dashboard
- Quick attendance marking
- Bulk attendance operations
- Timetable generation
- Student performance monitoring
- At-risk student identification
- Class analytics and reports

### 👔 Admin Features
- System-wide analytics dashboard
- User management (CRUD operations)
- Department statistics
- Attendance trends analysis
- AI usage monitoring
- System health checks
- Performance metrics

---

## 🏗️ Architecture

### Technology Stack

**Backend**
- **Framework**: FastAPI (Python 3.9+)
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT with python-jose
- **AI**: Ollama (llama3 model)
- **Document Processing**: PyPDF2, python-docx

**Frontend**
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Voice**: Browser Speech Recognition API

**Infrastructure**
- **API Endpoints**: 45+ RESTful endpoints
- **Database Models**: 4 core models
- **Authentication**: Role-based access control
- **Real-time**: Async operations throughout

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9 or higher
- Node.js 18 or higher
- MongoDB (local or cloud)
- Ollama with llama3 model

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd Edufy
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start backend
uvicorn main:app --reload --port 8000
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 4. Access Application
- **Frontend**: http://localhost:5175
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 🔑 Demo Accounts

### Student Account
```
Email: student@edify.com
Password: student123
```
**Access**: Student dashboard, AI assistant, attendance records

### Faculty Account
```
Email: faculty@edify.com
Password: faculty123
```
**Access**: Faculty dashboard, attendance marking, timetable generation

### Admin Account
```
Email: admin@edify.com
Password: admin123
```
**Access**: Admin dashboard, user management, system analytics

---

## 📚 Documentation

### Complete Guides
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Testing procedures
- **[ANALYSIS_AND_PLAN.md](ANALYSIS_AND_PLAN.md)** - Initial planning

### API Documentation
Interactive API documentation available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📁 Project Structure

```
Edify/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── config.py              # Configuration
│   ├── requirements.txt       # Python dependencies
│   ├── test_backend.py        # Test script
│   ├── database/
│   │   └── connection.py      # MongoDB connection
│   └── app/
│       ├── dependencies.py    # Auth & RBAC
│       ├── models/           # Database models
│       ├── schemas/          # Pydantic schemas
│       ├── routers/          # API endpoints
│       └── services/         # Business logic
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app with routing
│   │   ├── main.jsx          # Entry point
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   └── services/         # API services
│   ├── package.json
│   └── tailwind.config.js
│
└── Documentation files
```

---

## 🔌 API Endpoints

### Authentication (3 endpoints)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Student (12 endpoints)
- `GET /student/profile` - Get student profile
- `GET /student/insight` - Get academic insights
- `GET /student/attendance` - Get attendance records
- `POST /student/documents/upload` - Upload documents
- `POST /student/ai/query` - Query AI assistant
- And more...

### Faculty (15 endpoints)
- `GET /faculty/dashboard` - Get dashboard data
- `POST /faculty/attendance/mark` - Mark attendance
- `POST /faculty/timetable/generate` - Generate timetable
- `GET /faculty/students/at-risk` - Get at-risk students
- And more...

### Admin (10 endpoints)
- `GET /admin/dashboard` - Get admin dashboard
- `GET /admin/analytics` - Get system analytics
- `GET /admin/users` - List all users
- `POST /admin/users` - Create new user
- And more...

### AI (5 endpoints)
- `POST /ai/chat` - Chat with AI
- `POST /ai/analyze-document` - Analyze documents
- `POST /ai/generate-quiz` - Generate quizzes
- And more...

**Total: 45+ API Endpoints**

---

## 🎤 Voice Interaction

The AI Assistant supports voice input using the browser's Speech Recognition API:

1. Click the microphone button
2. Speak your question clearly
3. The system transcribes your speech
4. AI processes and responds

**Supported Browsers:**
- ✅ Chrome/Edge (Best support)
- ✅ Safari (iOS 14.5+)
- ⚠️ Firefox (Limited support)

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python test_backend.py
```

### Manual Testing
Follow the comprehensive [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for complete testing procedures.

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **Role-Based Access** - Granular permissions
- **Input Validation** - Pydantic schemas
- **CORS Protection** - Configured origins
- **Environment Variables** - Secure secrets management

---

## 📊 Key Statistics

- **Total Code**: ~6,000 lines
- **API Endpoints**: 45+
- **UI Components**: 15+
- **Database Models**: 4
- **Supported Roles**: 3 (Student, Faculty, Admin)
- **AI Integration**: Ollama (llama3)
- **Voice Support**: Yes (Speech Recognition API)

---

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && uvicorn main:app --reload

# Frontend
cd frontend && npm run dev
```

### Production
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete production deployment instructions including:
- Traditional server deployment
- Docker deployment
- Cloud platform deployment (Heroku, AWS, DigitalOcean)
- Database setup (MongoDB Atlas)
- SSL/HTTPS configuration
- Monitoring and logging

---

## 🛠️ Configuration

### Backend Environment Variables
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=edify
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

### Frontend Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🤝 Contributing

This is an educational project. Contributions, issues, and feature requests are welcome!

### Development Workflow
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- **FastAPI** - Modern Python web framework
- **React** - UI library
- **Ollama** - Local AI integration
- **MongoDB** - Database
- **Tailwind CSS** - Styling framework

---

## 📞 Support

For issues or questions:
1. Check the [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Review [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
3. Check API documentation at `/docs`
4. Review browser console for errors
5. Check backend logs

---

## 🗺️ Roadmap

### Future Enhancements
- [ ] Real-time notifications (WebSockets)
- [ ] Email integration
- [ ] Advanced analytics with charts
- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] Assignment submission system
- [ ] Grade calculation automation
- [ ] Parent portal
- [ ] Library management
- [ ] Hostel management

---

## 📈 Project Status

**Status**: ✅ **PRODUCTION READY**

All core features implemented, tested, and documented. The system is ready for deployment and use.

---

## 🎯 Quick Links

- [Setup Guide](SETUP_GUIDE.md)
- [Project Summary](PROJECT_SUMMARY.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Testing Checklist](TESTING_CHECKLIST.md)
- [API Documentation](http://localhost:8000/docs)

---

**Built with ❤️ using FastAPI, React, MongoDB, and AI**

*Last Updated: 2026-05-04*