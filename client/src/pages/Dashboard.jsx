import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

import { useAuth } from '../context/AuthContext';
import { 
  Flame, Award, AlertCircle, RefreshCw, ClipboardList, CheckCircle2,
  Calendar, Bed, BookOpen, Monitor, Compass
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, Legend, LineChart, Line, CartesianGrid
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Local state for checking off recovery suggestions
  const [checkedSuggestions, setCheckedSuggestions] = useState({});

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/dashboard/stats');

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleSuggestion = (index) => {
    setCheckedSuggestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="animate-spin text-orange-500" size={32} />
          <p className="text-slate-400 text-sm">Opening the kitchen doors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full glass-panel border border-red-500/20 rounded-2xl p-6 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={32} />
          <h3 className="text-lg font-bold text-slate-100 mb-2">Error Loading Dashboard</h3>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-slate-800 border border-white/5 rounded-xl hover:bg-slate-700 text-slate-200 text-sm transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { latestCheckIn, roast, suggestions, consistencyScore, weeklyTrends } = data || {};
  const currentScore = latestCheckIn ? latestCheckIn.cookedScore : null;

  // Determine label & color class based on score
  const getScoreClassification = (score) => {
    if (score === null || score === undefined) return { label: 'Uncooked 🧊', colorClass: 'text-sky-400 border-sky-400/20 bg-sky-500/5', glowClass: 'glow-text-safe' };
    if (score <= 20) return { label: 'Functional Human 🟢', colorClass: 'text-emerald-400 border-emerald-400/20 bg-emerald-500/5', glowClass: 'glow-text-safe' };
    if (score <= 40) return { label: 'Slightly Toasted 🟡', colorClass: 'text-amber-400 border-amber-400/20 bg-amber-500/5', glowClass: 'glow-text-warning' };
    if (score <= 60) return { label: 'Medium Rare 🟠', colorClass: 'text-orange-400 border-orange-400/20 bg-orange-500/5', glowClass: 'glow-text-warning' };
    if (score <= 80) return { label: 'Deep Fried 🔴', colorClass: 'text-red-400 border-red-400/20 bg-red-500/5', glowClass: 'glow-text-cooked' };
    return { label: 'Academic Casualty ☠️', colorClass: 'text-rose-500 border-rose-500/20 bg-rose-500/5', glowClass: 'glow-text-cooked' };
  };

  const scoreInfo = getScoreClassification(currentScore);

  // Badge configuration mappings
  const allBadges = [
    { code: 'NIGHT_OWL', title: 'Night Owl 🦉', desc: 'Sleep under 4 hours.' },
    { code: 'ASSIGNMENT_SLAYER', title: 'Assignment Slayer ⚔️', desc: 'Zero pending assignments.' },
    { code: 'DSA_WARRIOR', title: 'DSA Warrior 🛡️', desc: 'Solve DSA questions 7 consecutive days.' },
    { code: 'TOUCH_GRASS', title: 'Touch Grass Champion 🌳', desc: 'Screen time under 4 hours for 7 days.' }
  ];

  const userBadgeCodes = user?.achievements?.map(a => a.badge) || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Hey, {user?.name || 'Chef'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            College of <span className="text-slate-300 font-medium">{user?.collegeName}</span> • {user?.branch} (Year {user?.yearOfStudy})
          </p>
        </div>

        {!latestCheckIn && (
          <Link
            to="/checkin"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-950/20 transition-all text-sm animate-bounce"
          >
            <ClipboardList size={18} />
            <span>Complete Today's Check-In</span>
          </Link>
        )}
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Current Cooked Score
              </h2>
              <p className={`text-sm font-bold mt-1 px-3 py-1 rounded-full border inline-block ${scoreInfo.colorClass}`}>
                {scoreInfo.label}
              </p>
            </div>
            {latestCheckIn && (
              <span className="text-xs text-slate-500 flex items-center space-x-1">
                <Calendar size={12} />
                <span>Today</span>
              </span>
            )}
          </div>

          <div className="my-4">
            {currentScore !== null ? (
              <div className="flex items-baseline space-x-2">
                <span className={`text-6xl font-black ${scoreInfo.glowClass} bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent`}>
                  {currentScore}
                </span>
                <span className="text-slate-500 font-bold text-xl">/ 100</span>
              </div>
            ) : (
              <p className="text-slate-400 text-sm py-4 italic">No check-in recorded for today.</p>
            )}
          </div>

          <div className="text-xs text-slate-500 border-t border-white/5 pt-3">
            {latestCheckIn ? (
              <span>Archetype: <strong className="text-purple-400 font-bold">{latestCheckIn.archetype}</strong></span>
            ) : (
              <Link to="/checkin" className="text-orange-400 hover:underline font-semibold">
                Submit logs to calculate archetype →
              </Link>
            )}
          </div>
        </div>

        {/* Dynamic Roast Box */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between md:col-span-2 min-h-[220px]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Flame size={16} className="text-red-500" />
              <span>Daily Roast</span>
            </div>
            
            <p className="text-lg font-semibold text-slate-200 leading-relaxed italic pr-4">
              "{roast}"
            </p>
          </div>

          <div className="text-xs text-slate-500 border-t border-white/5 pt-3 flex justify-between items-center mt-4">
            <span>Roast generated dynamically on dashboard load</span>
            {latestCheckIn && (
              <button 
                onClick={fetchDashboardData}
                className="text-orange-400 hover:text-orange-300 flex items-center space-x-1"
              >
                <RefreshCw size={12} />
                <span>Reroll Roast</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Streak, Habits & Suggestions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak & Consistency Scores */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          {/* Consistency Circle */}
          <div>
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
              7-Day Consistency
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-white/5 bg-slate-900/50">
                <span className="text-2xl font-black text-emerald-400">{consistencyScore}%</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Habit Integrity</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Based on check-in frequency and meeting health thresholds (Sleep &ge; 7h, Study &ge; 2h, Screen &le; 7h) in the last 7 days.
                </p>
              </div>
            </div>
          </div>

          {/* Active Streak */}
          <div className="border-t border-white/5 pt-4">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Habit Streak
            </h3>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <Flame className="text-orange-500 flame-animation fill-orange-500" size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-100">{user?.streak?.count || 0} Days</p>
                <p className="text-xs text-slate-400">Consecutive check-ins logged</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Checklist */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Recovery Suggestions
              </h3>
              {latestCheckIn && (
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                  {Object.values(checkedSuggestions).filter(Boolean).length} / {suggestions.length} Completed
                </span>
              )}
            </div>

            <div className="space-y-3">
              {suggestions.map((suggestion, index) => {
                const isChecked = checkedSuggestions[index];
                return (
                  <div
                    key={index}
                    onClick={() => toggleSuggestion(index)}
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-400 line-through decoration-slate-600'
                        : 'bg-slate-900/40 border-white/5 text-slate-200 hover:border-white/10'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border border-white/20 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{suggestion}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-slate-500 mt-4 border-t border-white/5 pt-3 italic">
            Check off suggestions as you complete them to clear your baked meter!
          </div>
        </div>
      </div>

      {/* Analytics Trend Graphs */}
      {weeklyTrends && weeklyTrends.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cooked Score Trend Line */}
          <div className="glass-panel border border-white/5 rounded-2xl p-6">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Weekly Cooked Score Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-secondary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cookedScore" 
                    stroke="#f97316" 
                    strokeWidth={3} 
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sleep & Study Combo Graph */}
          <div className="glass-panel border border-white/5 rounded-2xl p-6">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Habits Core: Sleep & Study Hours
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-secondary)' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" name="Sleep Hours" dataKey="sleepHours" stroke="#38bdf8" fillOpacity={1} fill="url(#colorSleep)" strokeWidth={2} />
                  <Area type="monotone" name="Study Hours" dataKey="studyHours" stroke="#34d399" fillOpacity={1} fill="url(#colorStudy)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel border border-white/5 rounded-2xl p-8 text-center">
          <Calendar className="mx-auto text-slate-500 mb-3" size={28} />
          <h4 className="text-slate-300 font-bold mb-1">No Analytics Logs</h4>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Check-ins over multiple days will populate interactive graphs tracing your study cycles and sleep trends here.
          </p>
        </div>
      )}

      {/* Badge Achievements System */}
      <div>
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Award size={16} className="text-purple-400" />
          <span>Unlocked Badges</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allBadges.map((badgeOption) => {
            const isUnlocked = userBadgeCodes.includes(badgeOption.code);
            return (
              <div
                key={badgeOption.code}
                className={`glass-panel border rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
                  isUnlocked
                    ? 'border-purple-500/30 bg-purple-500/5 shadow-md shadow-purple-950/20'
                    : 'border-white/5 opacity-40 hover:opacity-50'
                }`}
              >
                {/* Glow backdrop bubble */}
                {isUnlocked && (
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                )}

                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl border text-xl flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-purple-500/10 border-purple-500/20'
                      : 'bg-slate-900 border-white/5 text-slate-600'
                  }`}>
                    {badgeOption.code === 'NIGHT_OWL' && '🦉'}
                    {badgeOption.code === 'ASSIGNMENT_SLAYER' && '⚔️'}
                    {badgeOption.code === 'DSA_WARRIOR' && '🛡️'}
                    {badgeOption.code === 'TOUCH_GRASS' && '🌳'}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isUnlocked ? 'text-purple-200' : 'text-slate-400'}`}>
                      {badgeOption.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {badgeOption.desc}
                    </p>
                    {isUnlocked && (
                      <span className="inline-block px-2 py-0.5 bg-purple-500/15 border border-purple-500/30 text-[10px] text-purple-300 rounded font-semibold mt-2">
                        Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
