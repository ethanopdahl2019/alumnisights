
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Video, MessageSquare, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Find the right mentor",
    description: "Browse profiles of students and alumni from your target schools."
  },
  {
    icon: Calendar,
    title: "Book a time",
    description: "Schedule a conversation at a time that works for both of you."
  },
  {
    icon: Video,
    title: "Connect virtually",
    description: "Meet via video call for a personal, face-to-face conversation."
  },
  {
    icon: MessageSquare,
    title: "Get authentic insights",
    description: "Learn from someone who's been exactly where you want to go."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container-custom max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-garamond text-4xl md:text-5xl font-bold mb-6 text-navy">How It Works</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Get the insights you need about your dream schools in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#F5F5DC] rounded-xl p-8 h-full relative">
              <div className="bg-white rounded-full p-4 inline-flex mb-6 shadow-sm">
                <step.icon className="h-8 w-8 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-navy">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-navy/50" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild size="lg" className="bg-navy hover:bg-navy/90 text-lg px-8 py-6 h-auto">
            <Link to="/how-it-works">Learn More About Our Process</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
