import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, usePageTitle } from '../hooks';
import { ROUTES } from '../constants';
import AuthModal from './auth/AuthModal';
import Navbar from './landing/Navbar';
import HeroSection from './landing/HeroSection';
import FeaturesSection from './landing/FeaturesSection';
import CTASection from './landing/CTASection';

const LandingPage: React.FC = () => {
  usePageTitle('Modern Barber Booking');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    } else {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar onSignIn={handleSignIn} />
      
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        <CTASection onGetStarted={handleGetStarted} />
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