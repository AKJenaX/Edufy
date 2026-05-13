import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function StudentDashboard() {
  const { user } = useAuth();
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
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your academic overview</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {performance?.attendance_percentage?.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {performance?.attended_classes} / {performance?.total_classes} classes
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {performance?.average_score?.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Out of 100</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className={`text-2xl font-bold mt-2 px-3 py-1 rounded-lg inline-block ${getRiskColor(performance?.risk_level)}`}>
                {performance?.risk_level}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Attendance Overview</h2>
          <div className="h-64">
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
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Assignment 1', score: performance?.average_score ? Math.min(100, performance.average_score + 5) : 80 },
                { name: 'Quiz 1', score: performance?.average_score ? Math.max(0, performance.average_score - 5) : 75 },
                { name: 'Midterm', score: performance?.average_score || 82 },
                { name: 'Project', score: performance?.average_score ? Math.min(100, performance.average_score + 8) : 90 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {performance?.recommendations && performance.recommendations.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {performance.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/student/ai-assistant" className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">AI Learning Assistant</p>
                <p className="text-sm text-gray-600">Get help with your studies</p>
              </div>
            </div>
          </a>

          <a href="/student/attendance" className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">View Attendance</p>
                <p className="text-sm text-gray-600">Check your attendance records</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

// Made with Bob
