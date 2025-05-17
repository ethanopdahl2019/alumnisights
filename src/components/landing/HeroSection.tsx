
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-navy mb-6 leading-tight"
          >
            Connect with students at your dream schools
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto"
          >
            Gain authentic insights directly from current students and alumni to make informed decisions about your educational journey.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/browse" 
              className="bg-navy hover:bg-navy/90 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              Browse Mentors <ArrowRight size={18} />
            </Link>
            <Link 
              to="/how-it-works" 
              className="border border-navy text-navy hover:bg-navy/5 px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Learn How It Works
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
