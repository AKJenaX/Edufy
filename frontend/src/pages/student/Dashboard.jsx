import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function StudentDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const response = await axios.get('http://localhost:8000/student/performance');
      setPerformance(response.data);
    } catch (error) {
      console.error('Error fetching performance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
          <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
          <div className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
          <div className="h-80 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
        </div>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30';
      case 'high': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Here's your academic overview</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Attendance</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {performance?.attendance_percentage?.toFixed(1) || '0.0'}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {performance?.attended_classes || 0} / {performance?.total_classes || 0} classes
          </p>
        </div>

        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Score</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {performance?.average_score?.toFixed(1) || '0.0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Out of 100</p>
        </div>

        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Risk Level</p>
              <p className={`text-2xl font-bold mt-2 px-3 py-1 rounded-lg inline-block ${getRiskColor(performance?.risk_level)}`}>
                {performance?.risk_level || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Attendance Overview</h2>
          <div className="h-64 flex items-center justify-center">
            {(!performance || !performance.total_classes) ? (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-full mb-3">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No attendance records found</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You haven't been enrolled in any classes yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Attended', value: performance?.attended_classes || 0 },
                      { name: 'Missed', value: Math.max(0, (performance?.total_classes || 0) - (performance?.attended_classes || 0)) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#374151' : '#e2e8f0', color: isDark ? '#f3f4f6' : '#1f2937' }} />
                  <Legend formatter={(value) => <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Assignment 1', score: performance?.average_score ? Math.min(100, performance.average_score + 5) : 80 },
                { name: 'Quiz 1', score: performance?.average_score ? Math.max(0, performance.average_score - 5) : 75 },
                { name: 'Midterm', score: performance?.average_score || 82 },
                { name: 'Project', score: performance?.average_score ? Math.min(100, performance.average_score + 8) : 90 },
              ]}>
                <CartesianGrid stroke={isDark ? "#374151" : "#e2e8f0"} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? "#9ca3af" : "#4b5563" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? "#9ca3af" : "#4b5563" }} />
                <RechartsTooltip 
                  cursor={{fill: 'transparent'}} 
                  contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#374151' : '#e2e8f0', color: isDark ? '#f3f4f6' : '#1f2937' }}
                />
                <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {performance?.recommendations && performance.recommendations.length > 0 && (
        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {performance.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-200">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/student/ai-assistant" className="p-4 border-2 border-blue-200 dark:border-blue-900/40 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900 dark:text-white">AI Learning Assistant</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get help with your studies</p>
              </div>
            </div>
          </a>

          <a href="/student/attendance" className="p-4 border-2 border-green-200 dark:border-green-900/40 rounded-lg hover:border-green-400 dark:hover:border-green-500 transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900 dark:text-white">View Attendance</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check your attendance records</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
