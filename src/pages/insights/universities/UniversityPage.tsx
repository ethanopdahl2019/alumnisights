
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import UniversityTemplate from "./UniversityTemplate";
import { universities } from "./universities-data";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const UniversityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Find the university data based on the URL parameter
  const university = universities.find(uni => uni.id === id);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_metadata')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        const isUserAdmin = data?.user_metadata?.role === 'admin';
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    if (user) {
      checkAdminStatus();
    }
  }, [user]);
  
  // If no university is found, redirect to the undergraduate admissions page
  if (!university) {
    return <Navigate to="/insights/undergraduate-admissions" replace />;
  }

  return <UniversityTemplate 
    name={university.name}
    logo={university.logo}
    showEditButton={isAdmin}
  />;
};

export default UniversityPage;
