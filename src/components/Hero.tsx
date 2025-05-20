
import React from 'react';
import { Link } from 'react-router-dom';
import TypeWriter from './TypeWriter';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="container-custom flex flex-col lg:flex-row items-center py-16 lg:py-24">
        <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get the inside scoop on college life
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Connect with <TypeWriter 
              words={['current students', 'graduates', 'athletes', 'club leaders']}
              loop={true}
              cursor={true}
              className="text-blue-600"
            /> 
            to get honest insights about campus life, academics, and more.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link 
              to="/browse" 
              className="bg-navy text-white px-8 py-3 rounded-full font-medium hover:bg-navy/90 transition-colors"
            >
              Browse
            </Link>
          </motion.div>
        </div>
        
        <div className="lg:w-1/2">
          <motion.img 
            src="/lovable-uploads/ac4ac494-9f39-4376-94ee-435e6eeaad53.png"
            alt="University campus scene"
            className="rounded-lg w-full shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
