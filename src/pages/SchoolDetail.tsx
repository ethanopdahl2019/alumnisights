
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tab } from '@headlessui/react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import { getLandingPageBySchool } from '@/services/landing-pages';
import type { ProfileWithDetails } from '@/types/database';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SchoolDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: school, isLoading: loadingSchool } = useQuery({
    queryKey: ['school', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name, location, type, image, created_at')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Ensure 'image' is present, even if null by default
      return {
        ...data,
        image: data.image ?? null
      };
    },
    enabled: !!id
  });

  const { data: landingPage } = useQuery({
    queryKey: ['school-landing', id],
    queryFn: () => getLandingPageBySchool(id!),
    enabled: !!id
  });

  const { data: majors } = useQuery({
    queryKey: ['school-majors', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          major_id,
          majors (*)
        `)
        .eq('school_id', id)
        .not('major_id', 'is', null);

      if (error) throw error;

      const uniqueMajors = new Map();
      data.forEach(item => {
        if (item.majors) {
          uniqueMajors.set(item.majors.id, item.majors);
        }
      });

      return Array.from(uniqueMajors.values());
    },
    enabled: !!id
  });

  const { data: activities } = useQuery({
    queryKey: ['school-activities', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile_activities')
        .select(`
          activities (*),
          profiles!inner (school_id)
        `)
        .eq('profiles.school_id', id);

      if (error) throw error;

      const uniqueActivities = new Map();
      data.forEach(item => {
        if (item.activities) {
          uniqueActivities.set(item.activities.id, item.activities);
        }
      });

      return Array.from(uniqueActivities.values());
    },
    enabled: !!id
  });

  const { data: profiles } = useQuery({
    queryKey: ['school-profiles', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          school:schools(*),
          major:majors(*),
          activities:profile_activities(activities(*))
        `)
        .eq('school_id', id)
        .limit(6);

      if (error) throw error;

      return data.map((profile: any) => ({
        ...profile,
        activities: profile.activities.map((pa: any) => pa.activities)
      }));
    },
    enabled: !!id
  });

  const tabs = [
    { name: 'Overview', component: 'overview' },
    { name: 'Majors', component: 'majors' },
    { name: 'Activities', component: 'activities' },
    { name: 'Alumni & Students', component: 'profiles' },
  ];

  if (loadingSchool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center py-12">
            <p>Loading school information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">School Not Found</h1>
            <p className="mb-8">The school you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/schools">Back to Schools</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center">
                {school.image ? (
                  <img
                    src={school.image}
                    alt={school.name}
                    className="max-h-20 max-w-20 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-500">
                      {school.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold">{school.name}</h1>
                <p className="text-lg text-gray-600 mt-1">{school.location}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {school.type?.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="md:ml-auto mt-4 md:mt-0">
                <Button asChild>
                  <Link to="/browse">
                    Find Students & Alumni
                  </Link>
                </Button>
              </div>
            </div>

            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1 mb-8">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-white shadow text-blue-700'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-700'
                      )
                    }
                  >
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2 mb-12">
                <Tab.Panel>
                  <div className="prose max-w-none">
                    {landingPage ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: landingPage.content_blocks
                            .filter(
                              (block) =>
                                block.type === 'school' ||
                                block.type === 'general'
                            )
                            .map(
                              (block) =>
                                `<h2>${block.title}</h2>${block.content}`
                            )
                            .join(''),
                        }}
                      />
                    ) : (
                      <div>
                        <h2>About {school.name}</h2>
                        <p>No detailed information available yet for this school.</p>
                      </div>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <h2 className="text-2xl font-bold mb-6">
                    Majors at {school.name}
                  </h2>
                  {majors && majors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {majors.map((major) => (
                        <Link
                          key={major.id}
                          to={`/schools/${school.id}/major/${major.id}`}
                          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <h3 className="font-semibold text-lg">{major.name}</h3>
                          {major.category && (
                            <p className="text-sm text-gray-500 mt-1">
                              {major.category}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No majors information available yet.
                    </p>
                  )}
                </Tab.Panel>

                <Tab.Panel>
                  <h2 className="text-2xl font-bold mb-6">
                    Activities at {school.name}
                  </h2>
                  {activities && activities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activities.map((activity) => (
                        <Link
                          key={activity.id}
                          to={`/schools/${school.id}/activity/${activity.id}`}
                          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <h3 className="font-semibold text-lg">
                            {activity.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 capitalize">
                            {activity.type?.replace(/_/g, ' ')}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No activities information available yet.
                    </p>
                  )}
                </Tab.Panel>

                <Tab.Panel>
                  <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Students & Alumni</h2>
                    <Button asChild variant="outline">
                      <Link to="/browse">View All</Link>
                    </Button>
                  </div>
                  {profiles && profiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {profiles.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No profiles available yet.</p>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SchoolDetail;

