
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { isStudent, isAdmin } from "@/services/auth";
import { toast } from "@/components/ui/use-toast";

const StudentDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is not logged in or not a student/admin
    if (!loading && (!user || (!isStudent(user) && !isAdmin(user)))) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You must be a student to access this dashboard",
      });
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || (!isStudent(user) && !isAdmin(user))) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Student Dashboard | AlumniSights</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        <h1 className="text-3xl font-bold text-navy mb-6">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Browse alumni mentors by school, major or expertise
              </p>
              <div className="mt-4">
                <button className="text-blue-600 text-sm font-medium">
                  Explore Mentors
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View your upcoming and past mentoring sessions
              </p>
              <div className="mt-4">
                <span className="text-2xl font-bold">0</span>
                <span className="text-sm text-gray-500 ml-2">upcoming sessions</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track your college application status
              </p>
              <div className="mt-4">
                <button className="text-blue-600 text-sm font-medium">
                  Update Status
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy mb-4">Recommended Resources</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-500 italic">No recommended resources yet</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
