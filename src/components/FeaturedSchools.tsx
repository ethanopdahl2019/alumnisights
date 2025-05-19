
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { getUniversities, University } from '@/services/universities';
import { getUniversityLogo } from '@/services/landing-page';
import { supabase } from '@/integrations/supabase/client';

const FeaturedSchools: React.FC = () => {
  const [featuredUniversities, setFeaturedUniversities] = useState<University[]>([]);
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollableDistance = useRef<number>(0);
  const [isScrolling, setIsScrolling] = useState(false);

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

  // Implement improved horizontal scroll functionality
  useEffect(() => {
    const section = sectionRef.current;
    const scrollContainer = scrollContainerRef.current;
    
    if (!section || !scrollContainer) {
      return;
    }

    // Calculate total scrollable distance
    scrollableDistance.current = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    
    // Create observer to detect when section enters viewport
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        section.classList.add('active-scroll');
        document.body.style.overflow = 'hidden'; // Prevent body scroll when in view
      } else {
        section.classList.remove('active-scroll');
        document.body.style.overflow = ''; // Restore body scroll when out of view
      }
    }, { threshold: 0.1 });
    
    observer.observe(section);
    
    // Handle wheel events to transform vertical scroll into horizontal scroll
    const handleWheel = (e: WheelEvent) => {
      // Only process wheel events when our section is active
      if (!section.classList.contains('active-scroll')) return;
      
      e.preventDefault();
      
      if (!isScrolling && scrollContainer) {
        setIsScrolling(true);
        
        // Use delta Y (vertical scroll) to scroll horizontally
        // Adjust sensitivity as needed
        const scrollAmount = e.deltaY * 1.5;
        const currentScroll = scrollContainer.scrollLeft;
        const targetScroll = Math.max(0, Math.min(scrollableDistance.current, currentScroll + scrollAmount));
        
        // Smooth scroll to target position
        scrollContainer.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
        
        // If we've reached the end of scrolling, allow the page to continue
        if ((scrollAmount > 0 && targetScroll >= scrollableDistance.current) || 
            (scrollAmount < 0 && targetScroll <= 0)) {
          setTimeout(() => {
            document.body.style.overflow = '';
            section.classList.remove('active-scroll');
          }, 500);
        }
        
        // Debounce the scroll events
        setTimeout(() => {
          setIsScrolling(false);
        }, 50);
      }
    };
    
    // Alternative touch and pointer event handlers for mobile
    let startY = 0;
    let startX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (!section.classList.contains('active-scroll')) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!section.classList.contains('active-scroll')) return;
      
      const deltaY = startY - e.touches[0].clientY;
      const deltaX = startX - e.touches[0].clientX;
      
      // If primarily horizontal swipe, let browser handle it
      if (Math.abs(deltaX) > Math.abs(deltaY)) return;
      
      e.preventDefault();
      
      if (!isScrolling && scrollContainer) {
        setIsScrolling(true);
        
        const scrollAmount = deltaY * 2;
        const currentScroll = scrollContainer.scrollLeft;
        const targetScroll = Math.max(0, Math.min(scrollableDistance.current, currentScroll + scrollAmount));
        
        scrollContainer.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          setIsScrolling(false);
        }, 50);
        
        startY = e.touches[0].clientY;
      }
    };
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Update scrollable distance on resize
    const handleResize = () => {
      if (scrollContainer) {
        scrollableDistance.current = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = ''; // Ensure body scroll is restored
      observer.disconnect();
    };
  }, [isScrolling]);

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
      className="relative h-[300vh]" // Keep 300vh to ensure enough scroll room for the effect
      style={{ 
        willChange: 'transform' // Optimize for animations
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
              scrollBehavior: 'auto',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
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
      
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
};

export default FeaturedSchools;
