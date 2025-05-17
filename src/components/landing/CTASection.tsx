
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-28 bg-beige-100">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-bold text-navy mb-8"
          >
            Ready to make an informed decision about your education?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-700 mb-10"
          >
            Connect with students and alumni who can provide authentic insights and guide you on your educational journey.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link 
              to="/browse" 
              className="bg-navy hover:bg-navy/90 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors inline-flex"
            >
              Get Started Today <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
