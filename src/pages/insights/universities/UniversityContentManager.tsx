
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Edit2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getAllUniversities, UniversityData } from "./universities-data";

const UniversityContentManager: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  
  // Load universities data
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setIsLoading(true);
        const allUniversities = await getAllUniversities();
        setUniversities(allUniversities);
      } catch (error) {
        console.error("Failed to load universities:", error);
        toast.error("Failed to load universities");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin) {
      loadUniversities();
    }
  }, [isAdmin]);
  
  const filteredUniversities = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading || (isAdmin && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!isAdmin && !loading) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>University Content Manager | AlumniSights</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-navy">University Content Manager</h1>
            <Button onClick={() => navigate('/admin/dashboard')}>
              Back to Admin Dashboard
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>University Content</CardTitle>
              <CardDescription>
                Manage content for university pages. Use the search to filter universities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <Input
                  placeholder="Search universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>University Name</TableHead>
                      <TableHead>Content Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUniversities.length > 0 ? (
                      filteredUniversities.map((university) => (
                        <TableRow key={university.id}>
                          <TableCell className="font-medium">{university.name}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${university.hasContent ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                              {university.hasContent ? 'Content Added' : 'No Content'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              to={`/insights/university-content-editor/${university.id}`}
                              className="inline-flex items-center justify-center h-8 px-4 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit Content
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
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

export default UniversityContentManager;
