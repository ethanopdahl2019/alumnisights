
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { universities } from "./universities-data";
import DefaultLogo from "./DefaultLogo";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const UniversityContentManager: React.FC = () => {
  const navigate = useNavigate();

  const handleDeleteUniversity = (id: string, name: string) => {
    // In a real app, you would delete from the database
    // For now, we'll just show a success toast
    toast.success(`Deleted ${name}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>University Content Manager | AlumniSights</title>
        <meta name="description" content="Manage university content for undergraduate admissions" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-navy">
              University Content Manager
            </h1>
            <Button onClick={() => navigate("/insights/university-content-editor")}>
              <Plus className="h-4 w-4 mr-2" /> Add University
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <Card key={university.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      {university.logo && university.logo.startsWith("/lovable-uploads") ? (
                        <img 
                          src={university.logo} 
                          alt={`${university.name} logo`}
                          className="h-12 w-12 object-contain"
                        />
                      ) : (
                        <DefaultLogo name={university.name} className="h-12 w-12" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{university.name}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/insights/university-content-editor/${university.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteUniversity(university.id, university.name)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                    <Link 
                      to={`/insights/undergraduate-admissions/${university.id}`} 
                      className="ml-auto text-sm text-blue-600 hover:underline"
                    >
                      View page
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UniversityContentManager;
