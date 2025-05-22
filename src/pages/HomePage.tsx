
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { isAdmin } from '@/services/auth';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isUserAdmin = isAdmin(user);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-primary/5 py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Admin Portal</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Secure administration portal for managing the application
            </p>
            
            {!user ? (
              <Button size="lg" onClick={() => navigate('/auth')}>
                Login as Administrator
              </Button>
            ) : isUserAdmin ? (
              <Button size="lg" onClick={() => navigate('/admin-dashboard')}>
                Go to Admin Dashboard
              </Button>
            ) : (
              <p className="text-red-600">
                Your account does not have administrative privileges.
              </p>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
