
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

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
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  identities?: Array<{
    provider: string;
  }>;
  status?: string;
}

const UserManagement = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

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
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users: " + (error as Error).message);
    } finally {
      setLoadingUsers(false);
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
      
      if (!isAdmin(user)) {
        toast.error("You don't have permission to access this page");
        navigate('/');
        return;
      }

      fetchUsers();
    }
  }, [user, loading, navigate]);

  const isAdmin = (user: any) => {
    return user?.user_metadata?.role === 'admin';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin(user)) {
    return null; // Will redirect via useEffect
  }

  const getUserStatus = (user: User) => {
    if (user.status === 'banned') return 'banned';
    if (!user.last_sign_in_at) return 'pending';
    return 'active';
  };

  // Update this function to use only the available variants
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return "success";
      case 'pending': return "warning";
      case 'banned': return "destructive";
      default: return "secondary";
    }
  };

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
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const status = getUserStatus(user);
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
                            <Badge variant={getStatusBadgeVariant(status)}>
                              {status}
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
