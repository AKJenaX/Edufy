import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiBookOpen, FiUsers, FiUser } from 'react-icons/fi';
import { FaGraduationCap, FaBrain, FaGoogle } from 'react-icons/fa';
import { MdAutoAwesome } from 'react-icons/md';
import { BsShieldCheck } from 'react-icons/bs';

function Register() {
  const [role, setRole] = useState('Student'); // Student, Faculty, Admin
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(false);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const userData = {
      email,
      password,
      full_name: fullName,
      role: role.toLowerCase(),
      student_id: role === 'Student' && studentId ? studentId : undefined,
      faculty_id: role === 'Faculty' && facultyId ? facultyId : undefined,
    };

    const result = await register(userData);

    if (result.success) {
      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a1128] overflow-hidden flex-col justify-between p-12">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#102046] to-[#0ea5e9]/30 opacity-80" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-24">
            <div className="bg-white p-1 rounded-xl flex items-center justify-center h-12 w-12 shadow-md">
              <img src="/logo.png" alt="Edufy Logo" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Edufy</h1>
              <p className="text-xs text-blue-200">AI Campus Platform</p>
            </div>
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-200 text-xs font-medium mb-6 backdrop-blur-sm">
              <MdAutoAwesome className="text-[#0ea5e9]" />
              <span>Next-gen learning, powered by AI</span>
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Create your <br/>
              <span className="text-[#00e5ff]">Edufy account.</span>
            </h2>
            
            <p className="text-blue-100/80 text-lg mb-12 leading-relaxed">
              Join the unified platform that empowers students, faculty, and administrators with intelligent analysis and productivity tools.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:bg-white/10 transition-colors">
                <FaBrain className="text-[#00e5ff] text-xl mb-3" />
                <h3 className="text-sm font-semibold text-white">AI Tutor</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:bg-white/10 transition-colors">
                <FiBookOpen className="text-[#00e5ff] text-xl mb-3" />
                <h3 className="text-sm font-semibold text-white">Smart LMS</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:bg-white/10 transition-colors">
                <FiShield className="text-[#00e5ff] text-xl mb-3" />
                <h3 className="text-sm font-semibold text-white">Secure</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-200/50">
          © 2026 Edufy Education Technologies
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
            <BsShieldCheck />
            <span>End-to-End Encrypted</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
          <div className="w-full max-w-md my-8">
            <div className="mb-8 text-center lg:text-left">
              <img src="/logo.png" alt="Edufy Logo" className="h-16 w-auto mb-6 mx-auto lg:mx-0 object-contain" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Request access</h2>
              <p className="text-gray-500">Create your institutional account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {successMsg}
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">I AM A</label>
                <div className="flex p-1 bg-gray-100/80 rounded-xl gap-1">
                  {['Student', 'Faculty', 'Admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        role === r 
                          ? 'bg-[#1a237e] text-white shadow-md' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                      }`}
                    >
                      {r === 'Student' && <FiBookOpen className={role === r ? "text-blue-200" : ""} />}
                      {r === 'Faculty' && <FiUsers className={role === r ? "text-blue-200" : ""} />}
                      {r === 'Admin' && <BsShieldCheck className={role === r ? "text-blue-200" : ""} />}
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-transparent outline-none transition-all text-sm text-gray-900 bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-transparent outline-none transition-all text-sm text-gray-900 bg-white"
                    placeholder="you@edufy.edu"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-transparent outline-none transition-all text-sm text-gray-900 bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Conditional IDs */}
              {role === 'Student' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Student ID (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBookOpen className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-transparent outline-none transition-all text-sm text-gray-900 bg-white"
                      placeholder="e.g. STU123"
                    />
                  </div>
                </div>
              )}

              {role === 'Faculty' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Faculty ID (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUsers className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-transparent outline-none transition-all text-sm text-gray-900 bg-white"
                      placeholder="e.g. FAC123"
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#1a237e] to-[#0ea5e9] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/20 disabled:opacity-70"
              >
                {loading ? 'Creating Account...' : `Register as ${role}`}
                {!loading && <FiArrowRight />}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <span 
                onClick={() => navigate('/login')} 
                className="font-semibold text-[#1a237e] hover:underline cursor-pointer"
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
