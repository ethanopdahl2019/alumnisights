import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Search, MoreHorizontal, UserPlus, UserCheck, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { isAdmin } from '@/services/auth';
import { fetchAllUsers, deleteUser, UserWithProfile, toggleUserVisibility } from '@/services/supabase/users';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ErrorLogger from '@/components/ErrorLogger';
import { errorLogger } from '@/components/ErrorLogger';

const UserManagement: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<UserWithProfile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      toast.error("You don't have permission to access this page");
      navigate('/');
      return;
    }
    
    if (!loading && user) {
      loadUsers();
    }
  }, [loading, user, navigate]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const userData = await fetchAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error("Failed to load users");
      errorLogger.logError(`Failed to load users: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteUser = (user: UserWithProfile) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        toast.success(`User ${userToDelete.email} has been deleted`);
        setUsers(users.filter(u => u.id !== userToDelete.id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleToggleVisibility = async (userId: string, visible: boolean | undefined | null) => {
    // Create a per-user loading state
    setIsTogglingVisibility(prev => ({ ...prev, [userId]: true }));
    
    try {
      const success = await toggleUserVisibility(userId, !visible);
      if (success) {
        // Update the user in the local state
        setUsers(users.map(user => {
          if (user.id === userId && user.profile) {
            return {
              ...user,
              profile: {
                ...user.profile,
                visible: !visible
              }
            };
          }
          return user;
        }));
        
        toast.success(`User visibility has been ${!visible ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error("Failed to update visibility");
      errorLogger.logError(`Failed to toggle visibility: ${(error as Error).message}`);
    } finally {
      setIsTogglingVisibility(prev => ({ ...prev, [userId]: false }));
    }
  };

  const filteredUsers = searchTerm 
    ? users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.user_metadata?.first_name && user.user_metadata.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.user_metadata?.last_name && user.user_metadata.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.user_metadata?.role && user.user_metadata.role.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : users;

  const getRoleBadgeColor = (role: string | undefined) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'alumni':
      case 'mentor':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'student':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return '??';
    return `${(firstName?.[0] || '').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}`;
  };

  if (loading) {
    return null;
  }

  if (!user || !isAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>User Management | Admin Dashboard</title>
      </Helmet>
      <Navbar />
      
      <div className="flex-grow container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage all users in the system.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-8" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-center">Browse Visible</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              {user.profile?.image ? (
                                <AvatarImage src={user.profile.image} alt={user.user_metadata?.first_name || ''} />
                              ) : (
                                <AvatarFallback>
                                  {getInitials(user.user_metadata?.first_name, user.user_metadata?.last_name)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span>{user.user_metadata?.first_name} {user.user_metadata?.last_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.user_metadata?.role)}>
                            {user.user_metadata?.role || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                        <TableCell className="text-center">
                          {user.user_metadata?.role === 'alumni' && (
                            <div className="flex justify-center">
                              <Checkbox 
                                id={`visibility-${user.id}`}
                                checked={user.profile?.visible ?? false}
                                onCheckedChange={() => handleToggleVisibility(user.id, user.profile?.visible)}
                                disabled={isTogglingVisibility[user.id]}
                                className="cursor-pointer h-5 w-5"
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.user_metadata?.role === 'alumni' && (
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleToggleVisibility(user.id, user.profile?.visible)}
                                  disabled={isTogglingVisibility[user.id]}
                                >
                                  {user.profile?.visible ? (
                                    <>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      Hide from Browse
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Show in Browse
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No users matching your search.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-gray-500">
              Total Users: {users.length}
            </p>
            <Button size="sm" onClick={loadUsers} disabled={isLoading}>
              Refresh
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user {userToDelete?.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
      <ErrorLogger />
    </div>
  );
};

export default UserManagement;
