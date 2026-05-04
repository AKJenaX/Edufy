import React from 'react';

export default function Gamification() {
  const points = 158;
  const badges = [
    { id: 1, name: 'Consistency', icon: '🔥', color: 'bg-orange-100 text-orange-700' },
    { id: 2, name: 'Quiz Master', icon: '⭐', color: 'bg-yellow-100 text-yellow-700' },
    { id: 3, name: 'Problem Solver', icon: '🎯', color: 'bg-blue-100 text-blue-700' },
    { id: 4, name: 'Early Bird', icon: '🌅', color: 'bg-green-100 text-green-700' },
  ];

  const progressToNext = 72;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-3">
            <span className="text-xs font-bold text-orange-600">🏆 Rewards</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2 gradient-text-secondary">Achievements & Gamification</h3>
          <p className="text-base text-gray-600">Your rewards and progress</p>
        </div>
        <div className="icon-container w-16 h-16 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">🏆</span>
        </div>
      </div>

      {/* Points Display */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-3xl p-8 mb-8 shadow-2xl hover-scale glow-primary">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-yellow-50 font-bold mb-2 tracking-wide">Total Points</div>
            <div className="text-6xl font-black text-white mb-2">{points}</div>
            <div className="text-xs text-yellow-100 opacity-90">Keep up the great work! 👏</div>
          </div>
          <div className="text-7xl animate-pulse hover:animate-none">⭐</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h4 className="text-base font-bold text-gray-700 mb-4">Unlocked Badges</h4>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className={`${badge.color} p-5 rounded-2xl text-center hover-scale shadow-lg border-2 border-white hover:shadow-xl transition-all`}>
              <div className="text-4xl mb-3 hover:scale-110 transition-transform">{badge.icon}</div>
              <div className="text-sm font-bold">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-700">Progress to Next Level</div>
          <div className="text-base font-black text-gray-800">{progressToNext}%</div>
        </div>
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className="progress-gradient h-4 rounded-full"
            style={{ width: `${progressToNext}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600 mt-3 text-center font-medium">
          {100 - progressToNext}% more to unlock the "Expert" badge 🎯
        </div>
      </div>

      {/* Streak */}
      <div className="mt-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-2xl hover-scale">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-blue-50 mb-1 opacity-90">Study Streak</div>
            <div className="text-3xl font-black mt-2">7 days 🔥</div>
          </div>
          <div className="text-5xl animate-pulse hover:animate-none">💪</div>
        </div>
      </div>
    </div>
  );
}
