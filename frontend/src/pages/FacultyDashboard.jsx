import { useState } from 'react';
import { markAttendance } from '../services/api';

function FacultyDashboard() {
  const [formData, setFormData] = useState({
    student_id: '',
    subject: '',
    date: '',
    status: 'present'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await markAttendance(formData);
      setMessage('Attendance marked successfully!');
      alert('Attendance marked successfully!');
      console.log('Attendance result:', result);
      
      // Reset form
      setFormData({
        student_id: '',
        subject: '',
        date: '',
        status: 'present'
      });
    } catch (err) {
      console.error('Error marking attendance:', err);
      setMessage('Error marking attendance: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h2>Faculty Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Student ID:
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            Subject:
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            Status:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </label>
        </div>
        
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Mark Attendance
        </button>
      </form>
      
      {message && <p style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}

export default FacultyDashboard;

// Made with Bob
