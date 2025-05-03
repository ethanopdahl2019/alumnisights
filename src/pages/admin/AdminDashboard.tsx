
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { ShieldAlert, UserCheck, Edit, Info, BadgeCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      // Check if the user has admin role in their metadata
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

  useEffect(() => {
    if (isAdmin) {
      fetchPendingRequests();
    }
  }, [isAdmin]);

  const fetchPendingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_requests")
        .select("count", { count: "exact", head: true })
        .eq("status", "pending");
      
      if (error) throw error;
      
      setPendingRequestsCount(data || 0);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
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
        <title>Admin Dashboard | AlumniSights</title>
        <meta name="description" content="Admin dashboard for managing content and users" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {user.user_metadata?.first_name || user.email}. Manage site content and users from this dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="h-5 w-5 mr-2 text-blue-600" />
                  Content Management
                </CardTitle>
                <CardDescription>
                  Edit and manage website content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Manage university pages, insights, and other website content.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate("/insights/university-content-manager")}
                >
                  Manage University Content
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts and badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Assign badges to users, manage permissions, and view user details.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/admin/users")}
                >
                  Manage Users
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BadgeCheck className="h-5 w-5 mr-2 text-purple-600" />
                  User Requests
                  {pendingRequestsCount > 0 && (
                    <span className="ml-2 text-sm bg-red-600 text-white py-1 px-2 rounded-full">
                      {pendingRequestsCount}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Manage verification and admin requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Review and approve requests from users for verification or admin privileges.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/admin/requests")}
                >
                  View Requests
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-orange-600" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  View site statistics and user activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Monitor user engagement, popular content, and other analytics.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/admin/analytics")}
                >
                  View Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
