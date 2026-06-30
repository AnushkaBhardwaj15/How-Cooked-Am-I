import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code, Trophy, ArrowRight, AlertTriangle } from 'lucide-react';

const ProfileSetup = () => {
  const { saveProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Available Areas and Goals
  const learningAreaOptions = [
    'Frontend',
    'Backend',
    'DSA',
    'AI/ML',
    'Cybersecurity',
    'DevOps',
    'Mobile Development'
  ];

  const goalOptions = [
    'Internship',
    'Placement',
    'Hackathon',
    'Open Source',
    'GSoC',
    'Higher Studies'
  ];

  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);

  // Toggle selection
  const toggleArea = (area) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedAreas.length === 0) {
      return setError('Please select at least one learning area.');
    }
    if (selectedGoals.length === 0) {
      return setError('Please select at least one current goal.');
    }

    setLoading(true);
    const result = await saveProfile(selectedAreas, selectedGoals);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative z-10 py-8">
      <div className="w-full max-w-xl glass-panel border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop bubble */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-slate-100 mb-2">
            Configure Your Kitchen 🍳
          </h2>
          <p className="text-slate-400 text-sm">
            Let us know what you are studying and chasing so we can roast your lack of progress accurately.
          </p>
        </div>

        {error && (
          <div className="flex items-start space-x-2 p-3 bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-sm mb-6">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Learning Areas Selection */}
          <div>
            <h3 className="flex items-center space-x-2 text-slate-200 font-semibold mb-3">
              <Code size={18} className="text-orange-400" />
              <span>Current Learning Areas</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {learningAreaOptions.map((area) => {
                const isSelected = selectedAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md shadow-orange-950/30'
                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goals Selection */}
          <div>
            <h3 className="flex items-center space-x-2 text-slate-200 font-semibold mb-3">
              <Trophy size={18} className="text-purple-400" />
              <span>Academic / Career Goals</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {goalOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-950/30'
                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-orange-950/20 group"
          >
            <span>{loading ? 'Saving Setup...' : 'Enter Dashboard'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
