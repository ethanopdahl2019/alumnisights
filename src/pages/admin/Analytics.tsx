
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Users, MessageSquare, Calendar, UserCheck } from "lucide-react";

const Analytics = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Sample data for demonstration purposes
  // In a real app, you would fetch this data from your backend
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [
      { name: 'Jan', value: 120 },
      { name: 'Feb', value: 150 },
      { name: 'Mar', value: 180 },
      { name: 'Apr', value: 270 },
      { name: 'May', value: 350 },
      { name: 'Jun', value: 420 },
      { name: 'Jul', value: 580 },
    ],
    userRoles: [
      { name: 'Students', value: 540 },
      { name: 'Mentors', value: 120 },
      { name: 'Applicants', value: 320 },
      { name: 'Admins', value: 15 },
    ],
    sessionData: [
      { name: 'Mon', sessions: 80, bookings: 25 },
      { name: 'Tue', sessions: 95, bookings: 30 },
      { name: 'Wed', sessions: 110, bookings: 45 },
      { name: 'Thu', sessions: 140, bookings: 60 },
      { name: 'Fri', sessions: 180, bookings: 80 },
      { name: 'Sat', sessions: 220, bookings: 95 },
      { name: 'Sun', sessions: 190, bookings: 75 },
    ],
    totalUsers: 995,
    totalBookings: 410,
    totalMentors: 120,
    totalRequests: 45
  });

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    // Check if user is admin
    if (!loading) {
      if (!user) {
        toast.error("Please sign in to access this page");
        navigate('/auth');
        return;
      }
      
      if (!isAdmin) {
        toast.error("You don't have permission to access this page");
        navigate('/');
        return;
      }
      
      // In a real application, you would fetch analytics data here
      // For now, we're using the sample data defined above
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Analytics | Admin</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-navy">Analytics Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-500 h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalUsers}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="text-green-500 h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalBookings}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <UserCheck className="text-purple-500 h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Mentors</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalMentors}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <MessageSquare className="text-orange-500 h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalRequests}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.userGrowth}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Site Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sessions" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="bookings" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.userRoles}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.userRoles.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analytics;
