
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlphabeticalNav from "@/components/AlphabeticalNav";
import { getAlphabeticalLetters, getUniversitiesByLetter } from "./insights/universities/universities-data";
import { getUniversityContent } from "@/services/landing-page";

const UndergraduateAdmissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [universityContents, setUniversityContents] = useState<Record<string, any>>({});
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const alphabeticalLetters = getAlphabeticalLetters();
  const universitiesByLetter = getUniversitiesByLetter();
  
  // Fetch university content for logos
  useEffect(() => {
    const fetchUniversityContent = async () => {
      const contentMap: Record<string, any> = {};
      
      // Get all university IDs
      const allUniversities = Object.values(universitiesByLetter).flat();
      
      for (const university of allUniversities) {
        try {
          const content = await getUniversityContent(university.id);
          if (content) {
            contentMap[university.id] = content;
          }
        } catch (error) {
          console.error(`Failed to fetch content for ${university.name}:`, error);
        }
      }
      
      setUniversityContents(contentMap);
    };
    
    fetchUniversityContent();
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
  const filteredUniversities = searchTerm
    ? alphabeticalLetters.flatMap(letter => 
        (universitiesByLetter[letter] || []).filter(uni => 
          uni.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Undergraduate Admissions
          </h1>
          
          <div className="relative mb-10 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for universities..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {searchTerm ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniversities.length > 0 ? filteredUniversities.map((university) => (
                <div key={university.id}>
                  <Link 
                    to={`/schools/undergraduate-admissions/${university.id}`}
                    className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 shadow-sm"
                  >
                    <div className="h-24 flex items-center justify-center mb-3">
                      {(universityContents[university.id]?.logo || university.logo) ? (
                        <img 
                          src={universityContents[university.id]?.logo || university.logo} 
                          alt={`${university.name} logo`}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-8 w-8 text-slate-500" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1 text-center">{university.name}</h3>
                    <p className="text-sm text-gray-600 text-center">{"Location unavailable"}</p>
                  </Link>
                </div>
              )) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No universities found matching your search.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-6">
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
                          className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 shadow-sm"
                        >
                          <div className="h-16 flex items-center justify-center mb-3">
                            {(universityContents[university.id]?.logo || university.logo) ? (
                              <img 
                                src={universityContents[university.id]?.logo || university.logo} 
                                alt={`${university.name} logo`}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-slate-500" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-medium text-center text-sm">
                            {university.name}
                          </h3>
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

export default UndergraduateAdmissions;
