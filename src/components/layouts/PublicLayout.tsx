import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../navigation';

interface PublicLayoutProps {
  onSignIn: () => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ onSignIn }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar onSignIn={onSignIn} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};