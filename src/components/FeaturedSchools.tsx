import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { getUniversities, University } from '@/services/universities';
import { getUniversityLogo } from '@/services/landing-page';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

const FeaturedSchools: React.FC = () => {
  const [featuredUniversities, setFeaturedUniversities] = useState<University[]>([]);
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        // First, try to get the featured school IDs from site_settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'featured_schools')
          .single();
        
        const allUniversities = await getUniversities();
        
        if (settingsData) {
          const featuredSchoolIds = JSON.parse(settingsData.value || '[]');
          
          // Filter universities to only include the featured ones
          const featured = allUniversities.filter(university => 
            featuredSchoolIds.includes(university.id)
          );
          
          // If we have featured schools, use them in the order specified
          if (featured.length > 0) {
            // Order by the original featured array order
            const orderedFeatured = featuredSchoolIds
              .map(id => featured.find(uni => uni.id === id))
              .filter(Boolean);
              
            setFeaturedUniversities(orderedFeatured);
          } else {
            // Fallback to first 8 if no matches found
            setFeaturedUniversities(allUniversities.slice(0, 8));
          }
        } else {
          // Fallback to first 8 universities if no featured settings
          setFeaturedUniversities(allUniversities.slice(0, 8));
        }
        
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

  // Completely revised scroll hijacking effect
  useEffect(() => {
    const section = sectionRef.current;
    const scrollContainer = scrollContainerRef.current;
    
    if (!section || !scrollContainer) {
      console.log("Section or scroll container not found");
      return;
    }
    
    const getMaxScrollDistance = () => {
      return scrollContainer.scrollWidth - scrollContainer.clientWidth;
    };
    
    console.log("Max scroll distance:", getMaxScrollDistance());
    console.log("Scroll container width:", scrollContainer.scrollWidth);
    console.log("Container client width:", scrollContainer.clientWidth);
    
    const handleScroll = () => {
      // Calculate where the section is relative to the viewport
      const { top, bottom, height } = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // How much of the section has been scrolled past
      const scrollProgress = Math.max(0, Math.min(1, -top / (height - viewportHeight)));
      
      // Make sure the section is sticky when in the viewport
      if (top <= 0 && bottom >= viewportHeight) {
        section.style.position = 'sticky';
        section.style.top = '0';
        
        // Calculate horizontal scroll based on vertical progress
        const maxScroll = getMaxScrollDistance();
        const horizontalScroll = scrollProgress * maxScroll;
        
        // Apply horizontal scroll
        scrollContainer.scrollLeft = horizontalScroll;
        
        // Debug scrolling behavior
        console.log("Scroll progress:", scrollProgress, "Horizontal scroll:", horizontalScroll);
        
        // Prevent normal scrolling while in this section
        if (scrollProgress < 1 && scrollProgress > 0) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      } else {
        // When the section isn't in the right position, allow normal scrolling
        document.body.style.overflow = '';
      }
    };
    
    // Set up initial state
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl mb-4">Featured Schools</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[...Array(8)].map((_, index) => (
                <div 
                  key={index} 
                  className="h-36 w-64 flex-shrink-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[500vh]" // Increased height for smoother scrolling control
      style={{ 
        willChange: 'transform', // Optimize for animations
      }}
    >
      <div className="sticky top-0 h-screen flex items-center bg-white">
        <div className="container-custom w-full">
          <div className="text-center mb-12">
            <h2 className="mb-4">Featured Schools</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with students from top universities across the country
            </p>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto no-scrollbar snap-x pb-6"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollBehavior: 'auto', // Disable smooth scrolling for direct control
              overflowX: 'auto', // Ensure horizontal scrolling is enabled
              WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
            }}
          >
            {featuredUniversities.map((university) => (
              <Link
                key={university.id}
                to={`/insights/undergraduate-admissions/${university.id}`}
                className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow text-center min-w-[250px] h-52 mx-3 flex-shrink-0 snap-center"
              >
                <div className="w-24 h-24 flex items-center justify-center mb-4">
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
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-slate-500" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-lg">{university.name}</h3>
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
      </div>
    </section>
  );
};

export default FeaturedSchools;
