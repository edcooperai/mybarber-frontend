import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import { ROUTES } from '../../constants';
import { AuthModal } from '../auth';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { CTASection } from './CTASection';

export const LandingPage: React.FC = () => {
  usePageTitle(); // Just use the default app name
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