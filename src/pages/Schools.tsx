
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { getUniversities } from '@/services/universities';
import { getUniversityLogo } from '@/services/landing-page';

interface University {
  id: string;
  name: string;
}

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const unis = await getUniversities();
        setUniversities(unis);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch university data:", error);
        toast.error("Failed to load universities");
        setIsLoading(false);
      }
    };
    
    fetchUniversities();
  }, []);
  
  // Fetch university logos efficiently
  useEffect(() => {
    const fetchUniversityLogos = async () => {
      const logosMap: Record<string, string | null> = {};
      
      try {
        // Fetch logos in parallel for better performance
        const logoPromises = universities.map(async (university) => {
          try {
            const logo = await getUniversityLogo(university.id);
            return { id: university.id, logo };
          } catch (err) {
            console.error(`Failed to fetch logo for ${university.name}:`, err);
            return { id: university.id, logo: null };
          }
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
    
    if (universities.length > 0) {
      fetchUniversityLogos();
    }
  }, [universities]);
  
  // Filter universities based on search term
  const filteredUniversities = searchTerm
    ? universities.filter(uni => 
        uni.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : universities;
    
  // Render university logo component
  const renderUniversityLogo = (universityId: string, universityName: string) => {
    const logo = universityLogos[universityId];
    
    if (logo) {
      return (
        <img 
          src={logo} 
          alt={`${universityName} logo`}
          className="max-h-full max-w-full object-contain"
        />
      );
    }
    
    return (
      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
        <GraduationCap className="h-8 w-8 text-slate-500" />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Browse Schools
          </h1>
          
          <div className="relative mb-10 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for schools..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredUniversities.length > 0 ? filteredUniversities.map((university) => (
                <Link
                  key={university.id}
                  to={`/schools/undergraduate-admissions/${university.id}`}
                  className="flex flex-col items-center p-5 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="h-24 flex items-center justify-center mb-4">
                    {renderUniversityLogo(university.id, university.name)}
                  </div>
                  <h3 className="font-medium text-center text-base">
                    {university.name}
                  </h3>
                </Link>
              )) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No schools found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schools;
