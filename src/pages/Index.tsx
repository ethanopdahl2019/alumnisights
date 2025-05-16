import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TypeWriter from '@/components/TypeWriter';
import { getImagesByCategory, getRandomImages, ImageData } from '@/data/images';
import profiles from '@/data/profiles';

const schoolExamples = [
  'Harvard economics major',
  'Amherst lacrosse player',
  'Alabama sorority member',
  'Stanford computer science student',
  'Duke basketball player',
  'Berkeley entrepreneur',
  'Yale debate team captain'
];

const Index = () => {
  const [studentImages, setStudentImages] = useState<ImageData[]>([]);
  const [campusImages, setCampusImages] = useState<ImageData[]>([]);
  const [profileImages, setProfileImages] = useState<ImageData[]>([]);
  const [featuredProfiles, setFeaturedProfiles] = useState(profiles.slice(0, 6));
  
  useEffect(() => {
    // Initialize images
    setStudentImages(getImagesByCategory('students', 6));
    setCampusImages(getImagesByCategory('campus', 4));
    setProfileImages(getImagesByCategory('profile', 6));
    
    // Shuffle featured profiles every 10 seconds
    const interval = setInterval(() => {
      const shuffled = [...profiles].sort(() => 0.5 - Math.random());
      setFeaturedProfiles(shuffled.slice(0, 6));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-soft-beige">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center bg-soft-beige">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
          </div>
          
          <div className="container-custom relative z-10 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-alice mb-6 tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Connect with a <br />
                  <span className="font-alice"><TypeWriter words={schoolExamples} typingSpeed={100} deletingSpeed={50} /></span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-700 mb-10 font-sans"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Book conversations with current students and alumni to gain authentic, 
                  school-specific insights for your college journey and application process.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Link 
                    to="/browse" 
                    className="inline-block px-8 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-sans text-lg"
                  >
                    Find Your Connection
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="hidden lg:grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {studentImages.slice(0, 4).map((image, index) => (
                  <motion.div 
                    key={image.id}
                    className="overflow-hidden rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <div className="mt-16 lg:mt-24">
              <h2 className="text-2xl font-alice mb-6 text-center">Featured Alumni & Students</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {featuredProfiles.map((profile, index) => (
                  <motion.div 
                    key={profile.id}
                    className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 text-center transform transition-all duration-300 moving-element"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3">
                      <img 
                        src={profileImages[index % profileImages.length]?.src || profile.avatar} 
                        alt={`${profile.name}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-medium font-sans line-clamp-1">{profile.name}</h3>
                    <p className="text-xs text-gray-600 font-sans line-clamp-1">{profile.school}</p>
                    <p className="text-xs text-gray-500 font-sans line-clamp-1">{profile.major}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Campus Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <motion.h2 
                className="text-4xl font-alice mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Discover Your Perfect Campus
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Explore universities across the country and connect with people who know them best
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {campusImages.map((image, index) => (
                <motion.div 
                  key={image.id} 
                  className="overflow-hidden rounded-lg shadow-md bg-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-alice text-xl mb-2">{image.alt}</h3>
                    <p className="text-gray-600 text-sm font-sans mb-4">{image.caption}</p>
                    <Link to="/schools" className="text-navy font-medium text-sm hover:underline font-sans">
                      Explore More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/schools" 
                className="inline-block border-b border-navy text-navy hover:border-navy/70 hover:text-navy/70 transition-colors font-sans"
              >
                View All Schools
              </Link>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-soft-beige">
          <div className="container-custom">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-alice mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                How It Works
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Get connected with the right person to guide your college journey
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 font-alice">1</span>
                <h3 className="text-2xl font-alice mb-3">Browse Profiles</h3>
                <p className="text-gray-600 font-sans">
                  Search through our diverse community of students and alumni from your target schools.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 font-alice">2</span>
                <h3 className="text-2xl font-alice mb-3">Book a Session</h3>
                <p className="text-gray-600 font-sans">
                  Schedule a personalized conversation at a time that works best for you.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 font-alice">3</span>
                <h3 className="text-2xl font-alice mb-3">Get Insider Insights</h3>
                <p className="text-gray-600 font-sans">
                  Gain authentic perspectives about academics, campus life, and admission strategies.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-alice mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                What Students Say
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Real stories from students who found their path through alumni connections
              </motion.p>
            </div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                {
                  quote: "Speaking with someone who had just been through the exact application process I was facing gave me insights that no guidebook could. I got accepted to my dream school!",
                  author: "Taylor R., High School Senior",
                  avatar: profileImages[0]?.src || "/placeholder.svg"
                },
                {
                  quote: "My mentor helped me understand what classes to prioritize and which professors to seek out. This insider knowledge made my freshman year so much smoother.",
                  author: "Jordan L., Freshman",
                  avatar: profileImages[1]?.src || "/placeholder.svg"
                },
                {
                  quote: "I was torn between two great schools until I spoke with alumni from both. Their perspectives on campus culture helped me make the best decision for me.",
                  author: "Alex K., Transfer Student",
                  avatar: profileImages[2]?.src || "/placeholder.svg"
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <p className="text-lg mb-6 italic text-gray-700 font-sans">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gray-200">
                      <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-alice">{testimonial.author}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="mt-12 text-center">
              <Link to="/testimonials" className="text-navy font-medium hover:underline inline-block border-b border-navy font-sans">
                Read More Stories
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Schools */}
        <section className="py-20 bg-soft-beige">
          <div className="container-custom">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-alice mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Featured Schools
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Connect with students from top universities across the country
              </motion.p>
            </div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { name: "Harvard University", logo: "/placeholder.svg" },
                { name: "Stanford University", logo: "/placeholder.svg" },
                { name: "MIT", logo: "/placeholder.svg" },
                { name: "Yale University", logo: "/placeholder.svg" },
                { name: "Princeton University", logo: "/placeholder.svg" },
                { name: "Columbia University", logo: "/placeholder.svg" },
                { name: "UC Berkeley", logo: "/placeholder.svg" },
                { name: "University of Michigan", logo: "/placeholder.svg" }
              ].map((school, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow text-center animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-4">
                    <img src={school.logo} alt={school.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <h3 className="font-alice">{school.name}</h3>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="text-center mt-12">
              <Link to="/schools" className="inline-block border-b border-navy text-navy hover:border-navy/70 hover:text-navy/70 transition-colors font-sans">
                View All Schools
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2 
                className="text-4xl font-alice mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Ready to find your college mentor?
              </motion.h2>
              <motion.p 
                className="text-xl mb-10 text-gray-700 font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Get personalized insights that can transform your college experience.
                Start your journey today!
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Link to="/browse" className="inline-block px-8 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-sans text-lg">
                  Browse Alumni
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
