
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSchools } from '@/services/profiles';
import { getFeaturedProfiles } from '@/services/profiles';
import Footer from '@/components/Footer';

const LandingPage = () => {
  // Fetch featured profiles from database
  const { data: profiles = [], isLoading: isProfilesLoading } = useQuery({
    queryKey: ['featuredProfiles'],
    queryFn: getFeaturedProfiles
  });

  // Fetch schools from database
  const { data: schools = [], isLoading: isSchoolsLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: getSchools
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/70 to-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm py-4 px-4">
        <div className="container mx-auto">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-xl font-serif text-navy">
              Alumni Network
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/auth" className="text-navy hover:text-navy/80 font-serif transition-colors">
                Sign In
              </Link>
              <Link to="/sign-up" className="text-navy hover:text-navy/80 font-serif transition-colors">
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl text-navy mb-6 leading-tight">
                Connect with alumni, share experiences, build your network
              </h1>
              <p className="text-lg text-gray-700 mb-10">
                Join our community to connect with alumni, gain insights, and expand your professional connections.
              </p>
              <Link to="/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-medium">
                Browse Alumni
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Featured Profiles Section */}
        <section className="py-16 bg-blue-50/50">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl text-navy text-center mb-12">
              Featured Alumni
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isProfilesLoading ? (
                // Skeleton loading placeholders
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                    <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="flex justify-center gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))
              ) : profiles.length > 0 ? (
                profiles.map(profile => (
                  <Link 
                    to={`/alumni/${profile.id}`} 
                    key={profile.id}
                    className="bg-white rounded-xl overflow-hidden flex flex-col items-center p-6 transition duration-300 hover:shadow-md"
                  >
                    <div className="flex justify-center w-full mb-4">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-sm">
                        <AvatarImage src={profile.image || '/placeholder.svg'} alt={`${profile.name}'s profile`} />
                        <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-serif text-xl text-center mb-1">{profile.name}</h3>
                    <p className="text-gray-600 text-sm text-center mb-2">
                      {profile.school?.name}
                    </p>
                    {profile.major && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        {profile.major.name}
                      </span>
                    )}
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-3">No featured profiles available at this time.</p>
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/browse" className="inline-flex items-center gap-2 text-navy hover:underline">
                Browse All Alumni <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Schools Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl text-navy text-center mb-12">
              Featured Universities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isSchoolsLoading ? (
                // Skeleton loading placeholders
                Array(8).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : schools.length > 0 ? (
                schools.slice(0, 8).map(school => (
                  <Link 
                    to={`/schools/${school.id}`} 
                    key={school.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="h-32 bg-gray-100 relative overflow-hidden">
                      {school.image ? (
                        <img 
                          src={school.image} 
                          alt={school.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                          No image available
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg mb-1 group-hover:text-navy/80 transition-colors">{school.name}</h3>
                      {school.location && (
                        <p className="text-gray-600 text-sm">{school.location}</p>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-4">No schools available at this time.</p>
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/schools" className="inline-flex items-center gap-2 text-navy hover:underline">
                Explore All Schools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl mb-6">Ready to connect with alumni?</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join our growing community and get insights from graduates
              who've walked the same path.
            </p>
            <Link to="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy rounded-lg hover:bg-white/90 transition-colors font-medium">
              Sign Up Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
