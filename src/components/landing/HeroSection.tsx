import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Modern Booking System for
            <span className="bg-gradient-to-r from-[#8f00ff] to-[#ff00ff] text-transparent bg-clip-text"> Barbers</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Streamline your barbershop with our intelligent booking system. Manage appointments, clients, and grow your business effortlessly.
          </p>
          <div className="flex justify-center">
            <button
              onClick={onGetStarted}
              className="bg-[#8f00ff] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#7a00d9] transition-colors flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};