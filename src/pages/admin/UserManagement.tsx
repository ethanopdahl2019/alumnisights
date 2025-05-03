
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { ShieldAlert, Search, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  badges?: string[];
  created_at: string;
};

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Get all users from the auth.users table via the Supabase admin API
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }
      
      if (data && data.users) {
        // Format user data
        const formattedUsers = data.users.map((user: any) => ({
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
          role: user.user_metadata?.role,
          badges: user.user_metadata?.badges || [],
          created_at: new Date(user.created_at).toLocaleDateString()
        }));
        setUsers(formattedUsers);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error("Failed to load users: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const assignBadge = async (userId: string, badgeName: string) => {
    try {
      // First, get the current user metadata
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError || !userData) {
        throw userError || new Error("Failed to get user data");
      }
      
      // Update the badges array in the user metadata
      const currentBadges = userData.user.user_metadata?.badges || [];
      const updatedBadges = currentBadges.includes(badgeName) 
        ? currentBadges 
        : [...currentBadges, badgeName];
      
      // Update the user metadata
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { ...userData.user.user_metadata, badges: updatedBadges } }
      );
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, badges: updatedBadges } 
          : u
      ));
      
      toast.success(`Badge "${badgeName}" assigned successfully`);
    } catch (error: any) {
      console.error('Error assigning badge:', error);
      toast.error("Failed to assign badge: " + (error.message || "Unknown error"));
    }
  };

  const removeBadge = async (userId: string, badgeName: string) => {
    try {
      // First, get the current user metadata
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError || !userData) {
        throw userError || new Error("Failed to get user data");
      }
      
      // Remove the badge from the badges array
      const currentBadges = userData.user.user_metadata?.badges || [];
      const updatedBadges = currentBadges.filter((badge: string) => badge !== badgeName);
      
      // Update the user metadata
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { ...userData.user.user_metadata, badges: updatedBadges } }
      );
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, badges: updatedBadges } 
          : u
      ));
      
      toast.success(`Badge "${badgeName}" removed successfully`);
    } catch (error: any) {
      console.error('Error removing badge:', error);
      toast.error("Failed to remove badge: " + (error.message || "Unknown error"));
    }
  };

  const makeAdmin = async (userId: string) => {
    try {
      // First, get the current user metadata
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError || !userData) {
        throw userError || new Error("Failed to get user data");
      }
      
      // Update the role in the user metadata
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { ...userData.user.user_metadata, role: 'admin' } }
      );
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, role: 'admin' } 
          : u
      ));
      
      toast.success("User has been granted admin privileges");
    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast.error("Failed to update user role: " + (error.message || "Unknown error"));
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      // First, get the current user metadata
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError || !userData) {
        throw userError || new Error("Failed to get user data");
      }
      
      // Check if this is the last admin user
      const adminUsers = users.filter(u => u.role === 'admin' && u.id !== userId);
      if (adminUsers.length === 0) {
        toast.error("Cannot remove the last admin user from the system");
        return;
      }
      
      // Update the role in the user metadata
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { ...userData.user.user_metadata, role: 'user' } }
      );
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, role: 'user' } 
          : u
      ));
      
      toast.success("Admin privileges have been removed");
    } catch (error: any) {
      console.error('Error removing admin privileges:', error);
      toast.error("Failed to update user role: " + (error.message || "Unknown error"));
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const availableBadges = [
    "Verified Alumni", 
    "Top Contributor", 
    "Expert", 
    "Mentor"
  ];

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

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>User Management | Admin Dashboard</title>
        <meta name="description" content="Manage users and assign badges" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                View and manage user accounts, roles and badges
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

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Search users by email or name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-lg mr-2">
                            {user.first_name} {user.last_name}
                          </h3>
                          {user.role === 'admin' && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs mt-1">Joined: {user.created_at}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {user.badges && user.badges.length > 0 ? (
                            user.badges.map((badge: string) => (
                              <Badge key={badge} className="bg-green-100 text-green-700 flex items-center">
                                {badge}
                                <button 
                                  className="ml-1 text-green-700 hover:text-green-900"
                                  onClick={() => removeBadge(user.id, badge)}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No badges assigned</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <select 
                            className="p-1 border rounded text-sm"
                            disabled={user.badges && user.badges.length >= availableBadges.length}
                          >
                            <option value="">Select a badge</option>
                            {availableBadges
                              .filter(badge => !user.badges || !user.badges.includes(badge))
                              .map(badge => (
                                <option key={badge} value={badge}>{badge}</option>
                              ))
                            }
                          </select>
                          <Button 
                            size="sm"
                            disabled={user.badges && user.badges.length >= availableBadges.length}
                            onClick={() => {
                              const select = document.querySelector(`select`) as HTMLSelectElement;
                              const badge = select.value;
                              if (badge) {
                                assignBadge(user.id, badge);
                              }
                            }}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                        </div>

                        <div>
                          {user.role === 'admin' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => removeAdmin(user.id)}
                              className="w-full"
                            >
                              Remove Admin
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => makeAdmin(user.id)}
                              className="w-full"
                            >
                              Make Admin
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserManagement;
