import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import { getLandingPageBySchool } from '@/services/landing-pages';
import { Book, Award, GraduationCap, Briefcase, Activity } from 'lucide-react';
import type { ProfileWithDetails } from '@/types/database';
import Header from "@/components/Header";

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
        .eq('school_id', id);

      if (error) throw error;

      return data.map((profile: any) => ({
        ...profile,
        activities: profile.activities.map((pa: any) => pa.activities)
      }));
    },
    enabled: !!id
  });

  if (loadingSchool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
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
        <Header />
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
      <Header />
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

            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="bg-blue-50 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="majors">Majors</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="profiles">Alumni & Students</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-2">
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
                      <p className="mb-4">{school.name} is a {school.type?.replace(/_/g, ' ')} institution located in {school.location}.</p>
                      <p>Students at {school.name} have access to a wide range of academic programs and extracurricular activities.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="majors" className="mt-2">
                <h2 className="text-2xl font-bold mb-6">
                  Majors at {school.name}
                </h2>
                {majors && majors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {majors.map((major) => (
                      <Card key={major.id} className="hover:shadow-md transition-shadow">
                        <Link to={`/schools/${school.id}/major/${major.id}`} className="block h-full">
                          <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <GraduationCap className="h-5 w-5 text-blue-600" />
                            </div>
                            <CardTitle className="text-lg">{major.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {major.category && (
                              <p className="text-sm text-gray-500 mt-1">
                                {major.category}
                              </p>
                            )}
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No majors information available yet.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="activities" className="mt-2">
                <h2 className="text-2xl font-bold mb-6">
                  Activities at {school.name}
                </h2>
                {activities && activities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map((activity) => (
                      <Card key={activity.id} className="hover:shadow-md transition-shadow">
                        <Link to={`/schools/${school.id}/activity/${activity.id}`} className="block h-full">
                          <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              {activity.type === 'club' ? (
                                <Award className="h-5 w-5 text-blue-600" />
                              ) : activity.type === 'sport' ? (
                                <Activity className="h-5 w-5 text-blue-600" />  
                              ) : (
                                <Book className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <CardTitle className="text-lg">{activity.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-500 mt-1 capitalize">
                              {activity.type?.replace(/_/g, ' ')}
                            </p>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No activities information available yet.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="profiles" className="mt-2">
                <div className="mb-8 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Students & Alumni</h2>
                  <Button asChild variant="outline">
                    <Link to="/browse">View All</Link>
                  </Button>
                </div>
                {profiles && profiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map((profile: ProfileWithDetails) => (
                      <ProfileCard key={profile.id} profile={profile} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No profiles available yet.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SchoolDetail;
