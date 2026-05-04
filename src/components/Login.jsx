import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    usn: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.usn && formData.password) {
      onLogin(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-400 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden card-advanced backdrop-blur-sm" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div className="grid lg:grid-cols-2 min-h-[700px]">
          {/* Left Sidebar - Dark with Glassmorphism */}
          <div className="hidden lg:flex glass-dark flex-col justify-between p-12 relative overflow-hidden">
            {/* Decorative Gradient Orbs */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-white mb-12">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 icon-container">
                    <span className="text-2xl font-bold">SLA</span>
                  </div>
                  <div>
                    <div className="text-4xl font-black mb-1">Smart Learning</div>
                    <div className="text-2xl font-semibold text-gray-300">Analytics</div>
                  </div>
                </div>
                <div className="text-gray-300 text-base leading-relaxed">
                  Track Your Academic Performance with Advanced Analytics
                </div>
              </div>

              <div className="space-y-6 mt-16">
                {[
                  { icon: '📊', title: 'Performance Trends', desc: 'Detailed analytics' },
                  { icon: '🎯', title: 'Achievement Tracking', desc: 'Gamification layer' },
                  { icon: '📚', title: 'Personalized Plans', desc: 'AI suggestions' },
                  { icon: '👥', title: 'Peer Comparison', desc: 'Class insights' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center text-gray-300 hover:text-white transition-colors group cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-base">{feature.title}</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Icons */}
            <div className="relative z-10 flex items-center space-x-4 text-gray-500">
              <div className="w-12 h-12 border border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-800 hover:border-gray-600 transition glass-dark">
                💬
              </div>
              <div className="w-12 h-12 border border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-800 hover:border-gray-600 transition glass-dark">
                !
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-12 flex flex-col justify-center relative bg-white">
            {/* Tabs with Advanced Styling */}
            <div className="flex mb-10 border-b-2 border-gray-100">
              <button
                onClick={() => setActiveTab('login')}
                className={`px-8 py-4 font-bold text-lg transition-all relative ${
                  activeTab === 'login'
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {activeTab === 'login' && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full"></span>
                )}
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`px-8 py-4 font-bold text-lg transition-all relative ${
                  activeTab === 'register'
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {activeTab === 'register' && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full"></span>
                )}
                Register
              </button>
            </div>

            {/* Welcome Text */}
            <div className="mb-10">
              <h1 className="text-4xl font-black text-gray-900 mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-base leading-relaxed">
                {activeTab === 'login' 
                  ? 'Sign in to access your performance dashboard.'
                  : 'Create an account to start tracking your academic journey.'
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  USN (University Seat Number)
                </label>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                  placeholder="Enter your USN"
                  className="input-modern w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-modern w-full"
                  required
                />
              </div>

              {activeTab === 'login' && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" className="mr-2 w-4 h-4 cursor-pointer" />
                    <span className="text-gray-600 group-hover:text-gray-900">Remember me</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="btn-gradient-primary w-full text-white py-4 rounded-xl font-bold text-lg glow-hover relative overflow-hidden"
              >
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {activeTab === 'register' && (
              <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
