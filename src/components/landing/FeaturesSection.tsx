import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    Icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Intelligent booking system that prevents double bookings and manages your calendar efficiently.',
  },
  {
    Icon: Clock,
    title: '24/7 Online Booking',
    description: 'Let clients book appointments anytime, anywhere. Reduce no-shows with automated reminders.',
  },
  {
    Icon: Users,
    title: 'Client Management',
    description: 'Keep track of client preferences, history, and build lasting relationships.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <div className="bg-black/50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-400">Powerful features to help you manage your barbershop</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};