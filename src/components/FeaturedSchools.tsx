
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { getUniversities, University } from '@/services/universities';
import { getUniversityLogo } from '@/services/landing-page';

const FeaturedSchools: React.FC = () => {
  const [featuredUniversities, setFeaturedUniversities] = useState<University[]>([]);
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const allUniversities = await getUniversities();
        // Take the first 8 universities to display as featured
        setFeaturedUniversities(allUniversities.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Fetch logos for the featured universities
  useEffect(() => {
    const fetchUniversityLogos = async () => {
      const logosMap: Record<string, string | null> = {};
      
      try {
        // Fetch logos in parallel for better performance
        const logoPromises = featuredUniversities.map(async (university) => {
          const logo = await getUniversityLogo(university.id);
          return { id: university.id, logo };
        });
        
        const results = await Promise.allSettled(logoPromises);
        
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            logosMap[result.value.id] = result.value.logo;
          }
        });
        
        setUniversityLogos(logosMap);
      } catch (error) {
        console.error('Failed to fetch university logos:', error);
      }
    };
    
    if (featuredUniversities.length > 0) {
      fetchUniversityLogos();
    }
  }, [featuredUniversities]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl mb-4">Featured Schools</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div 
                  key={index} 
                  className="h-24 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Featured Schools</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with students from top universities across the country
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredUniversities.map((university) => (
            <Link
              key={university.id}
              to={`/insights/undergraduate-admissions/${university.id}`}
              className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow text-center"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                {universityLogos[university.id] ? (
                  <img 
                    src={universityLogos[university.id] || ''} 
                    alt={university.name} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // If image fails to load, replace with default icon
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/logos/default-university.png";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-slate-500" />
                  </div>
                )}
              </div>
              <h3 className="font-medium">{university.name}</h3>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/schools" className="clickable-primary">
            View All Schools
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSchools;
