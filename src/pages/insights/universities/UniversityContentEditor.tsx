
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { universities } from "./universities-data";
import UniversityContentLoading from "./components/UniversityContentLoading";
import AccessDenied from "./components/AccessDenied";
import UniversityContentForm from "./components/UniversityContentForm";

const UniversityContentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  // Find university if editing existing one
  const universityData = id ? universities.find(uni => uni.id === id) : null;

  useEffect(() => {
    setIsLoadingContent(false);
  }, [id]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      // Check if the user has admin role in metadata
      const isUserAdmin = user.user_metadata?.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin) {
        toast.error("You don't have permission to access this page");
      }
    };
    
    if (!loading) {
      if (!user) {
        toast.error("Please sign in to access this page");
      } else {
        checkAdminStatus();
      }
    }
  }, [user, loading]);

  if (loading || isLoadingContent) {
    return <UniversityContentLoading />;
  }

  if (!user || !isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{universityData ? `Edit ${universityData.name}` : "Add New University"} | AlumniSights</title>
        <meta name="description" content="Manage university content for undergraduate admissions" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-8">
            {universityData ? `Edit ${universityData.name}` : "Add New University"}
          </h1>

          <Card>
            <CardContent className="pt-6">
              <UniversityContentForm 
                id={id} 
                universityName={universityData?.name} 
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UniversityContentEditor;
