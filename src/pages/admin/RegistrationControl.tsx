
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationPreview from "@/components/mentor/RegistrationPreview";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAdmin } from "@/services/auth";
import AccessDenied from "../insights/universities/components/AccessDenied";

const RegistrationControl = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return <AccessDenied message="You don't have permission to access this page" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Registration Control | Admin</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-navy">Registration Control</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Registration Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Review and manage how registration forms appear to different user types
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="student">Student Registration</TabsTrigger>
                <TabsTrigger value="mentor">Mentor Registration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="student">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Registration Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RegistrationPreview registrationType="student" />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="mentor">
                <Card>
                  <CardHeader>
                    <CardTitle>Mentor Registration Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RegistrationPreview registrationType="mentor" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegistrationControl;
