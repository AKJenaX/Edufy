import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PredictiveAnalysis() {
  const historicalData = [
    { period: 'Jan', actual: 64, predicted: null },
    { period: 'Feb', actual: 70, predicted: null },
    { period: 'Mar', actual: 76, predicted: null },
    { period: 'Apr', actual: 82, predicted: null },
    { period: 'May', actual: 86, predicted: null },
    { period: 'Jun', actual: 90, predicted: 90 },
    { period: 'Jul', actual: null, predicted: 92 },
    { period: 'Aug', actual: null, predicted: 94 },
  ];

  const predictions = [
    { metric: 'Next Test Score', value: '92%', confidence: 85, trend: 'up' },
    { metric: 'Overall Improvement', value: '+8%', confidence: 78, trend: 'up' },
    { metric: 'Risk Assessment', value: 'Low', confidence: 72, trend: 'stable' },
  ];

  const factors = [
    { factor: 'Historical Trend', impact: 'High', influence: 'Positive' },
    { factor: 'Effort Consistency', impact: 'High', influence: 'Positive' },
    { factor: 'Topic Mastery', impact: 'Medium', influence: 'Mixed' },
    { factor: 'Practice Hours', impact: 'Medium', influence: 'Positive' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Predictive Analysis</h3>
          <p className="text-sm text-gray-500">AI-powered forecasts and insights</p>
        </div>
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔮</span>
        </div>
      </div>

      {/* Prediction Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[50, 100]} />
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
              dataKey="actual" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ r: 5 }}
              name="Actual Scores"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Predicted Scores"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Predictions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {predictions.map((prediction, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4"
          >
            <div className="text-xs text-gray-600 font-medium mb-1">{prediction.metric}</div>
            <div className="text-2xl font-bold text-purple-700 mb-1">{prediction.value}</div>
            <div className="flex items-center space-x-1">
              <div className="text-xs text-gray-600">{prediction.confidence}% confidence</div>
              {prediction.trend === 'up' && <span className="text-green-600">↑</span>}
              {prediction.trend === 'down' && <span className="text-red-600">↓</span>}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-4">
        <div className="flex items-start space-x-2 mb-3">
          <span className="text-xl">🤖</span>
          <div>
            <div className="font-semibold text-indigo-900 mb-2">AI Model Prediction</div>
            <div className="text-sm text-indigo-800 mb-1">
              Based on your upward trend, consistent effort (68 hrs/week), and improving topic mastery, 
              we predict your next test score will be <span className="font-bold">92% ± 3%</span>.
            </div>
            <div className="text-xs text-indigo-700">
              Reason: Steady improvement pattern + increased study hours + focused practice on weak topics.
            </div>
          </div>
        </div>
      </div>

      {/* Influencing Factors */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="text-sm font-semibold text-gray-700 mb-3">Key Factors</div>
        <div className="space-y-2">
          {factors.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-gray-700">{item.factor}</span>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded ${
                  item.influence === 'Positive' ? 'bg-green-100 text-green-700' :
                  item.influence === 'Negative' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.impact}
                </span>
                <span className={item.influence === 'Positive' ? 'text-green-600' : 'text-red-600'}>
                  {item.influence === 'Positive' ? '↑' : '↓'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
