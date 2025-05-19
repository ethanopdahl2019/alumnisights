
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, BarChart3, Wand, Loader2, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getUniversities, University } from "@/services/universities";
import { supabase } from "@/integrations/supabase/client";
import { AdmissionStatsType } from "@/components/insights/AdmissionStats";
import { UniversityAdmissionStats } from "@/types/admission-stats";

interface UniversityWithStats extends University {
  acceptanceRate: number | null;
  averageSAT: number | null;
  averageACT: number | null;
  hasBeenUpdated?: boolean;
}

const AdmissionStatsManager = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [universities, setUniversities] = useState<UniversityWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [processingUniversityId, setProcessingUniversityId] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (user) {
      const isUserAdmin = user.user_metadata?.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin) {
        toast.error("You don't have permission to access this page");
        navigate('/');
      }
    } else if (!loading) {
      toast.error("Please sign in to access this page");
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
  // Fetch universities and stats
  useEffect(() => {
    const fetchUniversities = async () => {
      if (!isAdmin) return;
      
      setIsLoading(true);
      try {
        // Fetch universities
        const allUniversities = await getUniversities();
        
        // Fetch their statistics
        const { data: statsData, error: statsError } = await supabase
          .functions.invoke('get_admission_stats');
          
        if (statsError) {
          console.error("Error fetching stats:", statsError);
          throw statsError;
        }
        
        // Map stats to universities
        const statsMap: Record<string, AdmissionStatsType> = {};
        if (statsData) {
          statsData.forEach((stat: UniversityAdmissionStats) => {
            statsMap[stat.university_id] = {
              acceptanceRate: stat.acceptance_rate,
              averageSAT: stat.average_sat,
              averageACT: stat.average_act
            };
          });
        }
        
        // Combine university data with stats
        const universitiesWithStats = allUniversities.map(uni => ({
          ...uni,
          acceptanceRate: statsMap[uni.id]?.acceptanceRate || null,
          averageSAT: statsMap[uni.id]?.averageSAT || null,
          averageACT: statsMap[uni.id]?.averageACT || null,
        }));
        
        setUniversities(universitiesWithStats);
      } catch (error) {
        console.error("Failed to load universities:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUniversities();
  }, [isAdmin]);
  
  // Filter universities based on search
  const filteredUniversities = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Update a university's stats
  const updateStats = async (universityId: string, stats: AdmissionStatsType) => {
    try {
      setProcessingUniversityId(universityId);
      
      const { data, error } = await supabase.functions.invoke('update_admission_stats', {
        body: {
          university_id: universityId,
          acceptance_rate: stats.acceptanceRate,
          average_sat: stats.averageSAT,
          average_act: stats.averageACT
        }
      });
        
      if (error) throw error;
      
      // Update local state to show changes
      setUniversities(prevUniversities => 
        prevUniversities.map(uni => 
          uni.id === universityId 
            ? { 
                ...uni, 
                ...stats, 
                hasBeenUpdated: true 
              } 
            : uni
        )
      );
      
      // Show success animation temporarily
      setTimeout(() => {
        setUniversities(prevUniversities => 
          prevUniversities.map(uni => 
            uni.id === universityId 
              ? { ...uni, hasBeenUpdated: false } 
              : uni
          )
        );
      }, 3000);
      
      toast.success(`Updated stats for ${universities.find(uni => uni.id === universityId)?.name}`);
    } catch (error) {
      console.error("Error updating stats:", error);
      toast.error("Failed to update statistics");
    } finally {
      setProcessingUniversityId(null);
    }
  };

  // Automatically fill stats using AI
  const fillWithAI = async (universityId: string, universityName: string) => {
    try {
      setProcessingUniversityId(universityId);
      toast.info(`Looking up admissions data for ${universityName}...`);
      
      // Call the AI function to fetch admission stats
      const response = await fetch('/api/generate-admission-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          universityName,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to get admission statistics");
      }
      
      const stats = {
        acceptanceRate: result.acceptanceRate,
        averageSAT: result.averageSAT,
        averageACT: result.averageACT
      };
      
      // Update the database with these stats
      await updateStats(universityId, stats);
      
      toast.success(`Successfully retrieved statistics for ${universityName}`);
    } catch (error) {
      console.error("Error fetching stats with AI:", error);
      toast.error(`Couldn't fetch data for ${universityName}: ${(error as Error).message}`);
    } finally {
      setProcessingUniversityId(null);
    }
  };
  
  // Handle input change for university stats
  const handleStatsChange = (universityId: string, field: keyof AdmissionStatsType, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    
    setUniversities(prevUniversities => 
      prevUniversities.map(uni => 
        uni.id === universityId 
          ? { ...uni, [field]: numValue } 
          : uni
      )
    );
  };

  if (loading || !isAdmin || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Admission Statistics Manager | AlumniSights</title>
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-navy">Admission Statistics Manager</h1>
            <Button onClick={() => navigate('/admin/dashboard')}>
              Back to Admin Dashboard
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>University Admission Statistics</CardTitle>
              <CardDescription>
                Manage acceptance rates, SAT and ACT scores for universities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <Search className="mr-2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">University</TableHead>
                      <TableHead className="text-center">Acceptance Rate (%)</TableHead>
                      <TableHead className="text-center">Average SAT (400-1600)</TableHead>
                      <TableHead className="text-center">Average ACT (1-36)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUniversities.length > 0 ? (
                      filteredUniversities.map((university) => (
                        <TableRow key={university.id}>
                          <TableCell className="font-medium">
                            {university.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-24 text-center"
                                value={university.acceptanceRate === null ? "" : university.acceptanceRate}
                                onChange={(e) => handleStatsChange(university.id, "acceptanceRate", e.target.value)}
                                placeholder="0-100"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                min="400"
                                max="1600"
                                step="10"
                                className="w-24 text-center"
                                value={university.averageSAT === null ? "" : university.averageSAT}
                                onChange={(e) => handleStatsChange(university.id, "averageSAT", e.target.value)}
                                placeholder="400-1600"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                min="1"
                                max="36"
                                step="0.1"
                                className="w-24 text-center"
                                value={university.averageACT === null ? "" : university.averageACT}
                                onChange={(e) => handleStatsChange(university.id, "averageACT", e.target.value)}
                                placeholder="1-36"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {university.hasBeenUpdated ? (
                              <span className="inline-flex items-center text-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Updated
                              </span>
                            ) : (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  disabled={processingUniversityId === university.id}
                                  onClick={() => {
                                    const stats = {
                                      acceptanceRate: university.acceptanceRate,
                                      averageSAT: university.averageSAT,
                                      averageACT: university.averageACT
                                    };
                                    updateStats(university.id, stats);
                                  }}
                                >
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  disabled={processingUniversityId === university.id}
                                  onClick={() => fillWithAI(university.id, university.name)}
                                >
                                  {processingUniversityId === university.id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <Wand className="w-4 h-4 mr-1" />
                                      Fill with AI
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No universities found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdmissionStatsManager;
