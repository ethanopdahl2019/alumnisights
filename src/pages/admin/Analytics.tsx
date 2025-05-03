
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { ShieldAlert, User, BookOpen, Building } from "lucide-react";

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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

  // Mock data - in a real application, this would be fetched from a database
  const analyticsData = {
    totalUsers: 346,
    activeUsers: 213,
    totalSchools: 47,
    totalUniversityPages: 32,
    totalProfiles: 189,
    newUsersThisWeek: 24,
    pageViewsToday: 562
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Analytics | Admin Dashboard</title>
        <meta name="description" content="View site analytics and statistics" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Overview of site statistics and user activity
              </p>
            </div>
            <Button 
              className="mt-4 md:mt-0" 
              onClick={() => navigate("/admin/dashboard")}
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.totalUsers}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {analyticsData.newUsersThisWeek} new this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2 text-green-600" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.activeUsers}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((analyticsData.activeUsers / analyticsData.totalUsers) * 100)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Building className="h-4 w-4 mr-2 text-purple-600" />
                  Universities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.totalSchools}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {analyticsData.totalUniversityPages} with content pages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-orange-600" />
                  Page Views Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.pageViewsToday}</div>
                <p className="text-xs text-gray-500 mt-1">
                  ~{Math.round(analyticsData.pageViewsToday / 24)} per hour
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-gray-500">User growth chart would appear here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Universities</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-gray-500">University popularity chart would appear here</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
