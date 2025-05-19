
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AlphabeticalNav from '@/components/AlphabeticalNav';
import SearchInput from '@/components/SearchInput';
import { getAlphabeticalLetters, getUniversitiesByLetter, UniversityData } from './insights/universities/universities-data';
import { getUniversityLogo } from '@/services/landing-page';

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Store fetched data in state
  const [alphabeticalLetters, setAlphabeticalLetters] = useState<string[]>([]);
  const [universitiesByLetter, setUniversitiesByLetter] = useState<Record<string, UniversityData[]>>({});
  const [allUniversities, setAllUniversities] = useState<UniversityData[]>([]);
  
  // Fetch data on component mount with improved error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const letters = await getAlphabeticalLetters();
        setAlphabeticalLetters(letters);
        
        const universities = await getUniversitiesByLetter();
        setUniversitiesByLetter(universities);
        
        // Get all universities as a flat array
        const allUnis = Object.values(universities).flat();
        setAllUniversities(allUnis);
        
        // Set initial active letter
        if (letters.length > 0 && !activeLetter) {
          setActiveLetter(letters[0]);
        }
      } catch (error) {
        console.error("Failed to fetch university data:", error);
        toast.error("Failed to load universities");
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
      : activeLetter 
        ? universitiesByLetter[activeLetter] || []
        : allUniversities.slice(0, 12); // Load just first few for initial view
    
    const fetchLogos = async () => {
      try {
        // Process logos in smaller batches to prevent overwhelming the network
        const batchSize = 8;
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
  }, [allUniversities, activeLetter, searchTerm, universitiesByLetter]);
  
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
  const filteredSchools = useMemo(() => {
    if (!searchTerm) return [];
    
    return allUniversities.filter(uni => 
      uni.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allUniversities]);
    
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
