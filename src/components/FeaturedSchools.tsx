
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getUniversities } from '@/services/universities';
import { getUniversityLogo } from '@/services/landing-page';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const FeaturedSchools = () => {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const universities = await getUniversities();
        
        // Get featured or random schools (limit to 8)
        const featuredSchools = universities
          .sort(() => 0.5 - Math.random()) // Simple randomization
          .slice(0, 8);
        
        // Fetch logos for each school
        const schoolsWithLogos = await Promise.all(
          featuredSchools.map(async (school) => {
            try {
              const logo = await getUniversityLogo(school.id);
              return { ...school, logo };
            } catch (error) {
              return { ...school, logo: null };
            }
          })
        );
        
        setSchools(schoolsWithLogos);
      } catch (error) {
        console.error('Error fetching featured schools:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchools();
  }, []);
  
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-medium mb-4">Featured Schools</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore top universities our mentors represent
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-medium mb-4">Featured Schools</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore top universities our mentors represent
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {schools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={`/schools/undergraduate-admissions/${school.id}`} className="block h-full">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <div className="mb-4 h-24 flex items-center justify-center">
                      {school.logo ? (
                        <img 
                          src={school.logo} 
                          alt={school.name} 
                          className="max-h-24 max-w-full object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-8 w-8 text-slate-500" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium">{school.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSchools;
