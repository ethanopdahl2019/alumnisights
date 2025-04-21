import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import type { ProfileWithDetails } from '@/types/database';

const Profile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          school:schools(*),
          major:majors(*),
          activities:profile_activities(activities(*))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        activities: data.activities.map((pa: any) => pa.activities)
      } as ProfileWithDetails;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center py-12">
            <p>Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
            <p className="mb-8">The profile you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
            <p className="mb-8">The profile you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <ProfileCard profile={profile} />
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
