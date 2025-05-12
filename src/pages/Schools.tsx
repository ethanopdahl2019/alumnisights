
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, GraduationCap } from 'lucide-react';
import { getSchools } from '@/services/profiles';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { School } from '@/types/database';
import { getAlphabeticalLetters, getUniversitiesByLetter } from './insights/universities/universities-data';
import { getUniversityContent } from '@/services/landing-page';

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [universityContents, setUniversityContents] = useState<Record<string, any>>({});
  
  // Get the same university list as the insights page
  const alphabeticalLetters = getAlphabeticalLetters();
  const universitiesByLetter = getUniversitiesByLetter();
  const allUniversities = Object.values(universitiesByLetter).flat();
  
  // Fetch university content for logos
  useEffect(() => {
    const fetchUniversityContent = async () => {
      const contentMap: Record<string, any> = {};
      
      for (const university of allUniversities) {
        try {
          const content = await getUniversityContent(university.id);
          if (content) {
            contentMap[university.id] = content;
          }
        } catch (error) {
          console.error(`Failed to fetch content for ${university.name}:`, error);
        }
      }
      
      setUniversityContents(contentMap);
    };
    
    fetchUniversityContent();
  }, []);
  
  const filteredSchools = allUniversities.filter((university) => 
    university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            className="text-4xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Browse Schools
          </motion.h1>
          
          <motion.div 
            className="relative mb-10 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for schools..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredSchools.map((university) => (
              <motion.div key={university.id} variants={item}>
                <Link 
                  to={`/schools/undergraduate-admissions/${university.id}`}
                  className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="h-24 flex items-center justify-center mb-3">
                    {(universityContents[university.id]?.logo || university.logo) ? (
                      <img 
                        src={universityContents[university.id]?.logo || university.logo} 
                        alt={university.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-500">
                          {university.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-center">{university.name}</h3>
                  <p className="text-sm text-gray-600 text-center">{"Location unavailable"}</p>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    University
                  </p>
                </Link>
              </motion.div>
            ))}
            
            {filteredSchools.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No schools found matching your search.</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schools;
