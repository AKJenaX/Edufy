import React from 'react';

export default function StudySuggestions() {
  const suggestions = [
    { 
      id: 1, 
      title: "Micro-lesson: Dynamic Programming", 
      duration: "20 min",
      reason: "Low mastery in DP topic",
      priority: 'high',
      icon: '🎯'
    },
    { 
      id: 2, 
      title: "Practice Set: Trees", 
      duration: "5 problems",
      reason: "Reinforce traversal patterns",
      priority: 'medium',
      icon: '📚'
    },
    { 
      id: 3, 
      title: "Peer Session: Graph Intuition", 
      duration: "30 min",
      reason: "Discuss tricky examples",
      priority: 'low',
      icon: '👥'
    },
    { 
      id: 4, 
      title: "Review: Sorting Algorithms", 
      duration: "15 min",
      reason: "Maintain strong topics",
      priority: 'low',
      icon: '✨'
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'high': return '🔴 High';
      case 'medium': return '🟡 Medium';
      case 'low': return '🟢 Low';
      default: return priority;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Personalized Study Suggestions</h3>
          <p className="text-sm text-gray-500">AI-powered recommendations tailored for you</p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">📝</span>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div 
            key={suggestion.id}
            className={`border-2 ${getPriorityColor(suggestion.priority)} rounded-xl p-4 hover:shadow-md transition`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{suggestion.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{suggestion.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{suggestion.reason}</div>
                </div>
              </div>
              <span className="text-xs font-semibold">{getPriorityLabel(suggestion.priority)}</span>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Duration:</span> {suggestion.duration}
              </div>
              <button 
                onClick={() => alert('Starting session...')}
                className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition shadow-md"
              >
                Start Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-2">
          <span className="text-xl">💡</span>
          <div className="text-sm text-blue-800">
            <div className="font-semibold mb-1">Pro Tip</div>
            <div>Focus on high-priority suggestions first for maximum impact on your performance.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
