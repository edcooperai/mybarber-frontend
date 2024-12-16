import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  onSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSignIn }) => {
  const isAuthenticated = useAuthStore((state) => !!state.token);

  return (
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
            <Link
              to="/dashboard"
              className="bg-[#8f00ff] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-[#7a00d9] transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={onSignIn}
              className="bg-[#8f00ff] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-[#7a00d9] transition-colors text-sm sm:text-base"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};