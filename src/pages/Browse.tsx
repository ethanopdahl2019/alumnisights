import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProfileCard from '@/components/ProfileCard';
import Footer from '@/components/Footer';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/components/Header";

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [majorFilter, setMajorFilter] = useState<string | null>(null);
  const [schoolFilter, setSchoolFilter] = useState<string | null>(null);

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['profiles', searchTerm, majorFilter, schoolFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          school:schools(*),
          major:majors(*),
          activities:profile_activities(activities(*))
        `);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (majorFilter) {
        query = query.eq('major_id', majorFilter);
      }

      if (schoolFilter) {
        query = query.eq('school_id', schoolFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((profile: any) => ({
        ...profile,
        activities: profile.activities.map((pa: any) => pa.activities)
      }));
    }
  });

  const { data: majors } = useQuery({
    queryKey: ['majors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('majors')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  return (
    <div>
      <Header />
      <div className="container-custom py-20">
        <h1 className="text-4xl font-bold mb-8">Browse Profiles</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border rounded px-4 py-2"
            value={majorFilter || ''}
            onChange={(e) =>
              setMajorFilter(e.target.value === '' ? null : e.target.value)
            }
          >
            <option value="">All Majors</option>
            {majors?.map((major) => (
              <option key={major.id} value={major.id}>
                {major.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-4 py-2"
            value={schoolFilter || ''}
            onChange={(e) =>
              setSchoolFilter(e.target.value === '' ? null : e.target.value)
            }
          >
            <option value="">All Schools</option>
            {schools?.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p>Loading profiles...</p>
        ) : error ? (
          <p>Error loading profiles.</p>
        ) : profiles && profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <p>No profiles found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
