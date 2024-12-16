import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#8f00ff]/20 text-[#8f00ff] px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Limited Time Offer
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Start Growing Your Business Today
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of barbers who are streamlining their business with our modern booking system.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onGetStarted}
            className="bg-[#8f00ff] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#7a00d9] transition-colors inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};