
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface School {
  id: string;
  name: string;
  image?: string | null;
  location?: string | null;
}

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        // Placeholder for actual API call
        const response = await fetch('/api/schools');
        const data = await response.json();
        setSchools(data);
      } catch (error) {
        console.error("Failed to fetch schools:", error);
        // Use placeholder data as fallback
        setSchools([
          { id: "harvard", name: "Harvard University", location: "Cambridge, MA" },
          { id: "stanford", name: "Stanford University", location: "Stanford, CA" },
          { id: "mit", name: "Massachusetts Institute of Technology", location: "Cambridge, MA" },
          { id: "yale", name: "Yale University", location: "New Haven, CT" },
          { id: "princeton", name: "Princeton University", location: "Princeton, NJ" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const filteredSchools = searchTerm
    ? schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : schools;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Schools | AlumniSights</title>
        <meta name="description" content="Browse universities and colleges on AlumniSights" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Schools</h1>
          
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col items-center p-4">
                  <div className="rounded-full bg-gray-200 h-16 w-16 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <Link 
                    key={school.id}
                    to={`/schools/${school.id}`}
                    className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="h-16 flex items-center justify-center mb-3">
                      {school.image ? (
                        <img 
                          src={school.image} 
                          alt={`${school.name} logo`}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-slate-500" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-center">
                      {school.name}
                    </h3>
                  </Link>
                ))
              ) : (
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
