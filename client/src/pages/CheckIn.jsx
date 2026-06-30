import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

import { useAuth } from '../context/AuthContext';
import { Bed, BookOpen, Monitor, FolderKanban, Code2, Flame, Award, ArrowLeft } from 'lucide-react';

const CheckIn = () => {
  const { updateUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const [metrics, setMetrics] = useState({
    sleepHours: 7,
    studyHours: 4,
    screenTime: 6,
    assignments: 0,
    dsaSolved: 0
  });

  const handleSliderChange = (name, value) => {
    setMetrics({
      ...metrics,
      [name]: Number(value)
    });
  };

  // Helper labels for inputs
  const getSleepLabel = (val) => {
    if (val < 5) return 'Sleep deprivation masterclass 💀';
    if (val < 7) return 'Slightly toasted 🥱';
    if (val <= 8) return 'Healthy human 🟢';
    return 'Hibernate mode activated 💤';
  };

  const getStudyLabel = (val) => {
    if (val === 0) return 'Academic casualty ☠️';
    if (val < 3) return 'Casual scroller 📖';
    if (val < 6) return 'Productive student 💻';
    return 'Hustle god mode 🚀';
  };

  const getScreenLabel = (val) => {
    if (val <= 4) return 'Grass toucher 🌳';
    if (val <= 7) return 'Average scroller 📱';
    if (val <= 10) return 'Dopamine zombie 🧟';
    return 'Cataracts speedrun 🕶️';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/checkin', metrics);

      if (res.data.success) {
        const { streak, newBadges } = res.data.data;
        
        // Update user context data locally (e.g. streaks, achievements)
        if (newBadges && newBadges.length > 0) {
          const storedUser = JSON.parse(localStorage.getItem('cooked_user'));
          const updatedAchievements = [...(storedUser.achievements || []), ...newBadges];
          updateUserData({ streak, achievements: updatedAchievements });
        } else {
          updateUserData({ streak });
        }

        setSuccessData(res.data.data);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit check-in');
      setLoading(false);
    }
  };

  if (successData) {
    const { checkIn, newBadges } = successData;
    return (
      <div className="min-h-[80vh] flex items-center justify-center relative z-10 px-4">
        <div className="max-w-md w-full glass-panel border border-white/5 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Confetti glow bubble */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500" />
          
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>

          <h2 className="text-2xl font-bold text-slate-100 mb-2">Check-In Successful!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Calculated score: <span className="text-orange-400 font-extrabold">{checkIn.cookedScore}</span>. Your archetype is <span className="text-purple-300 font-semibold">{checkIn.archetype}</span>.
          </p>

          {newBadges && newBadges.length > 0 && (
            <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-4 mb-6 text-left">
              <h3 className="flex items-center space-x-2 text-purple-300 font-semibold text-sm mb-2">
                <Award size={16} />
                <span>New Badge Unlocked!</span>
              </h3>
              {newBadges.map((badge, idx) => (
                <div key={idx} className="text-xs text-slate-300">
                  <span className="font-bold text-purple-200">{badge.title}</span>: {badge.description}
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-500 animate-pulse">Redirecting you to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto relative z-10 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 text-sm mb-6 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      {/* Form Container */}
      <div className="glass-panel border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop bubble */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Daily Check-In 🍳</h1>
          <p className="text-slate-400 text-sm">
            Enter your metrics honestly. The scoring algorithm doesn't lie.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Sleep Hours */}
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center space-x-3 text-slate-200 font-medium">
                <Bed className="text-sky-400" size={20} />
                <span>Sleep Hours</span>
              </label>
              <span className="text-lg font-bold text-sky-400">{metrics.sleepHours} hrs</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={metrics.sleepHours}
              onChange={(e) => handleSliderChange('sleepHours', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
            />
            <p className="text-slate-400 text-xs mt-2 italic">{getSleepLabel(metrics.sleepHours)}</p>
          </div>

          {/* 2. Study Hours */}
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center space-x-3 text-slate-200 font-medium">
                <BookOpen className="text-emerald-400" size={20} />
                <span>Study Hours</span>
              </label>
              <span className="text-lg font-bold text-emerald-400">{metrics.studyHours} hrs</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={metrics.studyHours}
              onChange={(e) => handleSliderChange('studyHours', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
            />
            <p className="text-slate-400 text-xs mt-2 italic">{getStudyLabel(metrics.studyHours)}</p>
          </div>

          {/* 3. Screen Time */}
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center space-x-3 text-slate-200 font-medium">
                <Monitor className="text-violet-400" size={20} />
                <span>Screen Time</span>
              </label>
              <span className="text-lg font-bold text-violet-400">{metrics.screenTime} hrs</span>
            </div>
            <input
              type="range"
              min="0"
              max="18"
              step="0.5"
              value={metrics.screenTime}
              onChange={(e) => handleSliderChange('screenTime', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400 focus:outline-none"
            />
            <p className="text-slate-400 text-xs mt-2 italic">{getScreenLabel(metrics.screenTime)}</p>
          </div>

          {/* 4. Assignments & DSA in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignments */}
            <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5">
              <label className="flex items-center space-x-3 text-slate-200 font-medium mb-3">
                <FolderKanban className="text-amber-400" size={20} />
                <span>Pending Assignments</span>
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleSliderChange('assignments', Math.max(0, metrics.assignments - 1))}
                  className="w-10 h-10 bg-slate-800 border border-white/5 rounded-lg flex items-center justify-center font-bold hover:bg-slate-700 transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-bold text-slate-100 w-8 text-center">{metrics.assignments}</span>
                <button
                  type="button"
                  onClick={() => handleSliderChange('assignments', metrics.assignments + 1)}
                  className="w-10 h-10 bg-slate-800 border border-white/5 rounded-lg flex items-center justify-center font-bold hover:bg-slate-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* DSA Questions */}
            <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5">
              <label className="flex items-center space-x-3 text-slate-200 font-medium mb-3">
                <Code2 className="text-rose-400" size={20} />
                <span>DSA Solved Today</span>
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleSliderChange('dsaSolved', Math.max(0, metrics.dsaSolved - 1))}
                  className="w-10 h-10 bg-slate-800 border border-white/5 rounded-lg flex items-center justify-center font-bold hover:bg-slate-700 transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-bold text-slate-100 w-8 text-center">{metrics.dsaSolved}</span>
                <button
                  type="button"
                  onClick={() => handleSliderChange('dsaSolved', metrics.dsaSolved + 1)}
                  className="w-10 h-10 bg-slate-800 border border-white/5 rounded-lg flex items-center justify-center font-bold hover:bg-slate-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-orange-950/20"
          >
            {loading ? 'Analyzing your kitchen logs...' : 'Calculate My Cooked Score'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckIn;
