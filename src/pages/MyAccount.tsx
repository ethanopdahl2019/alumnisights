
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { isAdmin } from '@/services/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MyAccount = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Redirect non-admin users to home
    if (!isAdmin(user)) {
      toast.error("Only administrators have access to this page");
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Role</h3>
                    <p className="text-gray-600">{user.user_metadata?.role || 'admin'}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={handleSignOut}
                    disabled={loading}
                  >
                    {loading ? 'Signing out...' : 'Sign out'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccount;
