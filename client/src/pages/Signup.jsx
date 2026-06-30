import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, KeyRound, School, Landmark, GraduationCap, AlertTriangle, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: '',
    branch: '',
    yearOfStudy: '1'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, collegeName, branch, yearOfStudy } = formData;

    if (!name || !email || !password || !collegeName || !branch || !yearOfStudy) {
      return setError('Please fill in all fields.');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    const result = await register(
      name,
      email,
      password,
      collegeName,
      branch,
      Number(yearOfStudy)
    );
    setLoading(false);

    if (result.success) {
      navigate('/setup');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent mb-2">
            How Cooked Am I? 🔥
          </h1>
          <p className="text-slate-400 text-sm">
            Sign up to track daily habits and academic burnout levels
          </p>
        </div>

        {/* Signup Form Panel */}
        <div className="glass-panel rounded-2xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Ambient light gradient bubbles */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-2xl font-bold text-slate-100 mb-6">Create Account</h2>

          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-sm mb-6">
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                    placeholder="Alex Mercer"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                    placeholder="alex@college.edu"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                  placeholder="•••••••• (Min 6 chars)"
                  required
                />
              </div>
            </div>

            {/* College Name */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                College Name
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                  placeholder="IIT Bombay / Stanford / DTU"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Branch / Major
                </label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>

              {/* Year of Study */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Year of Study
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/5 rounded-xl text-slate-100 focus:outline-none focus:border-orange-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="1">1st Year (Freshman)</option>
                    <option value="2">2nd Year (Sophomore)</option>
                    <option value="3">3rd Year (Junior)</option>
                    <option value="4">4th Year (Senior)</option>
                    <option value="5">Other / Higher Studies</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Signup Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-orange-950/20 mt-6 group"
            >
              <span>{loading ? 'Creating Profile...' : 'Begin Setup'}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          Already registered?{' '}
          <Link to="/login" className="text-orange-400 hover:underline font-semibold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
