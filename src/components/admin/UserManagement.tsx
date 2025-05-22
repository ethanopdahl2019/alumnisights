
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { isAdmin } from '@/services/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const UserManagement = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      toast.error("You don't have permission to access this page");
      navigate('/');
      return;
    }
    
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading, user, navigate]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4 text-center">
          You don't have permission to access this page.
        </p>
        <Button onClick={() => navigate('/')}>
          Go back to home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <p>User management functionality will be displayed here.</p>
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement;
