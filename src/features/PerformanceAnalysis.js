import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function PerformanceAnalysis() {
  const timeSeriesData = [
    { month: 'Jan', marks: 64, effort: 45 },
    { month: 'Feb', marks: 70, effort: 50 },
    { month: 'Mar', marks: 76, effort: 60 },
    { month: 'Apr', marks: 82, effort: 68 },
    { month: 'May', marks: 86, effort: 72 },
    { month: 'Jun', marks: 90, effort: 75 },
  ];

  const subjectData = [
    { subject: 'Math', marks: 88 },
    { subject: 'DSA', marks: 78 },
    { subject: 'DBMS', marks: 82 },
    { subject: 'AI', marks: 74 },
    { subject: 'OS', marks: 68 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-3">
            <span className="text-xs font-bold text-blue-600">📊 Analytics</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2 gradient-text-primary">Performance Trends</h3>
          <p className="text-base text-gray-600">Track your academic progress over time with detailed trend analysis</p>
        </div>
        <div className="icon-container w-16 h-16 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">📊</span>
        </div>
      </div>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="marks" 
              stroke="#4F46E5" 
              strokeWidth={3} 
              dot={{ r: 5 }}
              name="Marks"
            />
            <Line 
              type="monotone" 
              dataKey="effort" 
              stroke="#06B6D4" 
              strokeWidth={3} 
              dot={{ r: 5 }}
              name="Effort"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={subjectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="subject" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }} 
            />
            <Bar dataKey="marks" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 hover-scale shadow-md">
          <div className="text-xs font-bold text-blue-600 mb-2">Last Test</div>
          <div className="text-3xl font-black text-gray-900 mb-1">90%</div>
          <div className="text-xs text-gray-600">Best so far 🎉</div>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 hover-scale shadow-md">
          <div className="text-xs font-bold text-emerald-600 mb-2">Avg Effort</div>
          <div className="text-3xl font-black text-gray-900 mb-1">68 hrs</div>
          <div className="text-xs text-gray-600">Per week</div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 hover-scale shadow-md">
          <div className="text-xs font-bold text-purple-600 mb-2">Improvement</div>
          <div className="text-3xl font-black text-gray-900 mb-1">+28%</div>
          <div className="text-xs text-gray-600">From baseline</div>
        </div>
      </div>
    </div>
  );
}
