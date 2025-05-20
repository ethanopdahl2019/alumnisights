import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DefaultLogo from "./universities/DefaultLogo";
import { getUniversitiesByLetter } from "./universities/universities-data";
import { getUniversityLogo } from "@/services/landing-page";
import { useAuth } from "@/components/AuthProvider";
import { generateUniversityContent } from "@/services/ai/generateUniversityContent";
import { toast } from "sonner";
import { Loader2, Wand } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UndergraduateAdmissions = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [universityLogos, setUniversityLogos] = useState<Record<string, string | null>>({});
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const [generatingContentFor, setGeneratingContentFor] = useState<string | null>(null);
  const [universitiesList, setUniversitiesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  // Fetch university data with memoization to improve performance
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const universities = await getUniversitiesByLetter();
        
        // Convert the object of arrays into a single array of universities
        const allUniversities = Object.values(universities).flat();
        
        // Sort alphabetically by name
        allUniversities.sort((a, b) => a.name.localeCompare(b.name));
        
        setUniversitiesList(allUniversities);
      } catch (error) {
        console.error("Failed to fetch university data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Batch logo fetching for better performance
  useEffect(() => {
    const fetchUniversityLogos = async () => {
      if (universitiesList.length === 0) return;
      
      setIsLoadingLogos(true);
      const logosMap: Record<string, string | null> = {};
      
      try {
        // Process logos in smaller batches to prevent overwhelming the network
        const batchSize = 10;
        for (let i = 0; i < universitiesList.length; i += batchSize) {
          const batch = universitiesList.slice(i, i + batchSize);
          const batchPromises = batch.map(async (university) => {
            try {
              const logo = await getUniversityLogo(university.id);
              return { id: university.id, logo };
            } catch (error) {
              console.error(`Failed to fetch logo for ${university.name}:`, error);
              return { id: university.id, logo: null };
            }
          });
          
          const results = await Promise.all(batchPromises);
          
          results.forEach(result => {
            logosMap[result.id] = result.logo;
          });
          
          // Update logos incrementally as they load
          setUniversityLogos(prev => ({...prev, ...logosMap}));
        }
      } catch (error) {
        console.error('Failed to fetch university logos:', error);
      } finally {
        setIsLoadingLogos(false);
      }
    };
    
    fetchUniversityLogos();
  }, [universitiesList]);

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
      toast.error(`Error generating content: ${(error as Error).message || "Unknown error"}`);
    } finally {
      setGeneratingContentFor(null);
    }
  };

  // Render university logo component - memoized for performance
  const renderUniversityLogo = (universityId: string, universityName: string) => {
    const logo = universityLogos[universityId];
    
    if (logo) {
      return (
        <img 
          src={logo} 
          alt={`${universityName} logo`}
          className="h-16 w-16 object-contain"
          loading="lazy"
        />
      );
    }
    
    return (
      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
        <DefaultLogo name={universityName} className="h-8 w-8 text-slate-500" />
      </div>
    );
  };

  // Filter universities based on search term
  const filteredUniversities = searchTerm
    ? universitiesList.filter(uni => 
        uni.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : universitiesList;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container-custom py-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Undergraduate Admissions Insights
              </h1>
              <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-200 rounded-full h-16 w-16 mb-3"></div>
                    <div className="bg-gray-200 h-5 w-32 rounded mb-2"></div>
                  </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUniversities.map((university) => (
              <div key={university.id} className="flex justify-center">
                <Link
                  to={`/insights/undergraduate-admissions/${university.id}`}
                  className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="mb-3 h-16 w-16 flex items-center justify-center">
                    {renderUniversityLogo(university.id, university.name)}
                  </div>
                  <h3 className="font-medium text-center text-navy">
                    {university.name}
                  </h3>
                  
                  {isAdmin && (
                    <div className="mt-3 w-full">
                      <button 
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                        disabled={generatingContentFor === university.id}
                        onClick={(e) => {
                          e.preventDefault();
                          handleGenerateContent(university.id, university.name);
                        }}
                      >
                        {generatingContentFor === university.id ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Wand className="h-3 w-3" />
                            <span>Generate AI Content</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UndergraduateAdmissions;
