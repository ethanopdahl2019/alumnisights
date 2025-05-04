import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import { getLandingPageBySchool } from '@/services/landing-page';
import { ArrowRight, Book, Award, GraduationCap, Briefcase, Activity, Globe, Users, MapPin, CalendarIcon, School as SchoolIcon, Info } from 'lucide-react';
import type { ProfileWithDetails } from '@/types/database';

const SchoolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: school, isLoading: loadingSchool } = useQuery({
    queryKey: ['school', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
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

      return data.map((profile: any) => {
        // Parse social_links if it's a string
        let socialLinks = profile.social_links;
        if (typeof socialLinks === 'string' && socialLinks) {
          try {
            socialLinks = JSON.parse(socialLinks);
          } catch (error) {
            console.error('Error parsing social links:', error);
            socialLinks = null;
          }
        }
        
        return {
          ...profile,
          activities: profile.activities.map((pa: any) => pa.activities),
          social_links: socialLinks
        };
      });
    },
    enabled: !!id
  });

  const { data: schoolHighlights } = useQuery({
    queryKey: ['school-highlights', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_highlights')
        .select('*')
        .eq('school_id', id)
        .order('order_position');

      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  const { data: schoolImages } = useQuery({
    queryKey: ['school-images', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_images')
        .select('*')
        .eq('school_id', id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

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

  const getSchoolTypeDisplay = (type: string | null) => {
    if (!type) return 'University';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-navy to-navy-light text-white py-16">
        <div className="absolute inset-0 opacity-20">
          {schoolImages && schoolImages.length > 0 ? (
            <img 
              src={schoolImages[0].image_url} 
              alt={school.name} 
              className="w-full h-full object-cover" 
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-navy-light/80"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <motion.div 
              className="bg-white p-4 rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 flex items-center justify-center">
                {school.image ? (
                  <img
                    src={school.image}
                    alt={school.name}
                    className="max-h-24 max-w-24 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-500">
                      {school.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
            
            <div className="flex-1">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {school.name}
              </motion.h1>
              <motion.div 
                className="flex flex-wrap gap-3 text-white/80 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {school.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{school.location}</span>
                  </div>
                )}
                {school.type && (
                  <div className="flex items-center">
                    <SchoolIcon className="h-4 w-4 mr-1" />
                    <span>{getSchoolTypeDisplay(school.type)}</span>
                  </div>
                )}
                {school.founded_year && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Founded {school.founded_year}</span>
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button asChild variant="secondary" className="bg-white text-navy hover:bg-gray-100">
                  <Link to="/browse">
                    Connect with Students & Alumni
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Stats Bar */}
      {schoolHighlights && schoolHighlights.length > 0 ? (
        <div className="bg-gray-50 py-6 border-b">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {schoolHighlights.map((highlight, index) => (
                <motion.div 
                  key={highlight.id}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <p className="text-sm text-gray-600">{highlight.title}</p>
                  <p className="text-2xl font-bold text-navy">{highlight.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Content */}
      <main className="flex-grow bg-white">
        <div className="container-custom py-12">
          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-12"
          >
            <TabsList className="bg-gray-100 p-1 mb-8 flex flex-wrap">
              <TabsTrigger value="overview" className="px-6 py-2">Overview</TabsTrigger>
              <TabsTrigger value="academics" className="px-6 py-2">Academics</TabsTrigger>
              <TabsTrigger value="activities" className="px-6 py-2">Activities</TabsTrigger>
              <TabsTrigger value="profiles" className="px-6 py-2">Alumni & Students</TabsTrigger>
              <TabsTrigger value="gallery" className="px-6 py-2">Gallery</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-2 animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <motion.div 
                    className="prose max-w-none"
                    initial="initial"
                    animate="animate"
                    transition={{ staggerChildren: 0.1 }}
                  >
                    <motion.h2 
                      className="text-3xl font-bold mb-6" 
                      {...fadeIn}
                    >
                      About {school.name}
                    </motion.h2>
                    
                    {school.description ? (
                      <motion.div {...fadeIn}>
                        <p className="text-lg">{school.description}</p>
                      </motion.div>
                    ) : (
                      <motion.div {...fadeIn}>
                        <p className="text-lg">{school.name} is a {getSchoolTypeDisplay(school.type)} institution located in {school.location}.</p>
                        <p className="text-lg">Students at {school.name} have access to a wide range of academic programs and extracurricular activities.</p>
                      </motion.div>
                    )}
                    
                    {landingPage && landingPage.content_blocks
                      .filter(block => block.type === 'school' || block.type === 'general')
                      .map((block, index) => (
                        <motion.div key={block.id} {...fadeIn} transition={{ delay: 0.2 + (index * 0.1) }}>
                          <h3 className="text-2xl font-semibold mt-8 mb-4">{block.title}</h3>
                          <div dangerouslySetInnerHTML={{ __html: block.content }} />
                        </motion.div>
                      ))
                    }
                  </motion.div>
                </div>
                
                <div className="space-y-8">
                  {/* Quick Facts Card */}
                  <motion.div 
                    className="bg-white rounded-lg border shadow-sm overflow-hidden"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="bg-navy text-white py-4 px-6">
                      <h3 className="font-medium">Quick Facts</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {school.student_population && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Student Population</span>
                          <span className="font-medium">{school.student_population.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {school.acceptance_rate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Acceptance Rate</span>
                          <span className="font-medium">{(school.acceptance_rate * 100).toFixed(1)}%</span>
                        </div>
                      )}
                      
                      {school.ranking && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">National Ranking</span>
                          <span className="font-medium">#{school.ranking}</span>
                        </div>
                      )}
                      
                      {school.campus_size && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Campus Size</span>
                          <span className="font-medium">{school.campus_size}</span>
                        </div>
                      )}
                      
                      {(school.tuition_in_state || school.tuition_out_state) && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tuition</span>
                          <div className="text-right">
                            {school.tuition_in_state && (
                              <div>In-state: ${school.tuition_in_state.toLocaleString()}</div>
                            )}
                            {school.tuition_out_state && (
                              <div>Out-of-state: ${school.tuition_out_state.toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {school.website_url && (
                        <a 
                          href={school.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 mt-4"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Official Website
                        </a>
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Notable Alumni Card */}
                  {school.notable_alumni && school.notable_alumni.length > 0 && (
                    <motion.div 
                      className="bg-white rounded-lg border shadow-sm overflow-hidden"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="bg-gray-100 py-4 px-6">
                        <h3 className="font-medium">Notable Alumni</h3>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-2">
                          {school.notable_alumni.map((alumnus, index) => (
                            <li key={index} className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{alumnus}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Featured Mentors Card */}
                  {profiles && profiles.length > 0 && (
                    <motion.div 
                      className="bg-white rounded-lg border shadow-sm overflow-hidden"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="bg-blue-50 py-4 px-6 flex justify-between items-center">
                        <h3 className="font-medium">Featured Mentors</h3>
                        <Link to="#profiles" className="text-sm text-blue-600" onClick={() => setActiveTab('profiles')}>
                          View All
                        </Link>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {profiles.slice(0, 3).map((profile: ProfileWithDetails) => (
                            <Link 
                              key={profile.id} 
                              to={`/alumni/${profile.id}`}
                              className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                <img 
                                  src={profile.image || "/placeholder.svg"} 
                                  alt={profile.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{profile.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {profile.major?.name || "Student"}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="academics" className="mt-2 animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6">
                  Academics at {school.name}
                </h2>
                <p className="text-lg mb-8">
                  {school.name} offers a wide range of academic programs designed to prepare students for success in their chosen fields.
                </p>
              </div>

              {majors && majors.length > 0 ? (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Popular Majors</h3>
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
                  
                  <div className="mt-10">
                    {profiles && profiles.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Talk to students in your major</h3>
                        <p className="mb-6">
                          Connect with current students and alumni to get firsthand insights about academic programs.
                        </p>
                        <Button asChild>
                          <Link to={`/browse?school=${school.id}`}>Browse by Major</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No majors information available yet.
                </p>
              )}
            </TabsContent>

            <TabsContent value="activities" className="mt-2 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                Student Life at {school.name}
              </h2>
              <p className="text-lg mb-8">
                Discover the vibrant student life and extracurricular activities that make {school.name} a dynamic place to learn and grow.
              </p>
              
              {activities && activities.length > 0 ? (
                <div className="space-y-12">
                  {/* Clubs Section */}
                  {activities.some(activity => activity.type === 'club') && (
                    <div>
                      <h3 className="text-2xl font-semibold mb-6">Clubs & Organizations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activities
                          .filter(activity => activity.type === 'club')
                          .map((activity) => (
                            <Card key={activity.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                                <div className="bg-tag-club p-2 rounded-full">
                                  <Award className="h-5 w-5 text-tag-club-text" />
                                </div>
                                <CardTitle className="text-lg">{activity.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-500 mt-1 capitalize">
                                  Student Club
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Sports Section */}
                  {activities.some(activity => activity.type === 'sport') && (
                    <div>
                      <h3 className="text-2xl font-semibold mb-6">Athletics & Sports</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activities
                          .filter(activity => activity.type === 'sport')
                          .map((activity) => (
                            <Card key={activity.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                                <div className="bg-tag-sport p-2 rounded-full">
                                  <Activity className="h-5 w-5 text-tag-sport-text" />
                                </div>
                                <CardTitle className="text-lg">{activity.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-500 mt-1 capitalize">
                                  Athletic Program
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Study Abroad Section */}
                  {activities.some(activity => activity.type === 'study_abroad') && (
                    <div>
                      <h3 className="text-2xl font-semibold mb-6">Study Abroad Programs</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activities
                          .filter(activity => activity.type === 'study_abroad')
                          .map((activity) => (
                            <Card key={activity.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                                <div className="bg-tag-study p-2 rounded-full">
                                  <Globe className="h-5 w-5 text-tag-study-text" />
                                </div>
                                <CardTitle className="text-lg">{activity.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-500 mt-1 capitalize">
                                  Study Abroad
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  No activities information available yet.
                </p>
              )}
            </TabsContent>

            <TabsContent value="profiles" className="mt-2 animate-fade-in">
              <div className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-bold">Students & Alumni</h2>
                <Button asChild variant="outline">
                  <Link to="/browse">View All</Link>
                </Button>
              </div>
              
              {profiles && profiles.length > 0 ? (
                <div>
                  <p className="text-lg mb-8">
                    Connect with current students and alumni from {school.name} to get authentic insights about academics, campus life, and career opportunities.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map((profile: ProfileWithDetails) => (
                      <ProfileCard key={profile.id} profile={profile} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No profiles available yet.</p>
              )}
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-2 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                Campus Gallery
              </h2>
              
              {schoolImages && schoolImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schoolImages.map((image, index) => (
                    <motion.div 
                      key={image.id}
                      className="aspect-video rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <img 
                        src={image.image_url} 
                        alt={image.caption || `${school.name} campus`}
                        className="w-full h-full object-cover"
                      />
                      {image.caption && (
                        <div className="p-2 bg-white">
                          <p className="text-sm text-gray-700">{image.caption}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No gallery images available yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SchoolDetail;
