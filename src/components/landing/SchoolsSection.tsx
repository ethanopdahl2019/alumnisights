
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface School {
  id: string;
  name: string;
  image: string | null;
}

const SchoolsSection = () => {
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    const fetchSchools = async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name, image')
        .order('name', { ascending: true })
        .limit(8);
      
      if (error) {
        console.error('Error fetching schools:', error);
        return;
      }
      
      setSchools(data || []);
    };

    fetchSchools();
  }, []);

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">Featured Schools</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Connect with students and alumni from top universities across the country.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {schools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {school.image ? (
                <img 
                  src={school.image} 
                  alt={school.name} 
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <div className="h-16 w-full flex items-center justify-center text-navy font-serif font-bold">
                  {school.name}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/schools" 
            className="inline-block text-navy hover:text-navy/80 font-medium border-b border-navy pb-1 transition-colors"
          >
            View All Schools
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SchoolsSection;
