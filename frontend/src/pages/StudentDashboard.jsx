import { useState, useEffect } from 'react';
import { getStudentInsight } from '../services/api';

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getStudentInsight();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching student insight:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading student data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h2>Student Dashboard</h2>
      {data ? (
        <div>
          <p><strong>Attendance Percentage:</strong> {data.attendance_percentage}%</p>
          <p><strong>Average Score:</strong> {data.average_score}</p>
          <p><strong>Risk Level:</strong> {data.risk_level}</p>
          <div>
            <strong>Recommendations:</strong>
            <ul>
              {data.recommendations && data.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default StudentDashboard;

// Made with Bob
