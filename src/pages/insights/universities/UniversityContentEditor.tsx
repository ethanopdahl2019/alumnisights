
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
import { getUniversityContent } from "@/services/landing-page";

const UniversityContentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [universityData, setUniversityData] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Check if the university exists in our static data
  const universityInfo = id ? universities.find(uni => uni.id === id) : null;
  
  // Check admin status (just for UI display)
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setAuthChecked(true);
        return;
      }
      
      // Get role from user metadata
      const isUserAdmin = user.user_metadata?.role === 'admin';
      console.log("User metadata:", user.user_metadata);
      console.log("Is admin from metadata:", isUserAdmin);
      
      setIsAdmin(isUserAdmin);
      setAuthChecked(true);
      
      if (!isUserAdmin) {
        // Just display a warning, but don't block access
        toast("Note: You're not logged in as an admin", {
          description: "Changes will still be saved"
        });
      }
    };
    
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading]);
  
  // Handle authentication redirects
  useEffect(() => {
    if (!loading && !user && authChecked) {
      toast.error("Please sign in to access this page");
      navigate(`/auth?redirect=/insights/university-content-editor/${id || ''}`);
    }
  }, [user, loading, authChecked, id, navigate]);

  // Load university content
  useEffect(() => {
    const loadContent = async () => {
      if (!id) {
        setIsLoadingContent(false);
        return;
      }

      try {
        const content = await getUniversityContent(id);
        setUniversityData(content || universityInfo);
      } catch (error) {
        console.error("Failed to load university content:", error);
        toast.error("Failed to load university content");
      } finally {
        setIsLoadingContent(false);
      }
    };

    if (authChecked && user) {
      loadContent();
    } else if (authChecked) {
      setIsLoadingContent(false);
    }
  }, [id, universityInfo, authChecked, user]);

  if (loading || (isLoadingContent && authChecked && user)) {
    return <UniversityContentLoading />;
  }

  if (authChecked && !user) {
    return <AccessDenied message="You need to be logged in to access this page" />;
  }

  const universityName = universityData?.name || universityInfo?.name;

  if (!id || !universityName) {
    return <AccessDenied message="University not found" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{universityData ? `Edit ${universityName}` : "Add New University"} | AlumniSights</title>
        <meta name="description" content="Manage university content for undergraduate admissions" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-8">
            {universityData ? `Edit ${universityName}` : "Add New University"}
          </h1>

          <Card>
            <CardContent className="pt-6">
              <UniversityContentForm 
                id={id} 
                universityName={universityName} 
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
