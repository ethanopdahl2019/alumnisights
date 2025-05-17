
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Calendar, Video, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Browse Profiles',
    description: 'Explore profiles of current students and alumni from your target schools.',
    icon: <Search className="h-8 w-8 text-navy" />
  },
  {
    title: 'Book a Conversation',
    description: 'Select a time that works for you and your mentor.',
    icon: <Calendar className="h-8 w-8 text-navy" />
  },
  {
    title: 'Connect Virtually',
    description: 'Join a video call and get answers to all your questions.',
    icon: <Video className="h-8 w-8 text-navy" />
  },
  {
    title: 'Gain Valuable Insights',
    description: 'Make informed decisions based on authentic experiences.',
    icon: <Lightbulb className="h-8 w-8 text-navy" />
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-beige-100">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">How It Works</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Our platform makes it easy to connect with students and alumni who have firsthand experience at your target schools.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-8 shadow-sm relative"
            >
              <div className="mb-6">{step.icon}</div>
              <h3 className="text-2xl font-serif font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight size={24} className="text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/browse" 
            className="inline-block bg-navy hover:bg-navy/90 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Find Your Mentor
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
