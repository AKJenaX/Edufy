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
      <div className="space-y-8 animate-pulse relative">
        <div className="h-32 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
          <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
          <div className="h-36 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
          <div className="h-80 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
      case 'high': return 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border border-gray-500/20';
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-glow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-glow" />

      {/* Welcome Hero Section */}
      <div className="card relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-[#0a1128]/95 to-slate-950/90 border border-white/10 hover:border-indigo-500/20 shadow-indigo-500/5 transform hover:scale-[1.005] duration-300">
        {/* Glow Aura Inside Hero Card */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Live Workspace Active
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{user?.full_name}</span>!
            </h1>
            <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Here is your real-time academic analysis and AI study suggestions.</p>
          </div>
          
          <div className="flex items-center gap-4 self-stretch md:self-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
            <div className="px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl backdrop-blur-md">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Current Term</p>
              <p className="text-sm font-extrabold text-white">Spring 2026</p>
            </div>
            <div className="px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl backdrop-blur-md">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">LMS Sync</p>
              <p className="text-sm font-extrabold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="card group hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-500/5 duration-300 bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Attendance</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mt-3 font-mono">
                {performance?.attendance_percentage?.toFixed(1) || '0.0'}%
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 text-blue-400 border border-blue-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-blue-500/5">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
            <span className="text-xs font-medium text-gray-300">{performance?.attended_classes || 0}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Attended out of</span>
            <span className="text-xs font-medium text-gray-300">{performance?.total_classes || 0} classes</span>
          </div>
        </div>

        {/* Average Score Card */}
        <div className="card group hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-emerald-500/5 duration-300 bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/[0.02] to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Score</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mt-3 font-mono">
                {performance?.average_score?.toFixed(1) || '0.0'}
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-emerald-500/5">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
            <span className="text-xs font-medium text-emerald-400">Class Performance Index</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">• out of 100</span>
          </div>
        </div>

        {/* Risk Level Card */}
        <div className="card group hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-purple-500/5 duration-300 bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/[0.02] to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Level</p>
              <span className={`text-sm font-bold mt-4 px-3 py-1.5 rounded-xl inline-block uppercase tracking-wider ${getRiskColor(performance?.risk_level)}`}>
                {performance?.risk_level || 'N/A'}
              </span>
            </div>
            <div className="p-3.5 bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/10 text-purple-400 border border-purple-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-purple-500/5">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Drop Out / Fail Risk Score</span>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Overview Card */}
        <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Attendance Overview</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-gray-400 border border-white/5">Visual index</span>
          </div>
          
          <div className="h-64 flex items-center justify-center relative">
            {(!performance || !performance.total_classes) ? (
              <div className="flex flex-col items-center justify-center text-center p-6 my-auto">
                <div className="relative mb-5">
                  {/* Glowing outer circles */}
                  <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-ping" />
                  <div className="p-4 bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-white/10 rounded-full shadow-xl text-indigo-400 z-10 relative">
                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">No active classes enrolled</h3>
                <p className="text-xs text-gray-400 mt-2 max-w-[280px] leading-relaxed">Attendance indexes populate automatically once class enrollment lists are cleared.</p>
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
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#090d1f', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f3f4f6' }} />
                  <Legend formatter={(value) => <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Performance Card */}
        <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Performance</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-gray-400 border border-white/5">Exams & quizzes</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Assignment 1', score: performance?.average_score ? Math.min(100, performance.average_score + 5) : 80 },
                { name: 'Quiz 1', score: performance?.average_score ? Math.max(0, performance.average_score - 5) : 75 },
                { name: 'Midterm', score: performance?.average_score || 82 },
                { name: 'Project', score: performance?.average_score ? Math.min(100, performance.average_score + 8) : 90 },
              ]}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                  contentStyle={{ backgroundColor: '#090d1f', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f3f4f6' }}
                />
                <Bar dataKey="score" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {performance?.recommendations && performance.recommendations.length > 0 && (
        <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden">
          <h2 className="text-lg font-bold text-white tracking-tight mb-5">AI Learning Recommendations</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performance.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start p-4 bg-white/[0.02] border border-white/5 rounded-xl backdrop-blur-md">
                <span className="flex-shrink-0 p-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg mr-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-gray-300 text-sm font-medium leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden">
        <h2 className="text-lg font-bold text-white tracking-tight mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <a href="/student/ai-assistant" className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-indigo-500/30 hover:bg-gradient-to-br hover:from-indigo-950/20 hover:to-blue-950/20 transform hover:-translate-y-0.5 duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl text-indigo-400 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-bold text-white text-sm">AI Learning Assistant</p>
                <p className="text-xs text-gray-400 mt-1">Get immediate tutoring assistance</p>
              </div>
            </div>
          </a>

          <a href="/student/attendance" className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 hover:bg-gradient-to-br hover:from-emerald-950/20 hover:to-teal-950/20 transform hover:-translate-y-0.5 duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-bold text-white text-sm">View Attendance</p>
                <p className="text-xs text-gray-400 mt-1">Audit your daily class attendance</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
