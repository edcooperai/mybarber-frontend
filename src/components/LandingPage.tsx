import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AuthModal from './auth/AuthModal';
import { usePageTitle } from '../utils/pageTitle';

const LandingPage: React.FC = () => {
  usePageTitle('Modern Barber Booking');
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => !!state.token);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/"
              className="text-xl sm:text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              <span className="text-white">mybarber</span>
              <span className="text-[#8f00ff]">.ai</span>
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleDashboard}
                className="bg-[#8f00ff] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-[#7a00d9] transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-[#8f00ff] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-[#7a00d9] transition-colors text-sm sm:text-base"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 sm:mb-8">
              <span className="text-white">Smart Booking for</span>
              <br />
              <span className="text-[#8f00ff]">Modern Barbers</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
              Streamline your barbershop with intelligent scheduling, client management,
              and business analytics. All in one place.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-[#8f00ff] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-[#7a00d9] transition-colors text-base sm:text-lg font-semibold flex items-center gap-2 mx-auto"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 sm:mt-20">
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Smart Scheduling</h3>
              <p className="text-gray-400">
                Intelligent booking system that adapts to your working hours and service durations.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Client Management</h3>
              <p className="text-gray-400">
                Keep track of client preferences, history, and build lasting relationships.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Business Analytics</h3>
              <p className="text-gray-400">
                Make data-driven decisions with detailed insights into your business performance.
              </p>
            </div>
          </div>
        </div>
      </main>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onToggleMode={() => setAuthMode(mode => mode === 'signin' ? 'signup' : 'signin')}
        />
      )}
    </div>
  );
};

export default LandingPage;