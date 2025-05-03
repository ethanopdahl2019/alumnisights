import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { universities } from "./universities-data";
import DefaultLogo from "./DefaultLogo";
import { Edit, Plus, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

const UniversityContentManager: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      // Check if user has admin role in metadata
      const isUserAdmin = user.user_metadata?.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin) {
        toast.error("You don't have permission to access this page");
        navigate('/');
      }
    };
    
    if (!loading) {
      if (!user) {
        toast.error("Please sign in to access this page");
        navigate('/auth');
        return;
      }
      
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  const handleDeleteUniversity = (id: string, name: string) => {
    // In a real app, you would delete from the database
    // For now, we'll just show a success toast
    toast.success(`Deleted ${name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-navy">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container-custom py-12">
          <div className="max-w-6xl mx-auto text-center">
            <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-navy mb-4">Access Denied</h1>
            <p className="mb-6">You need to be signed in as an administrator to access this page.</p>
            <Button onClick={() => navigate("/auth")}>
              Go to Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
