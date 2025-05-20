
import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchInput from '@/components/SearchInput';
import { getUniversityLogo } from '@/services/landing-page';
import { getUniversities } from '@/services/universities';

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [allUniversities, setAllUniversities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch all universities on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const universities = await getUniversities();
        setAllUniversities(universities);
      } catch (error) {
        console.error("Failed to fetch university data:", error);
        toast.error("Failed to load universities");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch university logos
  useEffect(() => {
    if (allUniversities.length === 0) return;
    
    const fetchLogos = async () => {
      try {
        const logosMap: Record<string, string | null> = {};
        
        // Process logos in batches for better performance
        for (let i = 0; i < allUniversities.length; i += 10) {
          const batch = allUniversities.slice(i, i + 10);
          const batchPromises = batch.map(async (university) => {
            try {
              const logo = await getUniversityLogo(university.id);
              return { id: university.id, logo };
            } catch (error) {
              return { id: university.id, logo: null };
            }
          });
          
          const results = await Promise.all(batchPromises);
          results.forEach(result => {
            logosMap[result.id] = result.logo;
          });
        }
        
        setUniversityLogos(logosMap);
      } catch (error) {
        console.error('Failed to fetch logos:', error);
      }
    };
    
    fetchLogos();
  }, [allUniversities]);
  
  // Filter universities based on search term
  const filteredSchools = searchTerm
    ? allUniversities.filter(uni => 
        uni.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allUniversities;
  
  // Render university logo component
  const renderUniversityLogo = (universityId: string, universityName: string) => {
    const logo = universityLogos[universityId];
    
    if (logo) {
      return (
        <img 
          src={logo} 
          alt={`${universityName} logo`}
          className="h-20 w-auto max-w-full object-contain mx-auto"
          loading="lazy"
        />
      );
    }
    
    return (
      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
        <GraduationCap className="h-8 w-8 text-slate-500" />
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">
              Browse Schools
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="animate-pulse p-4">
                  <div className="h-20 flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Browse Schools
          </h1>
          
          <div className="relative mb-10 max-w-md mx-auto">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search for schools..."
              options={allUniversities}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredSchools.length > 0 ? filteredSchools.map((university) => (
              <a 
                key={university.id}
                href={`/schools/undergraduate-admissions/${university.id}`}
                className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="h-20 flex items-center justify-center mb-4">
                  {renderUniversityLogo(university.id, university.name)}
                </div>
                <h3 className="font-medium text-center text-sm">
                  {university.name}
                </h3>
              </a>
            )) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No schools found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schools;
