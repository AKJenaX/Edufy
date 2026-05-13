import { useState } from 'react';
import { generateTimetable } from '../services/api';

function AdminDashboard() {
  const [subjects, setSubjects] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Convert comma-separated string to array
      const subjectsArray = subjects.split(',').map(s => s.trim()).filter(s => s);
      
      const result = await generateTimetable({ subjects: subjectsArray });
      setTimetable(result);
      console.log('Timetable generated:', result);
    } catch (err) {
      console.error('Error generating timetable:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h2>Admin Dashboard</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Subjects (comma separated):
            <input
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="Math, Physics, Chemistry"
              required
              style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
            />
          </label>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {loading ? 'Generating...' : 'Generate Timetable'}
        </button>
      </form>
      
      {error && (
        <div style={{ marginTop: '10px', color: 'red' }}>
          Error: {error}
        </div>
      )}
      
      {timetable && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated Timetable:</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '5px',
            overflow: 'auto'
          }}>
            {JSON.stringify(timetable, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

// Made with Bob
