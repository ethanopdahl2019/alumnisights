
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container-custom max-w-5xl mx-auto text-center px-4">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Connect with a<br />
          Duke basketball player
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Book conversations with current students and alumni to gain authentic,
          school-specific insights for your college journey and application process.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link 
            to="/browse" 
            className="bg-navy text-white px-8 py-3 rounded-full font-medium hover:bg-navy/90 transition-colors"
          >
            Find Your Connection
          </Link>
          <Link 
            to="/become-mentor" 
            className="bg-white text-navy border border-navy px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
          >
            Join as Alumni/Student
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
