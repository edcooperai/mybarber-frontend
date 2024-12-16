import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <div className="w-12 h-12 bg-[#8f00ff]/20 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#8f00ff]" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};