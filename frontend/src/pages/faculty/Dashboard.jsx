import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function FacultyDashboard() {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [selectedTimetableDay, setSelectedTimetableDay] = useState('Monday');

  // Attendance Form State
  const [attendanceForm, setAttendanceForm] = useState({
    student_id: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present'
  });
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState(null);

  // Timetable Form State
  const [timetableForm, setTimetableForm] = useState({
    subjects: '',
    constraints: ''
  });
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/faculty/dashboard', {
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

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setAttendanceLoading(true);
    setAttendanceMessage(null);

    try {
      await axios.post(
        'http://localhost:8000/faculty/attendance/mark',
        attendanceForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceMessage({ type: 'success', text: 'Attendance marked successfully!' });
      setAttendanceForm({
        student_id: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present'
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Error marking attendance:', err);
      setAttendanceMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to mark attendance'
      });
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleGenerateTimetable = async (e) => {
    e.preventDefault();
    setTimetableLoading(true);

    try {
      const subjects = timetableForm.subjects.split(',').map(s => s.trim()).filter(s => s);
      const constraints = timetableForm.constraints.split(',').map(c => c.trim()).filter(c => c);

      const response = await axios.post(
        'http://localhost:8000/faculty/timetable/generate',
        { subjects, constraints },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneratedTimetable(response.data);
    } catch (err) {
      console.error('Error generating timetable:', err);
      alert(err.response?.data?.detail || 'Failed to generate timetable');
    } finally {
      setTimetableLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse relative">
        <div className="h-32 bg-slate-900/40 border border-white/5 rounded-2xl"></div>
        <div className="h-14 bg-slate-900/40 border border-white/5 rounded-2xl w-full sm:w-1/2"></div>
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
              Faculty Administration Active
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Faculty Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Manage classes, mark student attendance, and generate optimized timetables.</p>
          </div>
        </div>
      </div>

      {/* Tabs Selector Card */}
      <div className="card bg-slate-900/40 border border-white/5 shadow-2xl p-2 sm:p-2.5">
        <div className="flex flex-wrap p-1 bg-white/[0.02] border border-white/5 rounded-2xl gap-1">
          {['Overview', 'Mark Attendance', 'Generate Timetable'].map((tabLabel) => {
            const tabKey = tabLabel === 'Overview' ? 'overview' : tabLabel === 'Mark Attendance' ? 'attendance' : 'timetable';
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Classes Stats */}
              <div className="card group hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Classes</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mt-3 font-mono">
                      {dashboardData.total_classes || 0}
                    </p>
                  </div>
                  <div className="p-3.5 bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 text-blue-400 border border-blue-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-blue-500/5">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Active Students Stats */}
              <div className="card group hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-emerald-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Students</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mt-3 font-mono">
                      {dashboardData.active_students || 0}
                    </p>
                  </div>
                  <div className="p-3.5 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-emerald-500/5">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Average Attendance Stats */}
              <div className="card group hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-purple-500/5 duration-300 bg-slate-900/40 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Attendance</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-300 mt-3 font-mono">
                      {dashboardData.average_attendance || 0}%
                    </p>
                  </div>
                  <div className="p-3.5 bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/10 text-purple-400 border border-purple-500/25 rounded-2xl group-hover:scale-110 duration-300 shadow-lg shadow-purple-500/5">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Student Status Card */}
              <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white tracking-tight">Student Status Overview</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-gray-400 border border-white/5">Active vs Risk</span>
                </div>

                <div className="h-64 flex items-center justify-center relative">
                  {(dashboardData.active_students === 0) ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 my-auto">
                      <div className="relative mb-5">
                        <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-ping" />
                        <div className="p-4 bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-white/10 rounded-full shadow-xl text-indigo-400 z-10 relative">
                          <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-wide">No active students registered</h3>
                      <p className="text-xs text-gray-400 mt-2 max-w-[280px]">Status ratios populate instantly once students register under your classes.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Active', value: Math.max(0, (dashboardData.active_students || 0) - (dashboardData.at_risk_students?.length || 0)) },
                            { name: 'At Risk', value: dashboardData.at_risk_students?.length || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={6}
                          dataKey="value"
                        >
                          <Cell fill="#3B82F6" />
                          <Cell fill="#EF4444" />
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#090d1f', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f3f4f6' }} />
                        <Legend formatter={(value) => <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Recent Attendance Card */}
              <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white tracking-tight">Recent Attendance Index</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-gray-400 border border-white/5">Lectures audit</span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.recent_classes?.length > 0 ? dashboardData.recent_classes.map(c => ({ name: c.subject, attendance: c.attendance_count })) : [{name: 'Math', attendance: 26}, {name: 'Physics', attendance: 22}]}>
                      <defs>
                        <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }} />
                      <RechartsTooltip 
                        cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                        contentStyle={{ backgroundColor: '#090d1f', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f3f4f6' }}
                      />
                      <Bar dataKey="attendance" fill="url(#attendanceGradient)" radius={[6, 6, 0, 0]} barSize={26} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Lists Section: Recent Classes & At-Risk Students */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Recent Classes List */}
              {dashboardData.recent_classes && dashboardData.recent_classes.length > 0 && (
                <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden">
                  <h3 className="text-base font-bold text-white tracking-tight mb-4">Recent Classes</h3>
                  <div className="space-y-3">
                    {dashboardData.recent_classes.map((cls, idx) => (
                      <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl backdrop-blur-md flex justify-between items-center hover:bg-white/[0.04] transition-colors">
                        <div>
                          <p className="font-bold text-white text-sm">{cls.subject}</p>
                          <p className="text-[10px] text-gray-500 mt-1 font-semibold uppercase">{cls.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-xs font-semibold">
                          {cls.attendance_count} students
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* At-Risk Students List */}
              {dashboardData.at_risk_students && dashboardData.at_risk_students.length > 0 && (
                <div className="card bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden">
                  <h3 className="text-base font-bold text-rose-400 tracking-tight mb-4">At-Risk Students List</h3>
                  <div className="space-y-3">
                    {dashboardData.at_risk_students.map((student, idx) => (
                      <div key={idx} className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl flex justify-between items-center hover:bg-rose-500/[0.08] transition-colors">
                        <div>
                          <p className="font-bold text-white text-sm">{student.name}</p>
                          <p className="text-xs text-rose-300 mt-1">
                            Attendance: <span className="font-semibold">{student.attendance}%</span> | Score: <span className="font-semibold">{student.score}%</span>
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-[10px] font-bold uppercase tracking-wider animate-pulse">
                          Alert
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mark Attendance Tab Content */}
        {activeTab === 'attendance' && (
          <div className="mt-8 max-w-xl mx-auto">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Mark Student Attendance</h3>
              <p className="text-xs text-gray-400 mt-1">Enter student registration index and subject specifics to commit records.</p>
            </div>
            
            {attendanceMessage && (
              <div className={`mb-5 p-4 rounded-xl border text-sm font-semibold ${
                attendanceMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {attendanceMessage.text}
              </div>
            )}

            <form onSubmit={handleMarkAttendance} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Student ID
                </label>
                <input
                  type="text"
                  value={attendanceForm.student_id}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, student_id: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                  placeholder="e.g., STU001"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Subject
                </label>
                <input
                  type="text"
                  value={attendanceForm.subject}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Date
                </label>
                <input
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Status
                </label>
                <select
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                  required
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={attendanceLoading}
                className="btn-primary w-full py-3 rounded-xl mt-4"
              >
                {attendanceLoading ? 'Saving changes...' : 'Commit Attendance Record'}
              </button>
            </form>
          </div>
        )}

        {/* Timetable Tab Content */}
        {activeTab === 'timetable' && (
          <div className="mt-8 space-y-10">
            {/* Input Form Wrapper */}
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Generate Class Timetable</h3>
                <p className="text-xs text-gray-400 mt-1">Provide class subject lists and constraint preferences to auto-generate schedules.</p>
              </div>
              
              <form onSubmit={handleGenerateTimetable} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Subjects (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={timetableForm.subjects}
                    onChange={(e) => setTimetableForm({ ...timetableForm, subjects: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                    placeholder="e.g., Math, Physics, Chemistry"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Constraints (optional, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={timetableForm.constraints}
                    onChange={(e) => setTimetableForm({ ...timetableForm, constraints: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                    placeholder="e.g., No classes on Friday, Morning slots preferred"
                  />
                </div>

                <button
                  type="submit"
                  disabled={timetableLoading}
                  className="btn-primary w-full py-3 rounded-xl mt-4"
                >
                  {timetableLoading ? 'Deploying engine...' : 'Generate Optimal Timetable'}
                </button>
              </form>
            </div>

            {/* Generated Timetable Section - Much wider for full week overview! */}
            {generatedTimetable && (
              <div className="max-w-7xl mx-auto space-y-6 pt-8 border-t border-white/5 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">Generated Timetable Overview</h4>
                    <p className="text-xs text-gray-400 mt-1">Schedule compiled with {generatedTimetable.total_subjects} subjects across {generatedTimetable.total_classes} weekly classes.</p>
                  </div>
                  
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Timetable
                  </button>
                </div>

                {/* Constraints */}
                {generatedTimetable.constraints && generatedTimetable.constraints.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {generatedTimetable.constraints.map((constraint, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20 shadow-md">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Constraint: {constraint}
                      </span>
                    ))}
                  </div>
                )}

                {/* Weekly Horizontal Kanban/Grid Board */}
                <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <div className="flex gap-4 md:gap-5 min-w-[1100px] lg:min-w-full">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                      const classes = generatedTimetable.timetable?.[day] || [];
                      return (
                        <div 
                          key={day} 
                          className="flex-1 min-w-[210px] flex flex-col bg-[#0b1227]/60 border border-white/5 rounded-2xl p-4 hover:border-indigo-500/20 duration-300 shadow-xl backdrop-blur-md relative"
                        >
                          {/* Day Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                            <h5 className="font-extrabold text-white text-xs sm:text-sm tracking-tight uppercase tracking-widest">{day}</h5>
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider uppercase ${
                              classes.length > 0 
                                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 shadow-md shadow-indigo-500/5' 
                                : 'bg-white/5 text-gray-500 border border-white/5'
                            }`}>
                              {classes.length} {classes.length === 1 ? 'Class' : 'Classes'}
                            </span>
                          </div>

                          {/* Cards List */}
                          <div className="space-y-3 flex-1 flex flex-col justify-start">
                            {classes.length > 0 ? (
                              classes.map((cls, idx) => (
                                <div 
                                  key={idx} 
                                  className="relative overflow-hidden bg-gradient-to-b from-[#111833]/90 to-[#0e142b]/95 border border-white/5 hover:border-indigo-500/30 rounded-xl p-3.5 hover:-translate-y-0.5 duration-200 shadow-lg group"
                                >
                                  {/* Left Accent Accent Accent */}
                                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-blue-500 group-hover:from-indigo-400 group-hover:to-cyan-400 duration-200" />
                                  
                                  <div className="space-y-2">
                                    {/* Subject */}
                                    <p className="font-black text-white text-xs tracking-tight break-words leading-snug pl-1">
                                      {cls.subject}
                                    </p>
                                    
                                    {/* Time */}
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium pl-1">
                                      <svg className="w-3 h-3 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {cls.time}
                                    </div>

                                    {/* Meta Row: Room Badge and Faculty */}
                                    <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-white/5 pl-1">
                                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-md">
                                        <svg className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {cls.room}
                                      </span>

                                      {cls.faculty && (
                                        <span className="text-[9px] text-gray-500 font-medium truncate max-w-[80px]" title={cls.faculty}>
                                          {cls.faculty}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-2 border border-dashed border-white/5 rounded-xl min-h-[140px] bg-white/[0.01]">
                                <svg className="w-5 h-5 text-gray-600 mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">Rest Day</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;
