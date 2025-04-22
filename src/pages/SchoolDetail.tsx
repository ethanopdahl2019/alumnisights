
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import { getLandingPageBySchool } from '@/services/landing-pages';
import { Book, Award, GraduationCap, Briefcase, Activity, MapPin, Info, Users, Star } from 'lucide-react';
import type { ProfileWithDetails } from '@/types/database';

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

  // Mock data for key facts - in a real app, this would come from a database
  const keyFacts = [
    { icon: <Users size={20} />, title: "Student Body", value: "15,000+" },
    { icon: <MapPin size={20} />, title: "Campus Size", value: "550 acres" },
    { icon: <Star size={20} />, title: "Ranking", value: "Top 50 National" },
    { icon: <Info size={20} />, title: "Founded", value: "1887" }
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
              <div className="w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
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

            {/* Key Facts Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {keyFacts.map((fact, index) => (
                <Card key={index} className="border border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-full">
                        {fact.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{fact.title}</p>
                        <p className="font-semibold">{fact.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="bg-blue-50 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="majors">Majors</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="profiles">Alumni & Students</TabsTrigger>
                <TabsTrigger value="reputation">Reputation & Rankings</TabsTrigger>
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
                      
                      <h3 className="mt-6 mb-3 text-xl font-semibold">What {school.name} is Known For</h3>
                      <p className="mb-4">{school.name} is renowned for its excellence in research, innovative teaching methods, and strong community engagement. The campus offers state-of-the-art facilities and a vibrant student life.</p>
                      
                      <h3 className="mt-6 mb-3 text-xl font-semibold">Campus Life</h3>
                      <p>The campus features modern dormitories, multiple dining options, recreation centers, and extensive libraries. Students can participate in numerous clubs, organizations, and events throughout the academic year.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="majors" className="mt-2">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Majors at {school.name}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {school.name} offers a diverse range of academic programs designed to prepare students for successful careers and further education.
                  </p>
                </div>
                
                {majors && majors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {majors.map((major) => (
                      <Card key={major.id} className="hover:shadow-md transition-shadow border-blue-100">
                        <Link to={`/schools/${school.id}/major/${major.id}`} className="block h-full">
                          <CardHeader className="flex flex-row items-center space-y-0 gap-2 p-4">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <GraduationCap className="h-5 w-5 text-blue-600" />
                            </div>
                            <CardTitle className="text-lg">{major.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 pb-4 px-4">
                            {major.category && (
                              <p className="text-sm text-gray-500">
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
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Activities at {school.name}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    From sports to clubs and special programs, {school.name} offers a wide variety of extracurricular activities for students to enhance their college experience.
                  </p>
                </div>
                
                {activities && activities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map((activity) => (
                      <Card key={activity.id} className="hover:shadow-md transition-shadow border-blue-100">
                        <Link to={`/schools/${school.id}/activity/${activity.id}`} className="block h-full">
                          <CardHeader className="flex flex-row items-center space-y-0 gap-2 p-4">
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
                          <CardContent className="pt-0 pb-4 px-4">
                            <p className="text-sm text-gray-500 capitalize">
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
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Students & Alumni</h2>
                    <p className="text-gray-600">Connect with current students and graduates from {school.name}</p>
                  </div>
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
              
              <TabsContent value="reputation" className="mt-2">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Reputation & Rankings</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="border-blue-100">
                      <CardHeader>
                        <CardTitle className="text-xl">National Rankings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex justify-between">
                            <span>U.S. News & World Report</span>
                            <span className="font-medium">#42</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Forbes</span>
                            <span className="font-medium">#38</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Princeton Review</span>
                            <span className="font-medium">Top 50</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-100">
                      <CardHeader>
                        <CardTitle className="text-xl">Program Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex justify-between">
                            <span>Engineering</span>
                            <span className="font-medium">Top 20</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Business</span>
                            <span className="font-medium">Top 25</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Computer Science</span>
                            <span className="font-medium">Top 30</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">What Sets {school.name} Apart</h3>
                  <p className="mb-4">
                    {school.name} is distinguished by its commitment to innovation, research opportunities, and holistic 
                    student development. The school maintains strong industry connections, providing students with 
                    valuable internship and career opportunities.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">Alumni Success</h3>
                  <p>
                    Graduates of {school.name} have gone on to successful careers in various fields, including 
                    Fortune 500 companies, startups, academia, and public service. The strong alumni network provides 
                    ongoing support and opportunities for current students and recent graduates.
                  </p>
                </div>
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
