import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ToastProvider from './components/ToastProvider';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import AIAssistant from './pages/student/AIAssistant';
import FacultyDashboard from './pages/faculty/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Layout Component
function Layout({ children }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edufy
              </h1>
              {user && (
                <span className="ml-4 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {user.role}
                </span>
              )}
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">{user.full_name}</span>
                
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              {user?.role === 'student' && <StudentDashboard />}
              {user?.role === 'faculty' && <FacultyDashboard />}
              {user?.role === 'admin' && <AdminDashboard />}
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/ai-assistant"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout>
              <AIAssistant />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout>
              <div className="card">
                <h1 className="text-2xl font-bold">Attendance Records</h1>
                <p className="text-gray-600 mt-2">View your attendance history here</p>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ToastProvider />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
