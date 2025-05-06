
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
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AnalyticsData {
  totalUsers: number;
  totalStudents: number;
  totalMentors: number;
  totalSchools: number;
  totalProfiles: number;
  newUsersThisWeek: number;
  pageViewsToday: number;
  userGrowthData: { date: string; count: number }[];
  roleDistribution: { name: string; value: number }[];
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Check if user is an admin
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

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch total users count
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (usersError) throw usersError;

        // Fetch students count
        const { count: totalStudents, error: studentsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student');
        
        if (studentsError) throw studentsError;

        // Fetch mentors count
        const { count: totalMentors, error: mentorsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'alumni');
        
        if (mentorsError) throw mentorsError;

        // Fetch schools count
        const { count: totalSchools, error: schoolsError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true });
        
        if (schoolsError) throw schoolsError;

        // Fetch new users this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count: newUsersThisWeek, error: newUsersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());
        
        if (newUsersError) throw newUsersError;

        // Get role distribution data for chart
        const roleDistribution = [
          { name: 'Students', value: totalStudents || 0 },
          { name: 'Mentors', value: totalMentors || 0 },
          { name: 'Other', value: (totalUsers || 0) - ((totalStudents || 0) + (totalMentors || 0)) }
        ];

        // Generate user growth data (mocked weekly data for now)
        // In a real application, this would be fetched from analytics or calculated from signup dates
        const userGrowthData = generateUserGrowthData();

        setAnalyticsData({
          totalUsers: totalUsers || 0,
          totalStudents: totalStudents || 0,
          totalMentors: totalMentors || 0,
          totalSchools: totalSchools || 0,
          totalProfiles: totalUsers || 0,
          newUsersThisWeek: newUsersThisWeek || 0,
          pageViewsToday: Math.floor(Math.random() * 1000) + 100, // Mock data for page views
          userGrowthData,
          roleDistribution
        });

      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Error loading analytics data");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isAdmin && user) {
      fetchAnalyticsData();
    }
  }, [isAdmin, user]);

  // Helper function to generate sample user growth data (this would be replaced with real data in production)
  const generateUserGrowthData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i * 7);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 20) + 5 // Random count between 5-25
      });
    }
    
    return data;
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
                Live overview of site statistics and user activity
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

          {isLoadingData ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
          ) : analyticsData ? (
            <>
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
                      Total Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analyticsData.totalStudents}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((analyticsData.totalStudents / analyticsData.totalUsers) * 100)}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <User className="h-4 w-4 mr-2 text-purple-600" />
                      Total Mentors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analyticsData.totalMentors}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((analyticsData.totalMentors / analyticsData.totalUsers) * 100)}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Building className="h-4 w-4 mr-2 text-orange-600" />
                      Universities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analyticsData.totalSchools}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Registered in the system
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsData.userGrowthData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Role Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.roleDistribution}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p>No analytics data available</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
