
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2Icon, UserIcon } from "lucide-react";
import { fetchAllUsers, deleteUser, UserWithProfile } from "@/services/supabase/users";

const UserManagement = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);

  // Fetch all users with their profiles
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersData = await fetchAllUsers();
      setUsers(usersData);
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
      
      if (!isAdmin) {
        toast.error("You don't have permission to access this page");
        navigate('/');
        return;
      }

      loadUsers();
    }
  }, [user, loading, navigate, isAdmin]);

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      toast.success("User deleted successfully");
      // Refresh the user list
      loadUsers();
    }
  };

  const getUserStatus = (user: UserWithProfile) => {
    if (user.status === 'banned') return 'banned';
    if (!user.last_sign_in_at) return 'pending';
    return 'active';
  };

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
              onClick={() => loadUsers()}
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
                      <TableHead>School & Major</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const status = getUserStatus(user);
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {user.profile?.image || user.user_metadata?.avatar_url ? (
                                <AvatarImage 
                                  src={user.profile?.image || user.user_metadata?.avatar_url} 
                                  alt={user.email} 
                                />
                              ) : (
                                <AvatarFallback className="bg-primary/10 flex items-center justify-center">
                                  <UserIcon className="h-4 w-4 text-primary/60" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              {user.profile?.name || 
                                (user.user_metadata?.first_name && user.user_metadata?.last_name ? 
                                  `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : 
                                  <span className="text-muted-foreground">No name</span>)
                              }
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.user_metadata?.role === 'admin' ? 'destructive' : (user.user_metadata?.role === 'alumni' ? 'success' : 'outline')}>
                              {user.user_metadata?.role || 'user'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(status)}>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.profile?.school ? (
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{user.profile.school.name}</span>
                                {user.profile.major && (
                                  <span className="text-xs text-gray-500">{user.profile.major.name}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500">No school data</span>
                            )}
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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user account? This action cannot be undone.
                                    <div className="mt-2 p-2 border rounded bg-muted">
                                      <p><strong>Email:</strong> {selectedUser?.email}</p>
                                      <p><strong>Name:</strong> {selectedUser?.profile?.name || `${selectedUser?.user_metadata?.first_name || ''} ${selectedUser?.user_metadata?.last_name || ''}`}</p>
                                      <p><strong>Role:</strong> {selectedUser?.user_metadata?.role}</p>
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
