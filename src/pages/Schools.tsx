import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AlphabeticalNav from '@/components/AlphabeticalNav';
import { getAlphabeticalLetters, getUniversitiesByLetter } from './insights/universities/universities-data';
import { getUniversityLogo } from '@/services/landing-page';

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Get the same university list as the insights page
  const alphabeticalLetters = getAlphabeticalLetters();
  const universitiesByLetter = getUniversitiesByLetter();
  const allUniversities = Object.values(universitiesByLetter).flat();
  
  // Fetch university logos efficiently
  useEffect(() => {
    const fetchUniversityLogos = async () => {
      setIsLoadingLogos(true);
      const logosMap: Record<string, string | null> = {};
      
      try {
        // Fetch logos in parallel for better performance
        const logoPromises = allUniversities.map(async (university) => {
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
        toast.error('Failed to load some university logos');
      } finally {
        setIsLoadingLogos(false);
      }
    };
    
    fetchUniversityLogos();
  }, []);
  
  useEffect(() => {
    // Set initial active letter to the first one
    if (alphabeticalLetters.length > 0 && !activeLetter) {
      setActiveLetter(alphabeticalLetters[0]);
    }
  }, [alphabeticalLetters.length]);
  
  // Handle letter click in the alphabetical nav
  const handleLetterClick = (letter: string) => {
    setActiveLetter(letter);
    if (letterRefs.current[letter]) {
      letterRefs.current[letter]?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };
  
  // Filter universities based on search term
  const filteredSchools = searchTerm
    ? alphabeticalLetters.flatMap(letter => 
        (universitiesByLetter[letter] || []).filter(uni => 
          uni.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];
    
  const getUniversityLocation = (university: any) => {
    // If we have location data in university, use it
    if (university.location) return university.location;
    
    // Otherwise return a placeholder
    return "United States";
  };
  
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
          
          {searchTerm ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            <div className="flex gap-4">
              <AlphabeticalNav 
                letters={alphabeticalLetters} 
                onLetterClick={handleLetterClick}
                activeLetter={activeLetter} 
              />
              
              <div className="flex-1">
                {alphabeticalLetters.map((letter) => (
                  <div 
                    key={letter}
                    ref={el => letterRefs.current[letter] = el}
                    className="mb-8"
                    id={`letter-${letter}`}
                  >
                    <h2 className="text-2xl font-bold text-navy mb-4 px-2 border-l-4 border-blue-500">{letter}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {universitiesByLetter[letter]?.map((university) => (
                        <Link
                          key={university.id}
                          to={`/schools/undergraduate-admissions/${university.id}`}
                          className="flex flex-col items-center p-5 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 shadow-sm"
                        >
                          <div className="h-20 flex items-center justify-center mb-3">
                            {renderUniversityLogo(university.id, university.name)}
                          </div>
                          <h3 className="font-medium text-center text-base mb-2">
                            {university.name}
                          </h3>
                          <div className="flex items-center text-gray-600 text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{getUniversityLocation(university)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schools;
