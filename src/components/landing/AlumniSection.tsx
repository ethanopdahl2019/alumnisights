
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface Alumni {
  id: string;
  name: string;
  image: string | null;
  headline: string | null;
  school: {
    name: string;
  };
}

const AlumniSection = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);

  useEffect(() => {
    const fetchAlumni = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, image, headline, school:school_id(name)')
        .eq('role', 'alumni')
        .eq('featured', true)
        .limit(4);
      
      if (error) {
        console.error('Error fetching alumni:', error);
        return;
      }
      
      setAlumni(data || []);
    };

    fetchAlumni();
  }, []);

  return (
    <section className="py-20 bg-beige-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">Featured Alumni</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Connect with accomplished alumni who are eager to share their experiences and insights.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {alumni.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm text-center"
            >
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 border-2 border-beige-100">
                  <AvatarImage src={person.image || ''} alt={person.name} />
                  <AvatarFallback className="text-xl font-serif">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <h3 className="text-xl font-serif font-bold mb-1">{person.name}</h3>
              <p className="text-navy/70 mb-3">{person.school.name}</p>
              <p className="text-gray-600 text-sm mb-4">{person.headline || ''}</p>
              
              <Link 
                to={`/alumni/${person.id}`}
                className="text-navy hover:text-navy/80 font-medium text-sm"
              >
                View Profile
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/browse" 
            className="inline-block bg-navy hover:bg-navy/90 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Browse All Alumni
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AlumniSection;
