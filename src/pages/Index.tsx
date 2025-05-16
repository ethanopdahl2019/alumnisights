
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TypeWriter from '@/components/TypeWriter';

const placeholderImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";
const studentImage = "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

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
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center bg-white">
          <div className="container-custom relative z-10 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Connect with a <br />
                  <span className="font-serif"><TypeWriter words={schoolExamples} typingSpeed={100} deletingSpeed={50} /></span>
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
                className="hidden lg:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <img 
                  src={studentImage} 
                  alt="Students connecting" 
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Schools Section */}
        <section className="bg-gray-50 py-20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif mb-4">Featured Schools</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
                Connect with students from top universities across the country
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                <Link
                  key={index}
                  to={`/schools/${school.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow text-center cursor-pointer"
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-4">
                    <img src={school.logo} alt={school.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <h3 className="font-serif">{school.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
                Get connected with the right person to guide your college journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm relative">
                <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 font-serif">1</span>
                <h3 className="text-2xl font-serif mb-3">Browse Profiles</h3>
                <p className="text-gray-600 font-sans">
                  Search through our diverse community of students and alumni from your target schools.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm relative">
                <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 font-serif">2</span>
                <h3 className="text-2xl font-serif mb-3">Book a Session</h3>
                <p className="text-gray-600 font-sans">
                  Schedule a personalized conversation at a time that works best for you.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm relative">
                <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 font-serif">3</span>
                <h3 className="text-2xl font-serif mb-3">Get Insider Insights</h3>
                <p className="text-gray-600 font-sans">
                  Gain authentic perspectives about academics, campus life, and admission strategies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif mb-4">What Students Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
                Real stories from students who found their path through alumni connections
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Speaking with someone who had just been through the exact application process I was facing gave me insights that no guidebook could. I got accepted to my dream school!",
                  author: "Taylor R., High School Senior",
                  avatar: "/placeholder.svg"
                },
                {
                  quote: "My mentor helped me understand what classes to prioritize and which professors to seek out. This insider knowledge made my freshman year so much smoother.",
                  author: "Jordan L., Freshman",
                  avatar: "/placeholder.svg"
                },
                {
                  quote: "I was torn between two great schools until I spoke with alumni from both. Their perspectives on campus culture helped me make the best decision for me.",
                  author: "Alex K., Transfer Student",
                  avatar: "/placeholder.svg"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm"
                >
                  <p className="text-lg mb-6 italic text-gray-700 font-sans">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-serif">{testimonial.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-serif mb-6">Ready to find your college mentor?</h2>
              <p className="text-xl mb-10 text-gray-700 font-sans">
                Get personalized insights that can transform your college experience.
                Start your journey today!
              </p>
              <Link to="/browse" className="inline-block px-8 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-sans text-lg">
                Browse Alumni
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
