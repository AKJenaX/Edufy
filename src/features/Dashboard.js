import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaChartLine, FaTrophy, FaComments, FaLightbulb, FaUsers, FaHeart, FaFire, FaBalanceScale, FaExclamationTriangle, FaMagic } from 'react-icons/fa';
import PerformanceAnalysis from './PerformanceAnalysis';
import SentimentFeedback from './SentimentFeedback';
import Gamification from './Gamification';
import StudySuggestions from './StudySuggestions';
import PeerAnalysis from './PeerAnalysis';
import EmotionTracker from './EmotionTracker';
import TopicMasteryHeatmap from './TopicMasteryHeatmap';
import EffortVsOutcome from './EffortVsOutcome';
import SkillGapAlert from './SkillGapAlert';
import PredictiveAnalysis from './PredictiveAnalysis';

export default function Dashboard({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaChartLine, color: 'text-blue-500' },
    { id: 'performance', label: 'Performance', icon: FaChartLine, color: 'text-indigo-500' },
    { id: 'achievements', label: 'Achievements', icon: FaTrophy, color: 'text-yellow-500' },
    { id: 'feedback', label: 'Feedback', icon: FaComments, color: 'text-purple-500' },
    { id: 'suggestions', label: 'Suggestions', icon: FaLightbulb, color: 'text-green-500' },
    { id: 'peers', label: 'Peer Analysis', icon: FaUsers, color: 'text-pink-500' },
    { id: 'emotion', label: 'Emotion Tracker', icon: FaHeart, color: 'text-red-500' },
    { id: 'heatmap', label: 'Topic Heatmap', icon: FaFire, color: 'text-orange-500' },
    { id: 'effort', label: 'Effort Analysis', icon: FaBalanceScale, color: 'text-cyan-500' },
    { id: 'alerts', label: 'Skill Gaps', icon: FaExclamationTriangle, color: 'text-amber-500' },
    { id: 'predictive', label: 'Predictions', icon: FaMagic, color: 'text-violet-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex-shrink-0 overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-black">SLA</span>
            </div>
            <div>
              <div className="text-white font-black text-sm">Smart Learning</div>
              <div className="text-gray-400 text-xs">Analytics</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm truncate">{currentUser?.usn || 'Student'}</div>
              <div className="text-gray-400 text-xs">Active</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 px-3">Dashboard</div>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-white shadow-lg text-gray-900'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`${isActive ? item.color : 'text-gray-400'} text-lg`} />
                  <span className={`font-medium text-sm ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <FaSignOutAlt />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, {currentUser?.usn || 'Student'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm">
                📊 Live Tracking
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Analysis - Large */}
            <div className="lg:col-span-2">
              <PerformanceAnalysis />
            </div>
            
            {/* Gamification */}
            <div>
              <Gamification />
            </div>

            {/* Effort vs Outcome */}
            <div className="lg:col-span-2">
              <EffortVsOutcome />
            </div>

            {/* Sentiment Feedback */}
            <div>
              <SentimentFeedback />
            </div>

            {/* Study Suggestions */}
            <div className="lg:col-span-2">
              <StudySuggestions />
            </div>

            {/* Emotion Tracker */}
            <div>
              <EmotionTracker />
            </div>

            {/* Topic Mastery */}
            <div className="lg:col-span-2">
              <TopicMasteryHeatmap />
            </div>

            {/* Peer Analysis */}
            <div>
              <PeerAnalysis />
            </div>

            {/* Predictive Analysis */}
            <div className="lg:col-span-2">
              <PredictiveAnalysis />
            </div>

            {/* Skill Gap Alerts */}
            <div>
              <SkillGapAlert />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="button-pad">
      {children}
    </div>
  );
}
