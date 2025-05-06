
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { isMentor, isAdmin } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ReferAlumniDialog from "@/components/mentor/ReferAlumniDialog";
import MyReferrals from "@/components/mentor/MyReferrals";
import RegistrationPreview from "@/components/mentor/RegistrationPreview";

const MentorDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [referDialogOpen, setReferDialogOpen] = useState(false);
  const [refreshReferrals, setRefreshReferrals] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Redirect if user is not logged in or not a mentor/admin
    if (!loading && (!user || (!isMentor(user) && !isAdmin(user)))) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You must be a mentor to access this dashboard",
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

  if (!user || (!isMentor(user) && !isAdmin(user))) {
    return null; // Will redirect via useEffect
  }

  const handleReferralComplete = () => {
    setRefreshReferrals(prev => !prev);
  };

  const isUserAdmin = isAdmin(user);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Mentor Dashboard | AlumniSights</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-navy">Mentor Dashboard</h1>
          <Button 
            className="mt-4 md:mt-0 flex items-center gap-2" 
            onClick={() => setReferDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Refer an Alumni
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            {isUserAdmin && <TabsTrigger value="registration-preview">Registration Preview</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Update your mentor profile and expertise areas
                  </p>
                  <div className="mt-4">
                    <Button 
                      variant="outline"
                      className="text-blue-600 text-sm font-medium"
                      onClick={() => navigate('/account')}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <MyReferrals key={refreshReferrals ? 'refresh' : 'initial'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    View and manage student mentoring requests
                  </p>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">0</span>
                    <span className="text-sm text-gray-500 ml-2">pending requests</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Manage your availability and upcoming sessions
                  </p>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">0</span>
                    <span className="text-sm text-gray-500 ml-2">upcoming sessions</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-10">
              <h2 className="text-xl font-bold text-navy mb-4">Recent Activity</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-500 italic">No recent activity to display</p>
              </div>
            </div>
          </TabsContent>
          
          {isUserAdmin && (
            <TabsContent value="registration-preview">
              <RegistrationPreview />
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <ReferAlumniDialog 
        open={referDialogOpen}
        onOpenChange={setReferDialogOpen}
        onReferralComplete={handleReferralComplete}
      />
      
      <Footer />
    </div>
  );
};

export default MentorDashboard;
