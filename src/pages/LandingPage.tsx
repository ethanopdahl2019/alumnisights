
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDatabaseImagesByCategory, getRandomDatabaseImages, ImageData } from '@/services/images';
import { motion } from 'framer-motion';
import TypeWriter from '@/components/TypeWriter';

const schoolExamples = [
  'Harvard economics major',
  'Amherst lacrosse player',
  'Alabama sorority member',
  'Stanford computer science student',
  'Duke basketball player',
  'Berkeley entrepreneur',
  'Yale debate team captain'
];

const LandingPage = () => {
  const [studentImages, setStudentImages] = useState<ImageData[]>([]);
  const [campusImages, setCampusImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const studentImgs = await getDatabaseImagesByCategory('students', 4);
        const campusImgs = await getDatabaseImagesByCategory('campus', 3);
        
        setStudentImages(studentImgs);
        setCampusImages(campusImgs);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImages();
  }, []);
  
  return (
    <div className="min-h-screen bg-soft-beige">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
          </div>
          
          <div className="container-custom relative z-10 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-garamond mb-6 tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Connect with a <br />
                  <span className="font-garamond"><TypeWriter words={schoolExamples} typingSpeed={100} deletingSpeed={50} /></span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-700 mb-10 font-sans"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Book conversations with current students and alumni to gain authentic, 
                  school-specific insights for your college journey and application process.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Link 
                    to="/browse" 
                    className="inline-block px-8 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-sans text-lg"
                  >
                    Find Your Connection
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="hidden lg:grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {isLoading ? (
                  // Skeleton loading for images
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
                  ))
                ) : (
                  studentImages.slice(0, 4).map((image, index) => (
                    <motion.div 
                      key={image.id}
                      className="overflow-hidden rounded-lg shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Campus Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <motion.h2 
                className="text-4xl font-garamond mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Discover Your Perfect Campus
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Explore universities across the country and connect with people who know them best
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading ? (
                // Skeleton loading for campus images
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
                ))
              ) : (
                campusImages.map((image, index) => (
                  <motion.div 
                    key={image.id} 
                    className="overflow-hidden rounded-lg shadow-md bg-white"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <div className="h-56 overflow-hidden">
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-garamond text-xl mb-2">{image.alt}</h3>
                      <p className="text-gray-600 text-sm font-sans mb-4">{image.caption}</p>
                      <Link to="/schools" className="text-navy font-medium text-sm hover:underline font-sans">
                        Explore More
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/schools" 
                className="inline-block border-b border-navy text-navy hover:border-navy/70 hover:text-navy/70 transition-colors font-sans"
              >
                View All Schools
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-soft-beige">
          <div className="container-custom">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-garamond mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                How It Works
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Get connected with the right person to guide your college journey
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 font-garamond">1</span>
                <h3 className="text-2xl font-garamond mb-3">Browse Profiles</h3>
                <p className="text-gray-600 font-sans">
                  Search through our diverse community of students and alumni from your target schools.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 font-garamond">2</span>
                <h3 className="text-2xl font-garamond mb-3">Book a Session</h3>
                <p className="text-gray-600 font-sans">
                  Schedule a personalized conversation at a time that works best for you.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 font-garamond">3</span>
                <h3 className="text-2xl font-garamond mb-3">Get Insider Insights</h3>
                <p className="text-gray-600 font-sans">
                  Gain authentic perspectives about academics, campus life, and admission strategies.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
