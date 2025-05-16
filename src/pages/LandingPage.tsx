
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Users, Calendar, Star, BookOpen, Briefcase, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            <div className="flex items-center gap-6">
              <Link to="/auth" className="text-navy hover:text-navy/80 transition-colors text-base font-serif">
                Sign In
              </Link>
              <Link to="/sign-up" className="text-navy hover:text-navy/80 transition-colors text-base font-serif">
                Sign Up
              </Link>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div 
                className="max-w-2xl"
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
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="Students talking" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-lg -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-blue-50/50">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl text-navy text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  icon: <Users className="w-8 h-8 text-blue-600" />,
                  title: "Browse Profiles",
                  description: "Find alumni with experience in areas you're interested in."
                },
                {
                  icon: <Calendar className="w-8 h-8 text-green-600" />,
                  title: "Schedule a Chat",
                  description: "Book a convenient time for a virtual conversation."
                },
                {
                  icon: <GraduationCap className="w-8 h-8 text-purple-600" />,
                  title: "Get Insights",
                  description: "Learn from real experiences and get your questions answered."
                },
                {
                  icon: <Star className="w-8 h-8 text-amber-600" />,
                  title: "Make Decisions",
                  description: "Use authentic insights to guide your educational journey."
                }
              ].map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-serif text-xl mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Profiles Section */}
        <section className="py-16">
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

        {/* Why Use Our Platform */}
        <section className="py-16 bg-blue-50/50">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl text-navy text-center mb-12">
              Why Connect Through Our Platform
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-duration-300">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-serif text-xl mb-3">Authentic Insights</h3>
                <p className="text-gray-600">
                  Get beyond the glossy brochures. Hear honest perspectives from people who've actually been there.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-serif text-xl mb-3">Personalized Guidance</h3>
                <p className="text-gray-600">
                  Every student's journey is unique. Get advice tailored to your specific situation and goals.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-duration-300">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-serif text-xl mb-3">Comprehensive Resources</h3>
                <p className="text-gray-600">
                  Access guides, articles, and tools to help you navigate every aspect of your educational journey.
                </p>
              </div>
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
                          <School className="h-12 w-12 text-gray-400" />
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

        {/* Testimonials */}
        <section className="py-16 bg-blue-50/50">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl text-navy text-center mb-12">
              What Students Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Speaking with an alumni who had just been through the exact application process gave me insights no guidebook could offer.",
                  name: "Taylor R.",
                  school: "Harvard '26",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                },
                {
                  quote: "My mentor helped me understand what classes to prioritize and which professors to seek out. This insider knowledge was invaluable.",
                  name: "Jordan L.",
                  school: "Stanford '25",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                },
                {
                  quote: "I was torn between two schools until I connected with alumni from both. Their perspectives helped me make the right choice.",
                  name: "Alex K.",
                  school: "Yale '24",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.school}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Resource Highlights */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl text-navy text-center mb-12">
              Resources to Support Your Journey
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link 
                to="/resources" 
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row group"
              >
                <div className="md:w-1/3 h-40 md:h-auto relative">
                  <img 
                    src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Application guides" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="font-serif text-xl mb-2 group-hover:text-navy/80 transition-colors">Application Guides</h3>
                  <p className="text-gray-600 mb-4">
                    Step-by-step resources to help you create standout applications for your dream schools.
                  </p>
                  <div className="flex items-center text-navy group-hover:underline">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
              
              <Link 
                to="/insights/graduate-admissions" 
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row group"
              >
                <div className="md:w-1/3 h-40 md:h-auto relative">
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Graduate admissions" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="font-serif text-xl mb-2 group-hover:text-navy/80 transition-colors">Graduate Admissions</h3>
                  <p className="text-gray-600 mb-4">
                    Expert advice and guides on navigating the graduate school application process.
                  </p>
                  <div className="flex items-center text-navy group-hover:underline">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/resources" className="inline-flex items-center gap-2 text-navy hover:underline">
                View All Resources <ArrowRight className="h-4 w-4" />
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
