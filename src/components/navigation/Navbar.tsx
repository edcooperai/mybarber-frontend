import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../constants';

interface NavbarProps {
  onSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSignIn }) => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-gray-800">
      {/* Component JSX */}
    </nav>
  );
};