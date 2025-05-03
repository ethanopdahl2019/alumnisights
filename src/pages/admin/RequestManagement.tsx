
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminRequest } from "@/types/admin-requests";

const RequestManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      fetchRequests();
    }
  }, [isAdmin]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // Use fetch API for admin_requests directly since TypeScript doesn't know about it yet
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/admin_requests?select=*`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      
      const requestsData = await response.json() as AdminRequest[];
      
      // Enrich request data with user information
      const enrichedRequests = await Promise.all(requestsData.map(async (request) => {
        // Get user details from auth.users table using admin functions
        try {
          const { data } = await supabase.auth.admin.getUserById(request.user_id);
          
          return {
            ...request,
            user_email: data?.user.email,
            user_name: data?.user.user_metadata?.first_name || data?.user.email
          } as AdminRequest;
        } catch (error) {
          console.error('Error fetching user details:', error);
          return {
            ...request,
            user_email: 'Unknown user',
            user_name: 'Unknown user'
          } as AdminRequest;
        }
      }));
      
      setRequests(enrichedRequests);
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      toast.error("Failed to load admin requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string, userId: string, requestType: string) => {
    try {
      // Update the request status using fetch API
      const updateResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/admin_requests?id=eq.${requestId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ status: 'approved' })
        }
      );
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update request status');
      }
      
      if (requestType === 'admin') {
        // Make user an admin
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
        
        if (userError || !userData) {
          throw userError || new Error("Failed to get user data");
        }
        
        const { error } = await supabase.auth.admin.updateUserById(
          userId,
          { user_metadata: { ...userData.user.user_metadata, role: 'admin' } }
        );
        
        if (error) throw error;
        
        toast.success("User has been granted admin privileges");
      } else if (requestType === 'verified') {
        // Add verified badge to user
        const { error: tagError } = await supabase
          .from("user_tags")
          .insert({
            user_id: userId,
            tag_id: await getVerifiedTagId()
          });
        
        if (tagError) throw tagError;
        
        toast.success("User has been verified");
      }
      
      // Update the requests list
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error("Failed to approve request");
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      // Update the request status using fetch API
      const updateResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/admin_requests?id=eq.${requestId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ status: 'declined' })
        }
      );
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update request status');
      }
      
      toast.success("Request has been declined");
      
      // Update the requests list
      fetchRequests();
    } catch (error) {
      console.error('Error declining request:', error);
      toast.error("Failed to decline request");
    }
  };

  const getVerifiedTagId = async () => {
    // Get or create the "Verified Alumni" tag
    const { data, error } = await supabase
      .from("tags")
      .select("id")
      .eq("name", "Verified Alumni")
      .single();
    
    if (error || !data) {
      // Tag doesn't exist, create it
      const { data: newTag, error: createError } = await supabase
        .from("tags")
        .insert({ 
          name: "Verified Alumni", 
          type: "interest" // Changed from "badge" to "interest" which is an allowed enum value
        })
        .select("id")
        .single();
      
      if (createError || !newTag) throw createError || new Error("Failed to create tag");
      
      return newTag.id;
    }
    
    return data.id;
  };

  if (loading || isLoading) {
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

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Admin Requests | Admin Dashboard</title>
        <meta name="description" content="Manage admin and verification requests" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
                Admin Requests
              </h1>
              <p className="text-gray-600">
                Manage admin and verification requests from users
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

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="pending">
                Pending Requests ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="processed">
                Processed Requests ({processedRequests.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-medium">{request.user_name}</h3>
                              <Badge className="ml-2">
                                {request.request_type === 'admin' ? 'Admin Request' : 'Verification Request'}
                              </Badge>
                            </div>
                            <p className="text-gray-500 text-sm mb-1">
                              {request.user_email}
                            </p>
                            <p className="text-gray-500 text-sm mb-4">
                              Requested: {new Date(request.created_at).toLocaleDateString()}
                            </p>
                            <div className="bg-gray-50 p-3 rounded mb-4">
                              <h4 className="font-medium mb-1">Reason:</h4>
                              <p className="text-sm">{request.reason}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 md:flex-col">
                            <Button
                              onClick={() => handleApproveRequest(request.id, request.user_id, request.request_type)}
                              className="flex-1 md:w-32"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleDeclineRequest(request.id)}
                              variant="outline"
                              className="flex-1 md:w-32"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No pending requests found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="processed">
              {processedRequests.length > 0 ? (
                <div className="space-y-4">
                  {processedRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-medium">{request.user_name}</h3>
                              <Badge className="ml-2">
                                {request.request_type === 'admin' ? 'Admin Request' : 'Verification Request'}
                              </Badge>
                              <Badge 
                                className="ml-2" 
                                variant={request.status === 'approved' ? 'default' : 'destructive'}
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-gray-500 text-sm mb-1">
                              {request.user_email}
                            </p>
                            <p className="text-gray-500 text-sm mb-4">
                              Requested: {new Date(request.created_at).toLocaleDateString()}
                            </p>
                            <div className="bg-gray-50 p-3 rounded">
                              <h4 className="font-medium mb-1">Reason:</h4>
                              <p className="text-sm">{request.reason}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No processed requests found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestManagement;
