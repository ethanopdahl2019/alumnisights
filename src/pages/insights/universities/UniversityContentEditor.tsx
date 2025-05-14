
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { universities } from "./universities-data";
import UniversityContentLoading from "./components/UniversityContentLoading";
import AccessDenied from "./components/AccessDenied";
import UniversityContentForm from "./components/UniversityContentForm";
import UniversityContentGenerator from "./components/UniversityContentGenerator";
import { getUniversityContent } from "@/services/landing-page";
import { Wand2 } from "lucide-react";

const UniversityContentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [universityData, setUniversityData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("edit");
  
  // Check if the university exists in our static data
  const universityInfo = id ? universities.find(uni => uni.id === id) : null;
  
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

    loadContent();
  }, [id, universityInfo]);

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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-navy">
              {universityData ? `Edit ${universityName}` : "Add New University"}
            </h1>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/insights/universities/content-manager")}
            >
              Back to Manager
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="edit">Manual Edit</TabsTrigger>
                <TabsTrigger value="ai">
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Generator
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="edit" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <UniversityContentForm 
                    id={id} 
                    universityName={universityName} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0">
              <UniversityContentGenerator
                universityId={id}
                universityName={universityName}
                onComplete={() => {
                  setActiveTab("edit");
                  toast.info("AI-generated content saved. You can now edit it manually if needed.");
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UniversityContentEditor;
