
import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import AlphabeticalNav from "@/components/AlphabeticalNav";
import DefaultLogo from "./universities/DefaultLogo";
import { getAlphabeticalLetters, getUniversitiesByLetter } from "./universities/universities-data";

const UndergraduateAdmissions = () => {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const alphabeticalLetters = getAlphabeticalLetters();
  const universitiesByLetter = getUniversitiesByLetter();
  
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
    // Set initial active letter to the first one
    if (alphabeticalLetters.length > 0 && !activeLetter) {
      setActiveLetter(alphabeticalLetters[0]);
    }
    
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
                      <Link
                        key={university.id}
                        to={`/insights/undergraduate-admissions/${university.id}`}
                        className="transform transition-transform hover:scale-105 focus:outline-none"
                      >
                        <Card className="overflow-hidden border shadow hover:shadow-md h-full">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="mb-3">
                              {university.logo && university.logo.startsWith("/lovable-uploads") ? (
                                <img 
                                  src={university.logo} 
                                  alt={`${university.name} logo`}
                                  className="h-16 w-16 object-contain"
                                />
                              ) : (
                                <DefaultLogo name={university.name} className="h-16 w-16" />
                              )}
                            </div>
                            <h3 className="font-medium text-navy">
                              {university.name}
                            </h3>
                          </CardContent>
                        </Card>
                      </Link>
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
