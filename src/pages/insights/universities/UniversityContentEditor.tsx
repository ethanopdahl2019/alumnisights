
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { getAllUniversities, UniversityData } from "./universities-data";
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
  const [authChecked, setAuthChecked] = useState<boolean>(true); // Set to true by default now
  const [allUniversities, setAllUniversities] = useState<UniversityData[]>([]);

  // Load all universities 
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const universities = await getAllUniversities();
        setAllUniversities(universities);
      } catch (error) {
        console.error("Failed to load universities:", error);
      }
    };
    
    loadUniversities();
  }, []);
  
  // Check if the university exists in our data
  const universityInfo = id ? allUniversities.find(uni => uni.id === id) : null;
  
  // Check if user is admin - just for UI display purposes, not for access control
  useEffect(() => {
    if (user) {
      // Get role from user metadata
      const isUserAdmin = user.user_metadata?.role === 'admin';
      setIsAdmin(isUserAdmin);
    }
  }, [user]);
  
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

    if (id && universityInfo) {
      loadContent();
    } else if (id && allUniversities.length > 0) {
      loadContent();
    } else if (!id) {
      setIsLoadingContent(false);
    }
  }, [id, universityInfo, allUniversities]);

  if (loading || isLoadingContent) {
    return <UniversityContentLoading />;
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
