import React from 'react';

export default function SkillGapAlert() {
  const criticalGaps = [
    { topic: 'Dynamic Programming', mastery: 22, required: 70, gap: -48 },
    { topic: 'Graphs', mastery: 33, required: 70, gap: -37 },
    { topic: 'Trees', mastery: 48, required: 70, gap: -22 },
    { topic: 'Hashing', mastery: 58, required: 70, gap: -12 },
  ];

  const suggestions = [
    { 
      topic: 'Dynamic Programming', 
      action: 'Start with basic DP patterns',
      resources: 'Knapsack, LCS, Fibonacci examples',
      priority: '🔴 Critical'
    },
    { 
      topic: 'Graphs', 
      action: 'Practice traversal algorithms',
      resources: 'BFS, DFS, Shortest Path',
      priority: '🟠 High'
    },
    { 
      topic: 'Trees', 
      action: 'Reinforce tree operations',
      resources: 'Traversal, Recursion patterns',
      priority: '🟡 Medium'
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Skill Gap Alerts</h3>
          <p className="text-sm text-gray-500">Critical areas requiring immediate attention</p>
        </div>
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
      </div>

      {/* Alerts Count */}
      <div className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 mb-1">Critical Gaps Detected</div>
            <div className="text-3xl font-bold">{criticalGaps.length}</div>
            <div className="text-xs opacity-75 mt-1">Topics below 70%</div>
          </div>
          <div className="text-5xl">🚨</div>
        </div>
      </div>

      {/* Gaps List */}
      <div className="space-y-3 mb-6">
        {criticalGaps.map((gap, index) => (
          <div 
            key={index}
            className="border-2 border-red-200 bg-red-50 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800">{gap.topic}</div>
              <span className="text-xs font-bold text-red-600">{gap.mastery}%</span>
            </div>
            
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Current</span>
                  <span>Target</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${gap.mastery}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-bold text-gray-700">{gap.required}%</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-red-700 font-medium">
              Gap: {Math.abs(gap.gap)}% below target
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-2 mb-3">
          <span className="text-xl">💡</span>
          <div>
            <div className="font-semibold text-blue-900 mb-2">Recommended Actions</div>
            <div className="space-y-2">
              {suggestions.map((item, index) => (
                <div key={index} className="text-sm text-blue-800">
                  <div className="font-semibold">{item.topic} ({item.priority})</div>
                  <div className="text-xs opacity-75">→ {item.action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
