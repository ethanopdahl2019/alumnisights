
import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AlphabeticalNav from "@/components/AlphabeticalNav";
import DefaultLogo from "./universities/DefaultLogo";
import { getAlphabeticalLetters, getUniversitiesByLetter } from "./universities/universities-data";
import { getUniversityLogo } from "@/services/landing-page";
import { useAuth } from "@/components/AuthProvider";
import { generateUniversityContent } from "@/services/ai/generateUniversityContent";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const UndergraduateAdmissions = () => {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const [generatingContentFor, setGeneratingContentFor] = useState<string | null>(null);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const alphabeticalLetters = getAlphabeticalLetters();
  const universitiesByLetter = getUniversitiesByLetter();
  const { isAdmin } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Fetch university logos efficiently
  useEffect(() => {
    const fetchUniversityLogos = async () => {
      setIsLoadingLogos(true);
      const logosMap: Record<string, string | null> = {};
      
      try {
        // Get all universities to fetch logos for
        const allUniversities = Object.values(universitiesByLetter).flat();
        
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
      } finally {
        setIsLoadingLogos(false);
      }
    };
    
    fetchUniversityLogos();
  }, []);
  
  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    if (letterRefs.current[letter]) {
      letterRefs.current[letter]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  };
  
  useEffect(() => {
    // Set initial active letter to the first one
    if (alphabeticalLetters.length > 0 && !activeLetter) {
      setActiveLetter(alphabeticalLetters[0]);
    }
    
    // Clean up previous observer if exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create a new intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          let highestEntry = visibleEntries[0];
          
          visibleEntries.forEach(entry => {
            if (entry.intersectionRatio > highestEntry.intersectionRatio) {
              highestEntry = entry;
            }
          });
          
          const letter = highestEntry.target.getAttribute('data-letter');
          if (letter && letter !== activeLetter) {
            setActiveLetter(letter);
          }
        }
      },
      {
        rootMargin: '-100px 0px -300px 0px',
        threshold: [0.1, 0.5, 0.9]
      }
    );
    
    // Observe all letter section headers
    Object.entries(letterRefs.current).forEach(([letter, ref]) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [alphabeticalLetters, letterRefs.current]);

  // Generate content for a specific university
  const handleGenerateContent = async (universityId: string, universityName: string) => {
    setGeneratingContentFor(universityId);
    toast.info(`Generating content for ${universityName}...`);
    
    try {
      const content = await generateUniversityContent(universityName);
      if (content) {
        // Update the content in the database
        const { data, error } = await supabase.from('universities_content').upsert({
          id: universityId,
          name: universityName,
          overview: content.overview || "",
          admission_stats: content.admissionStats || "",
          application_requirements: content.applicationRequirements || "",
          alumni_insights: content.alumniInsights || ""
        });
        
        if (error) {
          throw error;
        }
        
        toast.success(`Generated and saved content for ${universityName}`);
      } else {
        toast.error(`Failed to generate content for ${universityName}`);
      }
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast.error(`Error generating content: ${error.message || "Unknown error"}`);
    } finally {
      setGeneratingContentFor(null);
    }
  };

  // Render university logo component
  const renderUniversityLogo = (universityId: string, universityName: string) => {
    const logo = universityLogos[universityId];
    
    if (logo) {
      return (
        <img 
          src={logo} 
          alt={`${universityName} logo`}
          className="h-16 w-16 object-contain"
        />
      );
    }
    
    return (
      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
        <DefaultLogo name={universityName} className="h-8 w-8 text-slate-500" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Undergraduate Admissions Insights | AlumniSights</title>
        <meta name="description" content="Learn about undergraduate admission processes and strategies" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-garamond font-bold text-navy mb-4">
              Undergraduate Admissions Insights
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Expert advice and insights on undergraduate admissions processes at top universities
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </motion.div>

          <div className="flex gap-6">
            {/* Alphabetical navigation sidebar */}
            <AlphabeticalNav 
              letters={alphabeticalLetters} 
              onLetterClick={scrollToLetter}
              activeLetter={activeLetter} 
            />

            {/* Main content area with universities */}
            <div className="flex-1">
              {alphabeticalLetters.map((letter) => (
                <motion.div 
                  key={letter}
                  ref={el => letterRefs.current[letter] = el}
                  data-letter={letter}
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-garamond font-bold text-navy mb-4 px-2 border-l-4 border-blue-500">{letter}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {universitiesByLetter[letter]?.map((university) => (
                      <motion.div 
                        key={university.id}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="overflow-hidden border shadow hover:shadow-md h-full">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Link
                              to={`/insights/undergraduate-admissions/${university.id}`}
                              className="block w-full transform transition-transform hover:scale-105 focus:outline-none"
                            >
                              <motion.div 
                                className="mb-3 h-16 w-16 flex items-center justify-center mx-auto"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                {renderUniversityLogo(university.id, university.name)}
                              </motion.div>
                              <h3 className="font-medium font-garamond text-navy">
                                {university.name}
                              </h3>
                            </Link>
                            
                            {isAdmin && (
                              <div className="mt-3 w-full">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full"
                                  disabled={generatingContentFor === university.id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleGenerateContent(university.id, university.name);
                                  }}
                                >
                                  {generatingContentFor === university.id ? "Generating..." : "Generate AI Content"}
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UndergraduateAdmissions;
