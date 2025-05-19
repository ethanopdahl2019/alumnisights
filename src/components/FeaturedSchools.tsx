
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getUniversityContent } from "@/services/landing-page";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap } from "lucide-react";

// Component to display featured schools on the homepage
const FeaturedSchools = () => {
  const [featuredSchools, setFeaturedSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [universityContents, setUniversityContents] = useState<Record<string, any>>({});
  
  // Fetch featured schools from site settings
  useEffect(() => {
    const fetchFeaturedSchools = async () => {
      try {
        setIsLoading(true);
        
        // Get featured schools IDs from site settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'featured_schools')
          .single();
          
        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error("Error fetching featured schools setting:", settingsError);
          setIsLoading(false);
          return;
        }
        
        // Parse the featured school IDs from the settings value
        let schoolIds: string[] = [];
        if (settingsData?.value) {
          try {
            schoolIds = JSON.parse(settingsData.value);
          } catch (err) {
            console.error("Error parsing featured schools:", err);
          }
        }
        
        if (schoolIds.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // Fetch the universities data
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('universities')
          .select('*')
          .in('id', schoolIds);
        
        if (schoolsError) {
          console.error("Error fetching schools:", schoolsError);
          setIsLoading(false);
          return;
        }
        
        // Sort schools to match the order in the settings
        const sortedSchools = schoolIds.map(id => 
          schoolsData?.find(school => school.id === id)
        ).filter(Boolean);
        
        setFeaturedSchools(sortedSchools);
        
        // Fetch university content (for logos)
        if (sortedSchools.length > 0) {
          const contentMap: Record<string, any> = {};
          
          for (const school of sortedSchools) {
            try {
              const content = await getUniversityContent(school.id);
              if (content) {
                contentMap[school.id] = content;
              }
            } catch (error) {
              console.error(`Failed to fetch content for ${school.name}:`, error);
            }
          }
          
          setUniversityContents(contentMap);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load featured schools:", error);
        setIsLoading(false);
      }
    };
    
    fetchFeaturedSchools();
  }, []);
  
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Universities</h2>
            <Link 
              to="/insights/undergraduate-admissions"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2 md:mt-0"
            >
              View all universities
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                <div className="h-20 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (featuredSchools.length === 0) {
    return null;
  }

  const scrollContainer = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollAmount = e.deltaY;
    
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
    
    e.preventDefault();
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Universities</h2>
          <Link 
            to="/insights/undergraduate-admissions"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2 md:mt-0"
          >
            View all universities
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div 
          className="grid grid-cols-1 md:flex md:space-x-4 overflow-x-auto scrollbar-hide pb-4" 
          onWheel={scrollContainer}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredSchools.map((school) => (
            <div 
              key={school.id} 
              className="min-w-[280px] bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col"
            >
              <div className="h-20 flex items-center justify-center mb-4">
                {(universityContents[school.id]?.logo) ? (
                  <img 
                    src={universityContents[school.id]?.logo} 
                    alt={`${school.name} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">{school.name}</h3>
              <p className="text-sm text-gray-500 text-center mb-4">{school.state || "United States"}</p>
              <div className="mt-auto">
                <Link
                  to={`/insights/undergraduate-admissions/${school.id}`}
                  className="inline-block w-full bg-white text-blue-600 border border-blue-600 rounded px-4 py-2 text-center text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>
        {`.scrollbar-hide::-webkit-scrollbar { display: none; }`}
      </style>
    </section>
  );
};

export default FeaturedSchools;
