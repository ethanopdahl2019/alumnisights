
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Eye } from "lucide-react";

// Define a User interface for TypeScript
interface User {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    role?: string;
    avatar_url?: string;
  };
  created_at: string;
  last_sign_in_at?: string;
}

interface UserProfile {
  user_id: string;
  visible: boolean;
}

const UserManagement = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [updatingVisibility, setUpdatingVisibility] = useState<string | null>(null);

  // Fetch all users using Edge Function
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("No active session");
      }

      const response = await fetch(
        'https://xvnhujckrivhjnaslanm.supabase.co/functions/v1/admin-users',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
      
      // Fetch user profiles for visibility settings
      await fetchUserProfiles(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users: " + (error as Error).message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch user profiles for visibility settings
  const fetchUserProfiles = async (usersList: User[]) => {
    try {
      const userIds = usersList.map(u => u.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, visible')
        .in('user_id', userIds);

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      const profilesMap: Record<string, UserProfile> = {};
      data.forEach(profile => {
        profilesMap[profile.user_id] = profile;
      });
      
      setUserProfiles(profilesMap);
    } catch (error) {
      console.error('Failed to fetch user profiles:', error);
    }
  };

  // Update user visibility using the new Supabase function
  const updateUserVisibility = async (userId: string, visible: boolean) => {
    setUpdatingVisibility(userId);
    try {
      const { data, error } = await supabase.rpc('update_user_browse_visibility', {
        user_id_param: userId,
        visible_param: visible
      });

      if (error) {
        console.error('Error updating visibility:', error);
        toast.error('Failed to update user visibility');
        return;
      }

      if (data) {
        // Update local state
        setUserProfiles(prev => ({
          ...prev,
          [userId]: { ...prev[userId], user_id: userId, visible }
        }));
        toast.success(`User visibility ${visible ? 'enabled' : 'disabled'}`);
      } else {
        toast.error('Failed to update user visibility');
      }
    } catch (error) {
      console.error('Failed to update user visibility:', error);
      toast.error('Failed to update user visibility');
    } finally {
      setUpdatingVisibility(null);
    }
  };

  // Delete user using the new Supabase function
  const deleteUser = async (userId: string) => {
    setDeletingUser(userId);
    try {
      const { data, error } = await supabase.rpc('delete_user_and_data', {
        user_id_to_delete: userId
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user: ' + error.message);
        return;
      }

      if (data) {
        // Remove user from local state
        setUsers(prev => prev.filter(u => u.id !== userId));
        setUserProfiles(prev => {
          const newProfiles = { ...prev };
          delete newProfiles[userId];
          return newProfiles;
        });
        toast.success("User deleted successfully");
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user: " + (error as Error).message);
    } finally {
      setDeletingUser(null);
    }
  };

  // View user profile
  const viewUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (error || !profile) {
        toast.error('User profile not found');
        return;
      }

      navigate(`/alumni/${profile.id}`);
    } catch (error) {
      console.error('Error finding user profile:', error);
      toast.error('Failed to find user profile');
    }
  };

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

      fetchUsers();
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
        <title>User Management | Admin</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-navy">User Management</h1>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => fetchUsers()}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Visible in Browse</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const profile = userProfiles[user.id];
                      const isVisible = profile?.visible !== false; // Default to true if no profile
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                              <AvatarFallback>
                                {(user.user_metadata?.first_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              {user.user_metadata?.first_name && user.user_metadata?.last_name ? (
                                `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                              ) : (
                                <span className="text-muted-foreground">No name</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.user_metadata?.role === 'admin' ? 'destructive' : 'outline'}>
                              {user.user_metadata?.role || 'user'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {user.last_sign_in_at ? 
                              new Date(user.last_sign_in_at).toLocaleDateString() : 
                              'Never'}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={isVisible}
                              onCheckedChange={(checked) => 
                                updateUserVisibility(user.id, checked)
                              }
                              disabled={updatingVisibility === user.id}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewUserProfile(user.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={deletingUser === user.id}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the user account and remove all associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={deletingUser === user.id}
                                    >
                                      {deletingUser === user.id ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No users found.</p>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserManagement;
