
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileCheck, School, BookOpen, Users, Activity, ChartBar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccessDenied from "../insights/universities/components/AccessDenied";
import { isAdmin } from "@/services/auth";

interface ContentStats {
  totalSchools: number;
  schoolsWithLogos: number;
  schoolsWithContent: number;
  schoolsWithDidYouKnow: number;
  totalPages: number;
  pagesWithContent: number;
}

const ContentProgress = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<ContentStats>({
    totalSchools: 0,
    schoolsWithLogos: 0,
    schoolsWithContent: 0,
    schoolsWithDidYouKnow: 0,
    totalPages: 0,
    pagesWithContent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("universities");

  useEffect(() => {
    const fetchContentStats = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Get universities stats
        const { data: universities, error: univError } = await supabase
          .from('universities')
          .select('id, name')
        
        if (univError) throw univError;
        
        const totalSchools = universities?.length || 0;
        
        // Get universities with content
        const { data: uniContent, error: contentError } = await supabase
          .from('universities_content')
          .select('id, name, overview, logo, did_you_know');
          
        if (contentError) throw contentError;
        
        const schoolsWithLogos = uniContent?.filter(uni => uni.logo).length || 0;
        const schoolsWithContent = uniContent?.filter(uni => uni.overview && uni.overview.length > 100).length || 0;
        const schoolsWithDidYouKnow = uniContent?.filter(uni => uni.did_you_know).length || 0;
        
        // Calculate total insight pages (4 types of content pages: undergraduate, graduate, industry, clubs)
        const totalPages = 4;
        
        // For now, hardcode that only undergraduate admissions is complete
        const pagesWithContent = 1;
        
        setStats({
          totalSchools,
          schoolsWithLogos,
          schoolsWithContent,
          schoolsWithDidYouKnow,
          totalPages,
          pagesWithContent,
        });
        
      } catch (error) {
        console.error("Error fetching content stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!loading && user) {
      fetchContentStats();
    }
  }, [user, loading]);
  
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-navy">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !isAdmin(user)) {
    return <AccessDenied message="You don't have permission to access this page" />;
  }
  
  // Calculate percentages
  const logoPercentage = Math.round((stats.schoolsWithLogos / stats.totalSchools) * 100) || 0;
  const contentPercentage = Math.round((stats.schoolsWithContent / stats.totalSchools) * 100) || 0;
  const didYouKnowPercentage = Math.round((stats.schoolsWithDidYouKnow / stats.totalSchools) * 100) || 0;
  const insightPagesPercentage = Math.round((stats.pagesWithContent / stats.totalPages) * 100) || 0;
  
  // Calculate overall progress
  const overallProgress = Math.round(
    (logoPercentage + contentPercentage + didYouKnowPercentage + insightPagesPercentage) / 4
  );

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Content Progress | Admin Dashboard</title>
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-navy">Content Progress</h1>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <FileCheck className="text-blue-600 h-5 w-5" />
              <span className="font-medium text-blue-800">Overall: {overallProgress}% Complete</span>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Overall Content Progress</CardTitle>
              <CardDescription>
                Combined progress across all content areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-medium">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">University Logos</span>
                      </div>
                      <span className="text-sm">{stats.schoolsWithLogos}/{stats.totalSchools} ({logoPercentage}%)</span>
                    </div>
                    <Progress value={logoPercentage} className="h-2 mb-4" />
                    
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">University Content</span>
                      </div>
                      <span className="text-sm">{stats.schoolsWithContent}/{stats.totalSchools} ({contentPercentage}%)</span>
                    </div>
                    <Progress value={contentPercentage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium">"Did You Know" Facts</span>
                      </div>
                      <span className="text-sm">{stats.schoolsWithDidYouKnow}/{stats.totalSchools} ({didYouKnowPercentage}%)</span>
                    </div>
                    <Progress value={didYouKnowPercentage} className="h-2 mb-4" />
                    
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Insight Pages</span>
                      </div>
                      <span className="text-sm">{stats.pagesWithContent}/{stats.totalPages} ({insightPagesPercentage}%)</span>
                    </div>
                    <Progress value={insightPagesPercentage} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="universities">Universities</TabsTrigger>
              <TabsTrigger value="insights">Insight Pages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="universities">
              <Card>
                <CardHeader>
                  <CardTitle>University Content</CardTitle>
                  <CardDescription>
                    Progress of university-specific content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-blue-800">{stats.schoolsWithLogos}</div>
                        <p className="text-sm text-blue-600">Universities with Logos</p>
                        <div className="mt-2">
                          <Progress value={logoPercentage} className="h-1.5" />
                          <p className="text-xs mt-1">{logoPercentage}% Complete</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-6 rounded-lg text-center">
                        <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-green-800">{stats.schoolsWithContent}</div>
                        <p className="text-sm text-green-600">Universities with Content</p>
                        <div className="mt-2">
                          <Progress value={contentPercentage} className="h-1.5" />
                          <p className="text-xs mt-1">{contentPercentage}% Complete</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-6 rounded-lg text-center">
                        <Activity className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-amber-800">{stats.schoolsWithDidYouKnow}</div>
                        <p className="text-sm text-amber-600">"Did You Know" Facts</p>
                        <div className="mt-2">
                          <Progress value={didYouKnowPercentage} className="h-1.5" />
                          <p className="text-xs mt-1">{didYouKnowPercentage}% Complete</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Remaining Tasks</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span>Add university logos</span>
                          <span className="font-medium">{stats.totalSchools - stats.schoolsWithLogos} remaining</span>
                        </li>
                        <li className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span>Complete university content</span>
                          <span className="font-medium">{stats.totalSchools - stats.schoolsWithContent} remaining</span>
                        </li>
                        <li className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span>Add "Did You Know" facts</span>
                          <span className="font-medium">{stats.totalSchools - stats.schoolsWithDidYouKnow} remaining</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle>Insight Pages</CardTitle>
                  <CardDescription>
                    Progress of insight page development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-purple-50 p-6 rounded-lg text-center mb-6">
                      <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-purple-800">{stats.pagesWithContent}</div>
                      <p className="text-sm text-purple-600">Completed Insight Pages</p>
                      <div className="mt-2">
                        <Progress value={insightPagesPercentage} className="h-1.5" />
                        <p className="text-xs mt-1">{insightPagesPercentage}% Complete</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <ChartBar className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Undergraduate Admissions</span>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Complete</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <ChartBar className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Graduate Admissions</span>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">In Progress</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <ChartBar className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Industry Insights</span>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">In Progress</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <ChartBar className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Clubs & Greek Life</span>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">In Progress</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContentProgress;
