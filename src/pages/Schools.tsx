import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchInput from '@/components/SearchInput';
import { UniversityData } from './insights/universities/universities-data';
import { getUniversityLogo } from '@/services/landing-page';
import { getUniversities } from '@/services/universities';

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const [allUniversities, setAllUniversities] = useState<UniversityData[]>([]);
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
  
  // Fetch university logos with optimization for faster loading
  useEffect(() => {
    if (allUniversities.length === 0) return;
    
    setIsLoadingLogos(true);
    
    // Only load logos for currently visible universities or searched results
    const visibleUniversities = searchTerm 
      ? allUniversities.filter(uni => uni.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : allUniversities;
    
    const fetchLogos = async () => {
      try {
        // Process logos in larger batches for faster loading
        const batchSize = 20;
        for (let i = 0; i < visibleUniversities.length; i += batchSize) {
          const batch = visibleUniversities.slice(i, i + batchSize);
          const batchPromises = batch.map(async (university) => {
            try {
              const logo = await getUniversityLogo(university.id);
              return { id: university.id, logo };
            } catch (error) {
              return { id: university.id, logo: null };
            }
          });
          
          const results = await Promise.all(batchPromises);
          
          setUniversityLogos(prev => {
            const updated = { ...prev };
            results.forEach(result => {
              updated[result.id] = result.logo;
            });
            return updated;
          });
        }
      } finally {
        setIsLoadingLogos(false);
      }
    };
    
    fetchLogos();
  }, [allUniversities, searchTerm]);
  
  // Filter universities based on search term
  const filteredSchools = searchTerm
    ? allUniversities.filter(uni => 
        uni.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allUniversities;
    
  const getUniversityLocation = (university: any) => {
    // If we have location data in university, use it
    if (university.location) return university.location;
    
    // Otherwise return a placeholder
    return "United States";
  };
  
  // Render university logo component with lazy loading
  const renderUniversityLogo = (universityId: string, universityName: string) => {
    const logo = universityLogos[universityId];
    
    if (logo) {
      return (
        <img 
          src={logo} 
          alt={`${universityName} logo`}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      );
    }
    
    return (
      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse p-6 border border-gray-100 shadow-sm rounded-lg">
                  <div className="h-24 flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSchools.length > 0 ? filteredSchools.map((university) => (
              <div key={university.id}>
                <Link 
                  to={`/schools/undergraduate-admissions/${university.id}`}
                  className="flex flex-col items-center p-6 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 shadow-sm"
                >
                  <div className="h-24 flex items-center justify-center mb-4">
                    {renderUniversityLogo(university.id, university.name)}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-center">{university.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{getUniversityLocation(university)}</span>
                  </div>
                </Link>
              </div>
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
