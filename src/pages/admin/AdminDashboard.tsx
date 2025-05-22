import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  FileText,
  CalendarIcon,
  School,
  Building,
  Bookmark,
  Activity,
  Mail,
  VideoIcon,
  UserCheck,
  Star,
  ChevronRight,
  FileCheck,
  BarChart,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isAdmin, refreshAndCheckAdmin } from "@/services/auth";
import AccessDenied from "../insights/universities/components/AccessDenied";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Group admin links by category
const adminLinkGroups = {
  users: [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users"
    },
    {
      title: "Profile Management",
      description: "Manage profile visibility and information",
      icon: <Eye className="h-5 w-5" />,
      href: "/admin/profile-management"
    },
    {
      title: "Registration Control",
      description: "Manage student and mentor registration forms",
      icon: <UserCheck className="h-5 w-5" />,
      href: "/admin/registration-control"
    },
    {
      title: "Request Management",
      description: "Handle user requests and verification",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/requests"
    },
  ],
  content: [
    {
      title: "Content Management",
      description: "Manage site content and blog posts",
      icon: <FileText className="h-5 w-5" />,
      href: "/insights/university-content-manager"
    },
    {
      title: "Featured Schools",
      description: "Select schools to feature on the homepage",
      icon: <Star className="h-5 w-5" />,
      href: "/admin/featured-schools"
    },
    {
      title: "Schools Management",
      description: "Add and update school information",
      icon: <School className="h-5 w-5" />,
      href: "/admin/schools"
    },
    {
      title: "Companies Management",
      description: "Manage employer and company data",
      icon: <Building className="h-5 w-5" />,
      href: "/admin/companies"
    },
    {
      title: "Major Management",
      description: "Edit and create academic majors",
      icon: <Bookmark className="h-5 w-5" />,
      href: "/admin/majors"
    },
    {
      title: "Activities Management",
      description: "Manage clubs, sports and activities",
      icon: <Activity className="h-5 w-5" />,
      href: "/admin/activities"
    },
  ],
  operations: [
    {
      title: "Booking Management",
      description: "Manage session bookings and zoom links",
      icon: <VideoIcon className="h-5 w-5" />,
      href: "/admin/bookings"
    },
    {
      title: "Analytics",
      description: "View site performance and user metrics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/analytics"
    },
    {
      title: "Email Templates",
      description: "Manage system email templates",
      icon: <Mail className="h-5 w-5" />,
      href: "/admin/emails"
    },
    {
      title: "Calendar Management",
      description: "Manage important dates and events",
      icon: <CalendarIcon className="h-5 w-5" />,
      href: "/admin/calendar"
    },
    {
      title: "System Settings",
      description: "Configure system settings and parameters",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings"
    },
    {
      title: "Content Progress",
      description: "Track progress of content development",
      icon: <BarChart className="h-5 w-5" />,
      href: "/admin/content-progress"
    },
  ]
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }
      
      try {
        // Check if user is admin using both methods
        const hasAdminRole = await refreshAndCheckAdmin(user);
        
        setIsAdminUser(hasAdminRole);
        
        if (!hasAdminRole) {
          toast.error("You don't have permission to access this page");
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast.error("Error checking permissions");
      } finally {
        setCheckingAdmin(false);
      }
    };
    
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  // Get all admin links flattened for "All" tab
  const allAdminLinks = [
    ...adminLinkGroups.users,
    ...adminLinkGroups.content,
    ...adminLinkGroups.operations
  ];

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-navy">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <AccessDenied message="Please sign in to access this page" />;
  }

  if (isAdminUser === false) {
    return <AccessDenied message="You don't have permission to access this page" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-8">
            Admin Dashboard
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allAdminLinks.map((link, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Button 
                      variant="ghost" 
                      className="h-full w-full p-0 items-start"
                      onClick={() => navigate(link.href)}
                    >
                      <div className="w-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              {link.icon}
                            </div>
                            <CardTitle className="text-lg">{link.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-left">
                            {link.description}
                          </CardDescription>
                        </CardContent>
                      </div>
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* User Management Tab */}
            <TabsContent value="users">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminLinkGroups.users.map((link, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Button 
                      variant="ghost" 
                      className="h-full w-full p-0 items-start"
                      onClick={() => navigate(link.href)}
                    >
                      <div className="w-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              {link.icon}
                            </div>
                            <CardTitle className="text-lg">{link.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-left">
                            {link.description}
                          </CardDescription>
                        </CardContent>
                      </div>
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Content Management Tab */}
            <TabsContent value="content">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminLinkGroups.content.map((link, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Button 
                      variant="ghost" 
                      className="h-full w-full p-0 items-start"
                      onClick={() => navigate(link.href)}
                    >
                      <div className="w-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              {link.icon}
                            </div>
                            <CardTitle className="text-lg">{link.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-left">
                            {link.description}
                          </CardDescription>
                        </CardContent>
                      </div>
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Operations Tab */}
            <TabsContent value="operations">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminLinkGroups.operations.map((link, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Button 
                      variant="ghost" 
                      className="h-full w-full p-0 items-start"
                      onClick={() => navigate(link.href)}
                    >
                      <div className="w-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              {link.icon}
                            </div>
                            <CardTitle className="text-lg">{link.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-left">
                            {link.description}
                          </CardDescription>
                        </CardContent>
                      </div>
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
