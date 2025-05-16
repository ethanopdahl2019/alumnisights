
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getSchools, getFeaturedProfiles } from '@/services/profiles';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const HomePage = () => {
  // Fetch featured profiles from database
  const { data: profiles = [] } = useQuery({
    queryKey: ['featuredProfiles'],
    queryFn: getFeaturedProfiles
  });

  // Fetch schools from database
  const { data: schools = [] } = useQuery({
    queryKey: ['schools'],
    queryFn: getSchools
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
            alt="University campus"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-white/70"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-medium mb-8 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Connect with<br />university insight
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Get authentic perspectives from current students and alumni to guide your educational journey
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link to="/browse" className="btn-primary text-lg">
                Explore Connections
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Schools Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-medium mb-6">Distinguished Schools</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore insights from students at these prestigious institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {schools.slice(0, 6).map((school, index) => (
              <motion.div 
                key={school.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="cursor-pointer"
              >
                <Link to={`/schools/${school.id}`} className="block group">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-64">
                    {school.image ? (
                      <img 
                        src={school.image} 
                        alt={school.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <p className="font-serif text-xl text-gray-400">{school.name}</p>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl mt-4">{school.name}</h3>
                  {school.location && (
                    <p className="text-gray-500 mt-1">{school.location}</p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/schools" className="btn-secondary text-lg">
              View All Schools
            </Link>
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-medium mb-6">Meet Our Alumni</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with students and graduates who share their authentic experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {profiles.slice(0, 6).map((profile, index) => (
              <motion.div 
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="cursor-pointer"
              >
                <Link to={`/alumni/${profile.id}`} className="block group">
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-sm mb-6">
                      <AvatarImage src={profile.image || '/placeholder.svg'} alt={profile.name} />
                      <AvatarFallback>{profile.name?.charAt(0) || 'A'}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-serif text-2xl mb-1 text-center">{profile.name}</h3>
                    {profile.school && (
                      <p className="text-gray-500 mb-1 text-center">{profile.school.name}</p>
                    )}
                    {profile.major && (
                      <p className="text-gray-500 text-center">{profile.major.name}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/browse" className="btn-secondary text-lg">
              Browse All Alumni
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-medium mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to gain valuable college insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-10 relative"
            >
              <span className="absolute top-6 right-6 text-8xl font-serif text-gray-100">1</span>
              <h3 className="font-serif text-2xl mb-4 relative z-10">Browse Profiles</h3>
              <p className="text-lg text-gray-600 relative z-10">
                Search through our diverse community of students and alumni from your target schools.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-10 relative"
            >
              <span className="absolute top-6 right-6 text-8xl font-serif text-gray-100">2</span>
              <h3 className="font-serif text-2xl mb-4 relative z-10">Schedule a Session</h3>
              <p className="text-lg text-gray-600 relative z-10">
                Book a personalized conversation at a time that works for your schedule.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-10 relative"
            >
              <span className="absolute top-6 right-6 text-8xl font-serif text-gray-100">3</span>
              <h3 className="font-serif text-2xl mb-4 relative z-10">Get Insider Insights</h3>
              <p className="text-lg text-gray-600 relative z-10">
                Gain authentic perspectives about academics, campus life, and admission strategies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-medium mb-6">Student Experiences</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Authentic stories from students who found their path
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                quote: "Speaking with alumni who had just been through the exact application process gave me insights no guidebook could offer. It made all the difference in my acceptance.",
                author: "Taylor Robertson",
                school: "Harvard '26",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
              },
              {
                quote: "My mentor helped me understand what classes to prioritize and which professors to seek out. This insider knowledge made my transition to college incredibly smooth.",
                author: "Jordan Lee",
                school: "Stanford '25",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
              },
              {
                quote: "I was torn between two schools until I connected with alumni from both. Their perspectives on campus culture helped me make the right decision for my unique goals.",
                author: "Alex Kim",
                school: "Yale '24",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-8"
              >
                <p className="text-lg italic text-gray-700 mb-8">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-gray-500">{testimonial.school}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-medium mb-8">Begin Your Journey</h2>
            <p className="text-xl mb-12 opacity-90">
              Get personalized insights that can transform your educational experience
            </p>
            <Link to="/browse" className="btn-primary bg-white text-navy hover:bg-gray-100 text-lg px-12 py-4">
              Explore Connections
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
