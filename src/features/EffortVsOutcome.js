import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function EffortVsOutcome() {
  const data = [
    { effort: 45, marks: 64, week: 'Week 1' },
    { effort: 50, marks: 70, week: 'Week 2' },
    { effort: 60, marks: 76, week: 'Week 3' },
    { effort: 68, marks: 82, week: 'Week 4' },
    { effort: 72, marks: 86, week: 'Week 5' },
    { effort: 75, marks: 90, week: 'Week 6' },
  ];

  const getColor = (marks) => {
    if (marks >= 85) return '#10b981'; // green
    if (marks >= 70) return '#3b82f6'; // blue
    return '#f59e0b'; // orange
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Effort vs Outcome</h3>
          <p className="text-sm text-gray-500">Understanding the relationship between study time and performance</p>
        </div>
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">⚖️</span>
        </div>
      </div>

      {/* Scatter Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              dataKey="effort" 
              name="Effort (hrs)" 
              unit="hrs"
              stroke="#6b7280"
              label={{ value: 'Study Hours per Week', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="marks" 
              name="Marks" 
              unit="%"
              stroke="#6b7280"
              domain={[50, 100]}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }} 
            />
            <Scatter 
              name="Performance" 
              data={data} 
              fill="#6366f1"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.marks)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
          <div className="text-xs text-blue-600 font-medium mb-1">Efficiency Ratio</div>
          <div className="text-xl font-bold text-blue-700">1.20x</div>
          <div className="text-xs text-blue-600 mt-1">Good effort payoff</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
          <div className="text-xs text-green-600 font-medium mb-1">Trend Direction</div>
          <div className="text-xl font-bold text-green-700">↑ Upward</div>
          <div className="text-xs text-green-600 mt-1">Positive correlation</div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3">
          <div className="text-xs text-purple-600 font-medium mb-1">Sweet Spot</div>
          <div className="text-xl font-bold text-purple-700">~70 hrs</div>
          <div className="text-xs text-purple-600 mt-1">Optimal hours</div>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-start space-x-2">
          <span className="text-lg">📈</span>
          <div className="text-sm text-gray-700">
            <div className="font-semibold mb-1">Key Finding</div>
            <div>Your study hours have a strong positive correlation with marks. Each additional hour of focused study yields approximately 0.4% increase in marks.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
