import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📊',
      title: 'Performance Trends',
      description: 'Track your academic progress over time with detailed trend analysis.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: '📈',
      title: 'Subject Analytics',
      description: 'Deep dive into each subject with comprehensive performance metrics.',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100'
    },
    {
      icon: '🏆',
      title: 'Achievement Tracking',
      description: 'Monitor your achievements and celebrate academic milestones.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      icon: '👥',
      title: 'Class Comparison',
      description: 'Compare your performance with class averages and peers.',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      icon: '📖',
      title: 'Weak Area Detection',
      description: 'Identify topics that need more attention with heatmap analysis.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100'
    },
    {
      icon: '🎓',
      title: 'Predictive Insights',
      description: 'AI-powered predictions to help you prepare for future exams.',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              <span className="text-white text-xl font-black">SLA</span>
            </div>
            <div>
              <span className="text-2xl font-black text-gray-800">Smart Learning Analytics</span>
              <div className="text-xs text-gray-500 font-medium">Student Performance Platform</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full shadow-sm">
              <span className="text-sm font-bold text-blue-600">✨ AI-Powered Analytics</span>
            </div>
            <h1 className="text-6xl font-black text-gray-900 leading-tight">
              Track Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Academic Performance
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Visualize your progress, identify strengths, and improve weak areas with our advanced analytics dashboard.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Get Started Free →
              </button>
              <button className="px-10 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all">
                Learn More
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-4xl font-black text-gray-900 mb-2">10k+</div>
                <div className="text-sm text-gray-600 font-semibold">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-gray-900 mb-2">95%</div>
                <div className="text-sm text-gray-600 font-semibold">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-gray-900 mb-2">4.9★</div>
                <div className="text-sm text-gray-600 font-semibold">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:block">
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
              <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-16">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-8 mb-8">
                    <div className="text-7xl hover:scale-110 transition-transform animate-pulse hover:animate-none" style={{ animationDuration: '2s' }}>👨‍💻</div>
                    <div className="text-7xl hover:scale-110 transition-transform animate-pulse hover:animate-none" style={{ animationDuration: '2.5s' }}>👩‍💻</div>
                  </div>
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-7xl hover:scale-110 transition-transform animate-pulse hover:animate-none" style={{ animationDuration: '3s' }}>👨‍🎓</div>
                    <div className="text-7xl hover:scale-110 transition-transform animate-pulse hover:animate-none" style={{ animationDuration: '3.5s' }}>👩‍🎓</div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <span className="text-3xl">📊</span>
                </div>
                <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="absolute bottom-4 right-4 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <span className="text-3xl">🎓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6 shadow-sm">
            <span className="text-sm font-bold text-blue-600">FEATURES</span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive analytics and insights to help you achieve academic excellence.
          </p>
        </div>

        {/* Feature Cards Grid with Raised Button Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white text-3xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <span>{feature.icon}</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                <span className="text-sm">Learn more →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white text-xl font-black">SLA</span>
            </div>
            <span className="text-2xl font-black">Smart Learning Analytics</span>
          </div>
          <p className="text-gray-400 mb-8">
            © 2025 Smart Learning Analytics. Empowering students with data-driven insights.
          </p>
        </div>
      </footer>
    </div>
  );
}
