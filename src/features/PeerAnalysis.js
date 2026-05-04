import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export default function PeerAnalysis() {
  const comparisonData = [
    { name: 'You', avg: 82, strength: 85, improvement: 78 },
    { name: 'Class Avg', avg: 76, strength: 72, improvement: 70 },
    { name: 'Top Student', avg: 93, strength: 95, improvement: 90 },
  ];

  const subjectComparison = [
    { subject: 'Math', you: 88, class: 75, top: 96 },
    { subject: 'DSA', you: 78, class: 72, top: 94 },
    { subject: 'DBMS', you: 82, class: 70, top: 97 },
  ];

  const radarData = [
    { subject: 'Math', score: 88, fullMark: 100 },
    { subject: 'DSA', score: 78, fullMark: 100 },
    { subject: 'DBMS', score: 82, fullMark: 100 },
    { subject: 'AI', score: 74, fullMark: 100 },
    { subject: 'OS', score: 68, fullMark: 100 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Class Comparison</h3>
          <p className="text-sm text-gray-500">See how you compare with peers</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">👥</span>
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }} 
            />
            <Bar dataKey="avg" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl text-center">
          <div className="text-xs text-blue-600 font-medium mb-1">Your Position</div>
          <div className="text-xl font-bold text-blue-700">#5</div>
          <div className="text-xs text-blue-600 mt-1">Out of 40</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl text-center">
          <div className="text-xs text-green-600 font-medium mb-1">Above Avg</div>
          <div className="text-xl font-bold text-green-700">+8%</div>
          <div className="text-xs text-green-600 mt-1">vs Class</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl text-center">
          <div className="text-xs text-purple-600 font-medium mb-1">Gap to Top</div>
          <div className="text-xl font-bold text-purple-700">-11%</div>
          <div className="text-xs text-purple-600 mt-1">Target</div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-2">
          <span className="text-xl">💡</span>
          <div className="text-sm text-yellow-900">
            <div className="font-semibold mb-1">Key Insight</div>
            <div>You're performing above average! Focus on AI and OS to close the gap with top students.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
