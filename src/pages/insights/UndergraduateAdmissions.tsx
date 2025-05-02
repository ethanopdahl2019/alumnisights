
import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { University, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const UndergraduateAdmissions = () => {
  // Refs for each letter section to enable smooth scrolling
  const sectionRefs = {
    A: useRef<HTMLDivElement>(null),
    B: useRef<HTMLDivElement>(null),
    C: useRef<HTMLDivElement>(null),
    D: useRef<HTMLDivElement>(null),
    E: useRef<HTMLDivElement>(null),
    F: useRef<HTMLDivElement>(null),
    G: useRef<HTMLDivElement>(null),
    H: useRef<HTMLDivElement>(null),
    I: useRef<HTMLDivElement>(null),
    J: useRef<HTMLDivElement>(null),
    K: useRef<HTMLDivElement>(null),
    L: useRef<HTMLDivElement>(null),
    M: useRef<HTMLDivElement>(null),
    N: useRef<HTMLDivElement>(null),
    O: useRef<HTMLDivElement>(null),
    P: useRef<HTMLDivElement>(null),
    Q: useRef<HTMLDivElement>(null),
    R: useRef<HTMLDivElement>(null),
    S: useRef<HTMLDivElement>(null),
    T: useRef<HTMLDivElement>(null),
    U: useRef<HTMLDivElement>(null),
    V: useRef<HTMLDivElement>(null),
    W: useRef<HTMLDivElement>(null),
    X: useRef<HTMLDivElement>(null),
    Y: useRef<HTMLDivElement>(null),
    Z: useRef<HTMLDivElement>(null),
  };

  // Larger, alphabetically sorted list of universities
  const universities = [
    // A
    { id: "amherst", name: "Amherst College", letter: "A" },
    { id: "arizona", name: "Arizona State University", letter: "A" },
    // B
    { id: "boston", name: "Boston College", letter: "B" },
    { id: "brown", name: "Brown University", letter: "B" },
    { id: "berkeley", name: "UC Berkeley", letter: "B" },
    // C
    { id: "caltech", name: "California Institute of Technology", letter: "C" },
    { id: "carnegie", name: "Carnegie Mellon University", letter: "C" },
    { id: "chicago", name: "University of Chicago", letter: "C" },
    { id: "columbia", name: "Columbia University", letter: "C" },
    { id: "cornell", name: "Cornell University", letter: "C" },
    // D
    { id: "dartmouth", name: "Dartmouth College", letter: "D" },
    { id: "duke", name: "Duke University", letter: "D" },
    // E
    { id: "emory", name: "Emory University", letter: "E" },
    // F
    { id: "florida", name: "University of Florida", letter: "F" },
    // G
    { id: "georgetown", name: "Georgetown University", letter: "G" },
    { id: "georgia", name: "University of Georgia", letter: "G" },
    // H
    { id: "harvard", name: "Harvard University", letter: "H" },
    // I
    { id: "illinois", name: "University of Illinois", letter: "I" },
    { id: "indiana", name: "Indiana University", letter: "I" },
    // J
    { id: "jhu", name: "Johns Hopkins University", letter: "J" },
    // M
    { id: "michigan", name: "University of Michigan", letter: "M" },
    { id: "mit", name: "Massachusetts Institute of Technology", letter: "M" },
    // N
    { id: "nyu", name: "New York University", letter: "N" },
    { id: "northwestern", name: "Northwestern University", letter: "N" },
    { id: "notredame", name: "University of Notre Dame", letter: "N" },
    // P
    { id: "princeton", name: "Princeton University", letter: "P" },
    { id: "penn", name: "University of Pennsylvania", letter: "P" },
    { id: "purdue", name: "Purdue University", letter: "P" },
    // R
    { id: "rice", name: "Rice University", letter: "R" },
    // S
    { id: "stanford", name: "Stanford University", letter: "S" },
    // T
    { id: "tufts", name: "Tufts University", letter: "T" },
    // U
    { id: "ucla", name: "UCLA", letter: "U" },
    { id: "usc", name: "University of Southern California", letter: "U" },
    // V
    { id: "vanderbilt", name: "Vanderbilt University", letter: "V" },
    { id: "virginia", name: "University of Virginia", letter: "V" },
    // W
    { id: "washington", name: "University of Washington", letter: "W" },
    { id: "wisconsin", name: "University of Wisconsin", letter: "W" },
    // Y
    { id: "yale", name: "Yale University", letter: "Y" },
  ];

  // Function to scroll to a section when clicking on a letter
  const scrollToSection = (letter: string) => {
    const ref = sectionRefs[letter as keyof typeof sectionRefs];
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Group universities by first letter
  const groupedUniversities = universities.reduce<Record<string, typeof universities>>(
    (groups, university) => {
      const letter = university.letter;
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(university);
      return groups;
    },
    {}
  );

  // Get all the unique letters that have universities
  const availableLetters = Object.keys(groupedUniversities).sort();

  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Side alphabet navigator */}
            <aside className="w-full md:w-16 md:sticky md:top-20 md:self-start h-fit">
              <nav className="bg-white rounded-lg shadow-sm border p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                <ScrollArea className="flex md:flex-col gap-1 md:h-[70vh]">
                  {Object.keys(sectionRefs).map((letter) => {
                    const isAvailable = availableLetters.includes(letter);
                    return (
                      <button
                        key={letter}
                        onClick={() => isAvailable && scrollToSection(letter)}
                        className={cn(
                          "w-8 h-8 rounded flex items-center justify-center transition-all duration-200 text-sm font-medium",
                          isAvailable
                            ? "hover:bg-blue-100 hover:text-blue-600 cursor-pointer"
                            : "text-gray-300 cursor-not-allowed"
                        )}
                        disabled={!isAvailable}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </ScrollArea>
              </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {availableLetters.map((letter) => (
                <div 
                  key={letter} 
                  ref={sectionRefs[letter as keyof typeof sectionRefs]}
                  className="mb-10"
                >
                  <div className="sticky top-16 z-10 bg-white py-2">
                    <h2 className="text-2xl font-bold text-navy border-b pb-2">{letter}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {groupedUniversities[letter].map((university) => (
                      <Link 
                        key={university.id}
                        to={`/insights/undergraduate-admissions/${university.id}`}
                        className="transform transition-transform hover:scale-105 focus:outline-none"
                      >
                        <Card className="overflow-hidden border shadow hover:shadow-md h-full">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="bg-blue-50 rounded-full p-4 mb-3">
                              <University className="h-6 w-6 text-blue-600" />
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
          
          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-navy text-white p-3 rounded-full shadow-lg hover:bg-navy/80 transition-all duration-300 z-20 animate-fade-in"
          >
            <ChevronUp className="h-5 w-5" />
            <span className="sr-only">Scroll to top</span>
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UndergraduateAdmissions;
