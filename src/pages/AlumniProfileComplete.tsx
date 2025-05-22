
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AlumniProfileForm from '@/components/alumni/AlumniProfileForm';

const AlumniProfileComplete = () => {
  console.log("[AlumniProfileComplete] Component rendering");
  const navigate = useNavigate();
  const { user, session } = useAuth();
  
  console.log("[AlumniProfileComplete] Auth state:", { 
    userExists: !!user, 
    userEmail: user?.email, 
    sessionExists: !!session,
    userMetadata: user?.user_metadata 
  });
  
  // Redirect if not logged in
  React.useEffect(() => {
    console.log("[AlumniProfileComplete] Auth check running");
    if (!user && !session) {
      console.log("[AlumniProfileComplete] No user or session found, redirecting to auth page");
      navigate('/auth');
      return;
    } else {
      console.log("[AlumniProfileComplete] User is authenticated:", user?.email);
      // Check if the user is an alumni
      if (user?.user_metadata?.role !== 'alumni') {
        console.log("[AlumniProfileComplete] User is not an alumni, redirecting to appropriate dashboard");
        navigate('/');
        return;
      }
    }
  }, [session, navigate, user]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-12 px-4">
        {user && session && (
          <AlumniProfileForm user={user} session={session} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AlumniProfileComplete;
