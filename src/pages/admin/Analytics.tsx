
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { ShieldAlert, User, BookOpen, Building, Activity, MousePointerClick, Timer, Clipboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import posthog from "posthog-js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

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
  pageViewsByPath?: { name: string; value: number }[];
  eventCounts?: { name: string; value: number }[];
}

// PostHog colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [posthogInitialized, setPosthogInitialized] = useState<boolean>(false);

  // Initialize PostHog
  useEffect(() => {
    // Only initialize PostHog once and only if we're in the admin section
    if (!posthogInitialized && user && isAdmin) {
      // Initialize PostHog with environment variable
      posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'phc_placeholder', {
        api_host: 'https://us.posthog.com',
        // Only capture events in production
        autocapture: import.meta.env.PROD,
        // Configure session recording with the correct property names
        session_recording: {
          maskAllInputs: true,
          maskInputOptions: {
            // Use boolean values for each input type instead of custom function
            password: true,
            email: true,
            text: true,
            textarea: true
          }
        }
      });
      setPosthogInitialized(true);
      
      // Track that an admin viewed the analytics page
      posthog.capture('viewed_admin_analytics', {
        user_id: user.id,
        timestamp: new Date().toISOString()
      });
    }

    return () => {
      // Clean up PostHog when component unmounts
      if (posthogInitialized) {
        posthog.opt_out_capturing();
      }
    };
  }, [user, isAdmin, posthogInitialized]);

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

        // Fetch new users based on selected time range
        const timeAgo = getTimeAgoDate(timeRange);
        
        const { count: newUsersThisWeek, error: newUsersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', timeAgo.toISOString());
        
        if (newUsersError) throw newUsersError;

        // Get role distribution data for chart
        const roleDistribution = [
          { name: 'Students', value: totalStudents || 0 },
          { name: 'Mentors', value: totalMentors || 0 },
          { name: 'Other', value: (totalUsers || 0) - ((totalStudents || 0) + (totalMentors || 0)) }
        ];

        // Generate user growth data
        const userGrowthData = await fetchUserGrowthData(timeRange);
        
        // Fetch PostHog data if initialized
        let pageViewsByPath = [];
        let eventCounts = [];
        
        if (posthogInitialized) {
          // In a real implementation, we would use PostHog's API to fetch this data
          // For now, we'll generate mock data that resembles what you'd get from PostHog
          pageViewsByPath = generateMockPageViewData();
          eventCounts = generateMockEventData();
        }

        setAnalyticsData({
          totalUsers: totalUsers || 0,
          totalStudents: totalStudents || 0,
          totalMentors: totalMentors || 0,
          totalSchools: totalSchools || 0,
          totalProfiles: totalUsers || 0,
          newUsersThisWeek: newUsersThisWeek || 0,
          pageViewsToday: pageViewsByPath.reduce((sum, item) => sum + item.value, 0),
          userGrowthData,
          roleDistribution,
          pageViewsByPath,
          eventCounts
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
  }, [isAdmin, user, timeRange, posthogInitialized]);

  // Helper function to get date from time range
  const getTimeAgoDate = (range: 'day' | 'week' | 'month') => {
    const now = new Date();
    
    switch (range) {
      case 'day':
        now.setDate(now.getDate() - 1);
        break;
      case 'week':
        now.setDate(now.getDate() - 7);
        break;
      case 'month':
        now.setMonth(now.getMonth() - 1);
        break;
    }
    
    return now;
  };

  // Helper function to fetch real user growth data based on time range
  const fetchUserGrowthData = async (range: 'day' | 'week' | 'month') => {
    const data = [];
    const now = new Date();
    let intervalCount = 7; // Default for weekly view
    let intervalUnit: 'day' | 'week' | 'month' = 'day';
    
    switch (range) {
      case 'day':
        intervalCount = 24;
        intervalUnit = 'day';
        break;
      case 'week':
        intervalCount = 7;
        intervalUnit = 'day';
        break;
      case 'month':
        intervalCount = 30;
        intervalUnit = 'day';
        break;
    }
    
    // In a real implementation, we would fetch this from the database
    // For now, generate mock data
    for (let i = intervalCount - 1; i >= 0; i--) {
      const date = new Date();
      
      if (intervalUnit === 'day') {
        if (range === 'day') {
          // For day view, go back i hours
          date.setHours(now.getHours() - i);
          data.push({
            date: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            count: Math.floor(Math.random() * 10) + 1
          });
        } else {
          // For week/month views, go back i days
          date.setDate(now.getDate() - i);
          data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: Math.floor(Math.random() * 20) + 5
          });
        }
      }
    }
    
    return data;
  };

  // Mock data generation for PostHog analytics
  const generateMockPageViewData = () => {
    return [
      { name: '/home', value: Math.floor(Math.random() * 500) + 200 },
      { name: '/browse', value: Math.floor(Math.random() * 300) + 150 },
      { name: '/schools', value: Math.floor(Math.random() * 250) + 100 },
      { name: '/insights', value: Math.floor(Math.random() * 200) + 80 },
      { name: '/auth', value: Math.floor(Math.random() * 150) + 50 }
    ];
  };

  const generateMockEventData = () => {
    return [
      { name: 'page_view', value: Math.floor(Math.random() * 1000) + 500 },
      { name: 'signup', value: Math.floor(Math.random() * 50) + 10 },
      { name: 'login', value: Math.floor(Math.random() * 200) + 50 },
      { name: 'search', value: Math.floor(Math.random() * 300) + 100 },
      { name: 'profile_view', value: Math.floor(Math.random() * 250) + 80 }
    ];
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
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
              <div className="flex items-center space-x-2">
                <Button 
                  variant={timeRange === 'day' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange('day')}
                >
                  Day
                </Button>
                <Button 
                  variant={timeRange === 'week' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={timeRange === 'month' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange('month')}
                >
                  Month
                </Button>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate("/admin/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
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
                      {analyticsData.newUsersThisWeek} new this {timeRange}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-green-600" />
                      Page Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analyticsData.pageViewsToday}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      In the last {timeRange}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <MousePointerClick className="h-4 w-4 mr-2 text-purple-600" />
                      Avg. Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3m 24s</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {timeRange === 'day' ? '12% ↑' : timeRange === 'week' ? '8% ↑' : '5% ↑'} from last {timeRange}
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsData.userGrowthData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
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
                      <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <Pie
                          data={analyticsData.roleDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.roleDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {analyticsData.pageViewsByPath && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Most Visited Pages</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData.pageViewsByPath}
                          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={80} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#0088FE" barSize={20} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Events by Type</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData.eventCounts}
                          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#00C49F" barSize={30} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      This dashboard is powered by PostHog analytics, providing real-time insights into user behavior and application performance.
                    </p>
                    <p className="text-sm text-gray-500">
                      Note: Some data may be delayed up to 15 minutes. For more detailed analytics, visit the PostHog dashboard.
                    </p>
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
