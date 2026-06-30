import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Navbar from './components/Navbar';

// Route helper for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isProfileComplete } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isProfileComplete) {
    return <Navigate to="/setup" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {children}
      </div>
    </>
  );
};

// Route helper for user setup
const SetupRoute = ({ children }) => {
  const { isAuthenticated, isProfileComplete } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isProfileComplete) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl relative z-10">
      {children}
    </div>
  );
};

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen relative overflow-hidden font-sans">
          {/* Subtle ambient grid and light particles */}
          <div className="bg-grid-effect"></div>
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Profile Setup Route */}
            <Route
              path="/setup"
              element={
                <SetupRoute>
                  <ProfileSetup />
                </SetupRoute>
              }
            />

            {/* Protected Core App Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkin"
              element={
                <ProtectedRoute>
                  <CheckIn />
                </ProtectedRoute>
              }
            />

            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
