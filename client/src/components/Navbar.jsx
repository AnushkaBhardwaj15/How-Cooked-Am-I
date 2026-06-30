import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Flame, ClipboardList, BarChart3, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const streakCount = user?.streak?.count || 0;

  return (
    <nav className="glass-panel border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
                How Cooked Am I?
              </span>
              <span className="text-xl">🔥</span>
            </Link>
          </div>

          {/* Center Info & Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6 text-sm text-slate-400">
              <div>
                <span className="text-slate-500">College:</span>{' '}
                <span className="text-slate-300 font-medium">{user.collegeName}</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div>
                <span className="text-slate-500">Branch:</span>{' '}
                <span className="text-slate-300 font-medium">{user.branch}</span>
              </div>
            </div>
          )}

          {/* Right Side actions */}
          <div className="flex items-center space-x-4">
            {/* Streak Counter */}
            {streakCount > 0 && (
              <div 
                className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full text-orange-400 font-bold text-sm select-none"
                title={`${streakCount} Day Check-in Streak`}
              >
                <Flame size={16} className="text-orange-500 flame-animation fill-orange-500" />
                <span>{streakCount} Day Streak</span>
              </div>
            )}

            {/* Check-In Button / Home Redirect */}
            {location.pathname === '/' ? (
              <Link
                to="/checkin"
                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg font-medium text-sm transition-all shadow-md shadow-red-950/20"
              >
                <ClipboardList size={16} />
                <span>Check In</span>
              </Link>
            ) : (
              <Link
                to="/"
                className="flex items-center space-x-1 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 rounded-lg font-medium text-sm transition-all"
              >
                <BarChart3 size={16} />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 border border-transparent hover:border-orange-500/20 rounded-lg transition-all"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
