
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
import { Wand, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UndergraduateAdmissions = () => {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const [generatingContentFor, setGeneratingContentFor] = useState<string | null>(null);
  const [alphabeticalLetters, setAlphabeticalLetters] = useState<string[]>([]);
  const [universitiesByLetter, setUniversitiesByLetter] = useState<Record<string, any[]>>({});
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { isAdmin } = useAuth();
  
  // Fetch university data
  useEffect(() => {
    const fetchData = async () => {
      const letters = await getAlphabeticalLetters();
      const universities = await getUniversitiesByLetter();
      
      setAlphabeticalLetters(letters);
      setUniversitiesByLetter(universities);
      
      // Set initial active letter to the first one
      if (letters.length > 0 && !activeLetter) {
        setActiveLetter(letters[0]);
      }
    };
    
    fetchData();
  }, []);
  
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
    
    if (Object.keys(universitiesByLetter).length > 0) {
      fetchUniversityLogos();
    }
  }, [universitiesByLetter]);
  
  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    if (letterRefs.current[letter]) {
      letterRefs.current[letter]?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };
  
  useEffect(() => {
    // Setup intersection observer to update active letter on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const letter = entry.target.getAttribute('data-letter');
          if (letter) setActiveLetter(letter);
        }
      });
    }, { threshold: 0.5 });
    
    // Observe all letter section headers
    Object.values(letterRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [alphabeticalLetters.length]);

  // Generate content for a specific university
  const handleGenerateContent = async (universityId: string, universityName: string) => {
    setGeneratingContentFor(universityId);
    toast.info(`Generating content for ${universityName}...`);
    
    try {
      // Generate overview
      const overview = await generateUniversityContent(universityName, "overview");
      
      if (overview) {
        // Update the content in the database
        const { data, error } = await supabase.from('universities_content').upsert({
          id: universityId,
          name: universityName,
          overview: overview.overview || "",
          updated_at: new Date().toISOString()
        });
        
        if (error) {
          throw error;
        }
        
        // Generate admission stats
        const admissionStats = await generateUniversityContent(universityName, "admissionStats");
        if (admissionStats) {
          await supabase.from('universities_content').update({
            admission_stats: admissionStats.admissionStats || "",
            updated_at: new Date().toISOString()
          }).eq('id', universityId);
        }
        
        // Generate application requirements
        const appReqs = await generateUniversityContent(universityName, "applicationRequirements");
        if (appReqs) {
          await supabase.from('universities_content').update({
            application_requirements: appReqs.applicationRequirements || "",
            updated_at: new Date().toISOString()
          }).eq('id', universityId);
        }
        
        // Generate alumni insights
        const alumniInsights = await generateUniversityContent(universityName, "alumniInsights");
        if (alumniInsights) {
          await supabase.from('universities_content').update({
            alumni_insights: alumniInsights.alumniInsights || "",
            updated_at: new Date().toISOString()
          }).eq('id', universityId);
        }
        
        toast.success(`Generated and saved content for ${universityName}`);
      } else {
        toast.error(`Failed to generate content for ${universityName}`);
      }
    } catch (error) {
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
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Undergraduate Admissions Insights
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Expert advice and insights on undergraduate admissions processes at top universities
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>

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
                <div 
                  key={letter}
                  ref={el => letterRefs.current[letter] = el}
                  data-letter={letter}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold text-navy mb-4 px-2 border-l-4 border-blue-500">{letter}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {universitiesByLetter[letter]?.map((university) => (
                      <Card key={university.id} className="overflow-hidden border shadow hover:shadow-md h-full">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                          <Link
                            to={`/insights/undergraduate-admissions/${university.id}`}
                            className="block w-full transform transition-transform hover:scale-105 focus:outline-none"
                          >
                            <div className="mb-3 h-16 w-16 flex items-center justify-center mx-auto">
                              {renderUniversityLogo(university.id, university.name)}
                            </div>
                            <h3 className="font-medium text-navy">
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
                                {generatingContentFor === university.id ? (
                                  <>
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Wand className="h-3 w-3 mr-1" />
                                    Generate AI Content
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
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
