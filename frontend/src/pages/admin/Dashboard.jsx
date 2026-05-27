import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

function AdminDashboard() {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // User Management State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student'
  });
  const [userMessage, setUserMessage] = useState(null);

  // System Stats State
  const [systemStats, setSystemStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await axios.get('http://localhost:8000/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      alert(err.response?.data?.detail || 'Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await axios.get('http://localhost:8000/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      alert(err.response?.data?.detail || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/admin/system/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSystemStats(response.data);
    } catch (err) {
      console.error('Error fetching system stats:', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMessage(null);

    try {
      await axios.post(
        'http://localhost:8000/admin/users',
        newUserForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserMessage({ type: 'success', text: 'User created successfully!' });
      setNewUserForm({
        email: '',
        password: '',
        full_name: '',
        role: 'student'
      });
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error('Error creating user:', err);
      setUserMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to create user'
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics' && !analyticsData) {
      fetchAnalytics();
    } else if (activeTab === 'users' && users.length === 0) {
      fetchUsers();
    } else if (activeTab === 'system' && !systemStats) {
      fetchSystemStats();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse relative">
        <div className="h-32 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
        <div className="h-14 bg-slate-900/40 border border-white/5 rounded-2xl w-full sm:w-1/2"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
          <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
          <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
          <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
        </div>
        <div className="h-64 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-rose-500/10 border-rose-500/20 p-6 rounded-2xl">
        <p className="text-rose-400 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-glow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-glow" />

      {/* Header Banner */}
      <div className="card relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-[#0a1128]/95 to-slate-950/90 border border-white/10 hover:border-indigo-500/20 shadow-indigo-500/5 transform hover:scale-[1.005] duration-300">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              System Security Core Active
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">System overview, real-time analytics, user database management, and engine health controls.</p>
          </div>
        </div>
      </div>

      {/* Tabs Selector Card */}
      <div className="card bg-slate-900/40 border border-white/5 shadow-2xl p-2 sm:p-2.5">
        <div className="flex flex-wrap p-1 bg-white/[0.02] border border-white/5 rounded-2xl gap-1">
          {['Overview', 'Analytics', 'User Management', 'System Stats'].map((tabLabel) => {
            const tabKey = tabLabel === 'Overview' ? 'overview' : tabLabel === 'Analytics' ? 'analytics' : tabLabel === 'User Management' ? 'users' : 'system';
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`flex-1 min-w-[120px] py-3 px-5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {tabLabel}
              </button>
            );
          })}
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && dashboardData && (
          <div className="mt-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Students */}
              <div className="card group hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Students</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mt-3 font-mono">
                      {dashboardData.total_students || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 text-blue-400 border border-blue-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-blue-500/5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Faculty */}
              <div className="card group hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-emerald-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Faculty</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mt-3 font-mono">
                      {dashboardData.total_faculty || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-emerald-500/5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Active Courses */}
              <div className="card group hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-purple-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Courses</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-300 mt-3 font-mono">
                      {dashboardData.active_courses || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/10 text-purple-400 border border-purple-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-purple-500/5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="card group hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-amber-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">System Health</p>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300 mt-4 tracking-wide font-sans">
                      {dashboardData.system_health || 'Good'}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-tr from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-amber-500/5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Progress Metrics */}
            {dashboardData.performance_metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md">
                  <h4 className="font-bold text-white text-sm mb-3">Average Attendance</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-slate-950/60 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full"
                        style={{ width: `${dashboardData.performance_metrics.avg_attendance || 0}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 text-sm font-black text-white font-mono">{dashboardData.performance_metrics.avg_attendance || 0}%</span>
                  </div>
                </div>

                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md">
                  <h4 className="font-bold text-white text-sm mb-3">Average Score</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-slate-950/60 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full"
                        style={{ width: `${dashboardData.performance_metrics.avg_score || 0}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 text-sm font-black text-white font-mono">{dashboardData.performance_metrics.avg_score || 0}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activities */}
            {dashboardData.recent_activities && dashboardData.recent_activities.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-bold text-white tracking-tight mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {dashboardData.recent_activities.map((activity, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl backdrop-blur-md flex justify-between items-center hover:bg-white/[0.04] transition-colors">
                      <div>
                        <p className="font-bold text-white text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1 font-semibold">{activity.user} — {activity.timestamp}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${
                        activity.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' :
                        activity.type === 'warning' ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' :
                        'bg-blue-500/10 border-blue-500/25 text-blue-400'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && (
          <div className="mt-8">
            {analyticsLoading ? (
              <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
                  <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
                  <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
                </div>
                <div className="h-64 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
              </div>
            ) : analyticsData ? (
              <div className="space-y-8">
                {/* Analytics Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Total Enrollments */}
                  <div className="card group hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-transparent pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Enrollments</p>
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mt-3 font-mono">
                          {analyticsData.total_enrollments || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 text-blue-400 border border-blue-500/25 rounded-2xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  <div className="card group hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-emerald-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/[0.02] to-transparent pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completion Rate</p>
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mt-3 font-mono">
                          {analyticsData.completion_rate || 0}%
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/25 rounded-2xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* At-Risk Students */}
                  <div className="card group hover:-translate-y-1 hover:border-rose-500/30 hover:shadow-rose-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-600/[0.02] to-transparent pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">At-Risk Students</p>
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-300 mt-3 font-mono">
                          {analyticsData.at_risk_count || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-tr from-rose-500/20 to-red-500/10 text-rose-400 border border-rose-500/25 rounded-2xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department enrollments & System Growth */}
                {analyticsData.department_stats && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Department stats */}
                    <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white tracking-tight">Department Enrollments</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-gray-400 border border-white/5">Students metric</span>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={Object.entries(analyticsData.department_stats).map(([name, count]) => ({ name, students: typeof count === 'object' ? count.students : count }))}>
                            <defs>
                              <linearGradient id="barGradientAdmin" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }} />
                            <RechartsTooltip 
                              cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                              contentStyle={{ backgroundColor: '#090d1f', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f3f4f6' }}
                            />
                            <Bar dataKey="students" fill="url(#barGradientAdmin)" radius={[6, 6, 0, 0]} barSize={26} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Line Chart growth */}
                    <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white tracking-tight">System Growth</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-gray-400 border border-white/5">Simulated scale</span>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { month: 'Jan', users: 120 },
                            { month: 'Feb', users: 150 },
                            { month: 'Mar', users: 180 },
                            { month: 'Apr', users: Math.max(200, analyticsData.total_enrollments || 200) }
                          ]}>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#090d1f', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f3f4f6' }} />
                            <Line type="monotone" dataKey="users" stroke="#00f5ff" strokeWidth={4} dot={{ r: 5, fill: "#00f5ff", stroke: "#070b19", strokeWidth: 2 }} activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center p-8">
                <button onClick={fetchAnalytics} className="btn-primary">
                  Load Analytics Stream
                </button>
              </div>
            )}
          </div>
        )}

        {/* User Management Tab Content */}
        {activeTab === 'users' && (
          <div className="mt-8 space-y-8">
            {/* Create User Form */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md max-w-3xl mx-auto">
              <div className="mb-5">
                <h3 className="text-base font-bold text-white tracking-tight">Create New User Profile</h3>
                <p className="text-xs text-gray-400 mt-1">Specify new account details to deploy profile into active server sync.</p>
              </div>
              
              {userMessage && (
                <div className={`mb-5 p-4 rounded-xl border text-sm font-semibold ${
                  userMessage.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {userMessage.text}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Email</label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                    placeholder="user@edufy.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Password</label>
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="md:col-span-2 mt-2">
                  <button type="submit" className="btn-primary w-full py-3 rounded-xl font-bold">
                    Deploy User Profile
                  </button>
                </div>
              </form>
            </div>

            {/* Users List */}
            <div>
              <h3 className="text-base font-bold text-white tracking-tight mb-4">All Registered Users</h3>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-hidden border border-white/5 rounded-2xl bg-slate-950/20 shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/5">
                      <thead className="bg-white/[0.02]">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-transparent">
                        {users.map((user, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">{user.full_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                user.role === 'admin' ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' :
                                user.role === 'faculty' ? 'bg-blue-500/10 border-blue-500/25 text-blue-400' :
                                'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No users logged in system index.</p>
              )}
            </div>
          </div>
        )}

        {/* System Stats Tab Content */}
        {activeTab === 'system' && (
          <div className="mt-8 space-y-6">
            {systemStats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-5 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md hover:-translate-y-0.5 duration-300">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Database Status</h4>
                    <p className="text-2xl font-black text-emerald-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      CONNECTED
                    </p>
                  </div>
                  <div className="card p-5 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md hover:-translate-y-0.5 duration-300">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Engine status</h4>
                    <p className="text-2xl font-black text-emerald-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      {systemStats.ai_service?.toUpperCase() || 'ACTIVE'}
                    </p>
                  </div>
                </div>
                
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md">
                  <h4 className="font-bold text-white text-sm mb-3">System Specification Index</h4>
                  <pre className="text-xs text-indigo-300 overflow-auto bg-slate-950/80 p-4 rounded-xl border border-white/5 font-mono leading-relaxed">
                    {JSON.stringify(systemStats, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex justify-center p-8">
                <button onClick={fetchSystemStats} className="btn-primary">
                  Fetch Core Specifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
