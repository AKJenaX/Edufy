import React from 'react';

export default function TopicMasteryHeatmap() {
  const topics = [
    { topic: 'Arrays', mastery: 0.92, attempts: 45, correct: 38, color: 'green' },
    { topic: 'LinkedList', mastery: 0.63, attempts: 38, correct: 24, color: 'yellow' },
    { topic: 'Trees', mastery: 0.48, attempts: 35, correct: 17, color: 'orange' },
    { topic: 'Graphs', mastery: 0.33, attempts: 28, correct: 9, color: 'red' },
    { topic: 'Dynamic Programming', mastery: 0.22, attempts: 25, correct: 6, color: 'red' },
    { topic: 'Sorting', mastery: 0.81, attempts: 42, correct: 34, color: 'green' },
    { topic: 'Searching', mastery: 0.76, attempts: 40, correct: 30, color: 'green' },
    { topic: 'Hashing', mastery: 0.58, attempts: 32, correct: 18, color: 'yellow' },
  ];

  const getBackgroundColor = (mastery) => {
    if (mastery >= 0.8) return 'bg-green-500';
    if (mastery >= 0.6) return 'bg-green-400';
    if (mastery >= 0.4) return 'bg-yellow-400';
    if (mastery >= 0.2) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getTextColor = (mastery) => {
    if (mastery >= 0.8) return 'text-green-800';
    if (mastery >= 0.6) return 'text-green-900';
    if (mastery >= 0.4) return 'text-yellow-900';
    if (mastery >= 0.2) return 'text-orange-900';
    return 'text-red-900';
  };

  const getBorderColor = (mastery) => {
    if (mastery >= 0.8) return 'border-green-500';
    if (mastery >= 0.6) return 'border-green-400';
    if (mastery >= 0.4) return 'border-yellow-400';
    if (mastery >= 0.2) return 'border-orange-400';
    return 'border-red-400';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Topic Mastery Heatmap</h3>
          <p className="text-sm text-gray-500">Identify areas needing attention</p>
        </div>
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔥</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex items-center justify-center space-x-4 bg-gray-50 rounded-xl p-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Strong (80%+)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-xs text-gray-600">Moderate (60-80%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <span className="text-xs text-gray-600">Weak (40-60%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span className="text-xs text-gray-600">Critical (&lt;40%)</span>
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {topics.map((topic) => (
          <div 
            key={topic.topic}
            className={`${getBackgroundColor(topic.mastery)} rounded-xl p-4 hover:scale-105 transition transform cursor-pointer border-2 ${getBorderColor(topic.mastery)} shadow-md`}
          >
            <div className={`font-bold ${getTextColor(topic.mastery)} mb-1`}>
              {Math.round(topic.mastery * 100)}%
            </div>
            <div className={`text-xs font-semibold ${getTextColor(topic.mastery)} mb-2`}>
              {topic.topic}
            </div>
            <div className={`text-xs ${getTextColor(topic.mastery)} opacity-80`}>
              {topic.correct}/{topic.attempts} correct
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <div className="text-xs text-green-600 font-medium mb-1">Strong Topics</div>
          <div className="text-xl font-bold text-green-700">3</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
          <div className="text-xs text-yellow-600 font-medium mb-1">Need Practice</div>
          <div className="text-xl font-bold text-yellow-700">3</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <div className="text-xs text-red-600 font-medium mb-1">Critical</div>
          <div className="text-xl font-bold text-red-700">2</div>
        </div>
      </div>
    </div>
  );
}
