
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import AccessDenied from "./components/AccessDenied";
import { universities } from "./universities-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UniversityContentGenerator from "./components/UniversityContentGenerator";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UniversityBulkContentGenerator: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  
  if (!user || !isAdmin) {
    return <AccessDenied message="Only administrators can access this page" />;
  }
  
  // Filter universities based on search term
  const filteredUniversities = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10); // Limit results for performance
  
  const selectedUniversityData = universities.find(uni => uni.id === selectedUniversity);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>University Content Generator | AlumniSights</title>
        <meta name="description" content="Generate content for university pages" />
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
                University Content Generator
              </h1>
              <p className="text-gray-600">
                Use AI to automatically generate content for university pages
              </p>
            </div>
            <Button
              onClick={() => navigate("/insights/universities/content-manager")} 
              variant="outline"
            >
              Back to Content Manager
            </Button>
          </div>
          
          {!selectedUniversityData ? (
            <Card>
              <CardContent className="pt-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for a university..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-lg font-medium mb-2">Select a university:</h2>
                  
                  {filteredUniversities.length > 0 ? (
                    <div className="grid gap-2">
                      {filteredUniversities.map((university) => (
                        <div
                          key={university.id}
                          className="p-3 border rounded hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          onClick={() => setSelectedUniversity(university.id)}
                        >
                          <span>{university.name}</span>
                          <Button variant="ghost" size="sm">
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No universities found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Button
                variant="ghost" 
                onClick={() => setSelectedUniversity(null)}
                className="mb-4"
              >
                ← Back to university selection
              </Button>
              
              <h2 className="text-2xl font-bold mb-6">
                Generate content for {selectedUniversityData.name}
              </h2>
              
              <UniversityContentGenerator
                universityId={selectedUniversityData.id}
                universityName={selectedUniversityData.name}
                onComplete={() => navigate(`/insights/undergraduate-admissions/${selectedUniversityData.id}`)}
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversityBulkContentGenerator;
