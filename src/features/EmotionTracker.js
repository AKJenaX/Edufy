import React, { useState } from 'react';

export default function EmotionTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  
  const moodHistory = [
    { mood: "Motivated", emoji: "💪", score: 0.78, date: "Today", count: 5 },
    { mood: "Neutral", emoji: "😐", score: 0.42, date: "Yesterday", count: 3 },
    { mood: "Stressed", emoji: "😟", score: 0.22, date: "2 days ago", count: 2 },
    { mood: "Confident", emoji: "😊", score: 0.65, date: "3 days ago", count: 4 },
    { mood: "Tired", emoji: "😴", score: 0.15, date: "4 days ago", count: 1 },
  ];

  const currentMood = moodHistory[0];

  const handleMoodSelect = () => {
    const moods = ['😊', '😐', '😟', '💪', '😴', '🤔'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    alert(`Selected mood: ${randomMood}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Emotional / Motivation Tracker</h3>
          <p className="text-sm text-gray-500">Track your emotional state</p>
        </div>
        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">😊</span>
        </div>
      </div>

      {/* Current Mood */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="text-center">
            <div className="text-6xl mb-3">{currentMood.emoji}</div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{currentMood.mood}</div>
            <div className="text-sm text-gray-600">{currentMood.date}</div>
          </div>
          
          <div className="mt-4 bg-white rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Motivation Level</span>
              <span className="text-xs font-bold text-blue-600">{Math.round(currentMood.score * 100)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                style={{ width: `${currentMood.score * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Input */}
      <div className="mb-6">
        <button
          onClick={handleMoodSelect}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
        >
          Update Your Mood Today
        </button>
      </div>

      {/* Mood History */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Moods</h4>
        <div className="space-y-2">
          {moodHistory.slice(1, 4).map((mood, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:shadow-md transition">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{mood.emoji}</div>
                <div>
                  <div className="font-medium text-gray-800">{mood.mood}</div>
                  <div className="text-xs text-gray-500">{mood.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-700">{Math.round(mood.score * 100)}%</div>
                <div className="text-xs text-gray-500">{mood.count}x</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
        <div className="flex items-start space-x-2">
          <span className="text-lg">💡</span>
          <div className="text-xs text-green-800">
            <div className="font-semibold mb-1">Wellness Tip</div>
            <div>Short breaks and micro-practice can improve mood & retention by up to 40%.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
