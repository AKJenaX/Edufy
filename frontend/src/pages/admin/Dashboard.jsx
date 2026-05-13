import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const { token } = useAuth();
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
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
        <div className="h-12 bg-gray-200 rounded-xl dark:bg-gray-800 w-2/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
          <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
          <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
          <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System overview and management</p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === 'system'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            System Stats
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="mt-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Students</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {dashboardData.total_students || 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total Faculty</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {dashboardData.total_faculty || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {dashboardData.active_courses || 0}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600 font-medium">System Health</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">
                  {dashboardData.system_health || 'Good'}
                </p>
              </div>
            </div>

            {/* Recent Activities */}
            {dashboardData.recent_activities && dashboardData.recent_activities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Activities</h3>
                <div className="space-y-2">
                  {dashboardData.recent_activities.map((activity, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.user} - {activity.timestamp}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        activity.type === 'success' ? 'bg-green-100 text-green-800' :
                        activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            {dashboardData.performance_metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Average Attendance</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${dashboardData.performance_metrics.avg_attendance || 0}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 font-bold">{dashboardData.performance_metrics.avg_attendance || 0}%</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Average Score</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${dashboardData.performance_metrics.avg_score || 0}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 font-bold">{dashboardData.performance_metrics.avg_score || 0}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="mt-6">
            {analyticsLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
                  <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
                  <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
              </div>
            ) : analyticsData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Total Enrollments</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {analyticsData.total_enrollments || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Completion Rate</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {analyticsData.completion_rate || 0}%
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">At-Risk Students</p>
                    <p className="text-3xl font-bold text-red-900 mt-2">
                      {analyticsData.at_risk_count || 0}
                    </p>
                  </div>
                </div>

                {analyticsData.department_stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4 dark:text-white">Department Enrollments</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={Object.entries(analyticsData.department_stats).map(([name, count]) => ({ name, students: typeof count === 'object' ? count.students : count }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <RechartsTooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="students" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4 dark:text-white">System Growth (Simulated)</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { month: 'Jan', users: 120 },
                            { month: 'Feb', users: 150 },
                            { month: 'Mar', users: 180 },
                            { month: 'Apr', users: Math.max(200, analyticsData.total_enrollments || 200) }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={fetchAnalytics} className="btn-primary">
                Load Analytics
              </button>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="mt-6 space-y-6">
            {/* Create User Form */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Create New User</h3>
              
              {userMessage && (
                <div className={`mb-4 p-3 rounded-lg ${
                  userMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  {userMessage.text}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="btn-primary w-full">
                    Create User
                  </button>
                </div>
              </form>
            </div>

            {/* Users List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">All Users</h3>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'faculty' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No users found</p>
              )}
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="mt-6">
            {systemStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Database Status</h4>
                    <p className="text-2xl font-bold text-green-600">Connected</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">AI Service</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {systemStats.ai_service || 'Active'}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">System Information</h4>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(systemStats, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <button onClick={fetchSystemStats} className="btn-primary">
                Load System Stats
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
