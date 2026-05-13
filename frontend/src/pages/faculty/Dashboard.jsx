import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function FacultyDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

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
      // Refresh dashboard data
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
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
        <div className="h-12 bg-gray-200 rounded-xl dark:bg-gray-800 w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage classes, attendance, and student performance</p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'attendance'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'timetable'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Generate Timetable
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="mt-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Classes</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {dashboardData.total_classes || 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Active Students</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {dashboardData.active_students || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Avg Attendance</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {dashboardData.average_attendance || 0}%
                </p>
              </div>
            </div>

            {/* Class Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Student Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Active', value: Math.max(0, (dashboardData.active_students || 0) - (dashboardData.at_risk_students?.length || 0)) },
                          { name: 'At Risk', value: dashboardData.at_risk_students?.length || 0 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#3B82F6" />
                        <Cell fill="#EF4444" />
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Attendance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.recent_classes?.length > 0 ? dashboardData.recent_classes.map(c => ({ name: c.subject, attendance: c.attendance_count })) : [{name: 'Math', attendance: 25}, {name: 'Physics', attendance: 22}]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="attendance" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Classes */}
            {dashboardData.recent_classes && dashboardData.recent_classes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Classes</h3>
                <div className="space-y-2">
                  {dashboardData.recent_classes.map((cls, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{cls.subject}</p>
                        <p className="text-sm text-gray-600">{cls.date}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {cls.attendance_count} students
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* At-Risk Students */}
            {dashboardData.at_risk_students && dashboardData.at_risk_students.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">At-Risk Students</h3>
                <div className="space-y-2">
                  {dashboardData.at_risk_students.map((student, idx) => (
                    <div key={idx} className="bg-red-50 p-3 rounded-lg">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">
                        Attendance: {student.attendance}% | Score: {student.score}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Mark Student Attendance</h3>
            
            {attendanceMessage && (
              <div className={`mb-4 p-3 rounded-lg ${
                attendanceMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {attendanceMessage.text}
              </div>
            )}

            <form onSubmit={handleMarkAttendance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  value={attendanceForm.student_id}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, student_id: e.target.value })}
                  className="input"
                  placeholder="e.g., STU001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={attendanceForm.subject}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, subject: e.target.value })}
                  className="input"
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                  className="input"
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
                className="btn-primary w-full"
              >
                {attendanceLoading ? 'Marking...' : 'Mark Attendance'}
              </button>
            </form>
          </div>
        )}

        {/* Timetable Tab */}
        {activeTab === 'timetable' && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Generate Class Timetable</h3>
            
            <form onSubmit={handleGenerateTimetable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subjects (comma-separated)
                </label>
                <input
                  type="text"
                  value={timetableForm.subjects}
                  onChange={(e) => setTimetableForm({ ...timetableForm, subjects: e.target.value })}
                  className="input"
                  placeholder="e.g., Math, Physics, Chemistry"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Constraints (optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={timetableForm.constraints}
                  onChange={(e) => setTimetableForm({ ...timetableForm, constraints: e.target.value })}
                  className="input"
                  placeholder="e.g., No classes on Friday, Morning slots preferred"
                />
              </div>

              <button
                type="submit"
                disabled={timetableLoading}
                className="btn-primary w-full"
              >
                {timetableLoading ? 'Generating...' : 'Generate Timetable'}
              </button>
            </form>

            {generatedTimetable && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Generated Timetable</h4>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(generatedTimetable, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;

// Made with Bob
