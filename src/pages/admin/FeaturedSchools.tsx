
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { isAdmin } from "@/services/auth";
import { toast } from "sonner";
import { getUniversities, University } from "@/services/universities";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

const FeaturedSchoolsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<University[]>([]);
  const [featuredSchools, setFeaturedSchools] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!loading) {
      if (!user) {
        toast.error("Please sign in to access this page");
        navigate('/auth');
        return;
      }
      
      if (!isAdmin(user)) {
        toast.error("You don't have permission to access this page");
        navigate('/');
        return;
      }
    }
  }, [user, loading, navigate]);

  // Load universities
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allUniversities = await getUniversities();
        setUniversities(allUniversities);
        
        // Fetch currently featured schools
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'featured_schools')
          .single();
        
        if (data) {
          setFeaturedSchools(JSON.parse(data.value || '[]'));
        } else {
          console.log("No featured schools found, starting with empty list");
          setFeaturedSchools([]);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load universities");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && !loading && isAdmin(user)) {
      fetchData();
    }
  }, [user, loading]);

  const handleToggleFeature = (id: string) => {
    setFeaturedSchools(current => {
      if (current.includes(id)) {
        return current.filter(schoolId => schoolId !== id);
      } else {
        return [...current, id];
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      
      // Check if the setting already exists
      const { data: existingData, error: checkError } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'featured_schools')
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // Error other than "no rows returned"
        throw checkError;
      }
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('site_settings')
          .update({ 
            value: JSON.stringify(featuredSchools),
            updated_at: new Date().toISOString()
          })
          .eq('key', 'featured_schools');
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('site_settings')
          .insert({
            key: 'featured_schools',
            value: JSON.stringify(featuredSchools)
          });
        
        if (error) throw error;
      }
      
      toast.success("Featured schools saved successfully");
    } catch (error) {
      console.error("Error saving featured schools:", error);
      toast.error("Failed to save featured schools");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUniversities = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Featured Schools | Admin Dashboard</title>
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold text-navy mb-4 md:mb-0">Featured Schools</h1>
            <div className="space-x-2">
              <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
              <Button 
                variant="default" 
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Featured Schools</CardTitle>
              <CardDescription>
                Choose up to 8 schools to feature on the homepage. Selected schools will appear in the Featured Schools section.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-6">
                <Search className="h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Search universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
                <div className="text-sm text-gray-500">
                  {featuredSchools.length}/8 selected
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Featured</TableHead>
                      <TableHead>University Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUniversities.length > 0 ? (
                      filteredUniversities.map((university) => (
                        <TableRow key={university.id}>
                          <TableCell>
                            <Checkbox
                              checked={featuredSchools.includes(university.id)}
                              onCheckedChange={() => {
                                if (
                                  !featuredSchools.includes(university.id) && 
                                  featuredSchools.length >= 8
                                ) {
                                  toast.warning("You can select a maximum of 8 featured schools");
                                  return;
                                }
                                handleToggleFeature(university.id);
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{university.name}</TableCell>
                          <TableCell>{university.state || "—"}</TableCell>
                          <TableCell>{university.type || "—"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          No universities found matching your search
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

export default FeaturedSchoolsPage;
