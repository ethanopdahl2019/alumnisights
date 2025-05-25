
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TypeWriter from './TypeWriter';
import { ArrowRight, GraduationCap, Users, Calendar, Star } from 'lucide-react';

const schoolExamples = [
  'Harvard economics major',
  'Amherst lacrosse player',
  'Alabama sorority member',
  'Stanford computer science student',
  'Duke basketball player',
  'Berkeley entrepreneur',
  'Yale debate team captain',
  'NYU film student',
  'Michigan engineering major',
  'Georgetown politics student'
];

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center">
        {/* Background video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-20' : 'opacity-0'}`}
            onLoadedData={() => setVideoLoaded(true)}
          >
            <source 
              src="https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-6794-large.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Connect with a <br />
              <TypeWriter words={schoolExamples} typingSpeed={100} deletingSpeed={50} />
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Book conversations with current students and alumni to gain authentic, 
              school-specific insights for your college journey and application process.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.a 
                href="/browse" 
                className="btn-primary min-w-[180px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find Your Connection
              </motion.a>
              <motion.a 
                href="/sign-up" 
                className="btn-secondary min-w-[180px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join as Alumni/Student
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-medium mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get connected with the right person to guide your college journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100">1</span>
              <h3 className="text-2xl font-medium mb-3">Browse Profiles</h3>
              <p className="text-gray-600">
                Search through our diverse community of students and alumni from your target schools.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100">2</span>
              <h3 className="text-2xl font-medium mb-3">Book a Session</h3>
              <p className="text-gray-600">
                Schedule a personalized conversation at a time that works best for you.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100">3</span>
              <h3 className="text-2xl font-medium mb-3">Get Insider Insights</h3>
              <p className="text-gray-600">
                Gain authentic perspectives about academics, campus life, and admission strategies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with uploaded image */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl font-medium mb-6">Learn from those who've walked the path</h2>
              <p className="text-xl mb-8 text-gray-600">
                Our platform connects prospective students with current undergrads and alumni who provide authentic insights about college life, admissions, and academics.
              </p>
              <ul className="space-y-4">
                {[
                  "Get candid advice from students who recently went through admissions",
                  "Learn about campus culture and student life firsthand",
                  "Understand academic expectations for your specific major",
                  "Discover hidden opportunities and resources at your target schools"
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="min-w-6 mt-1">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10">
                <Link to="/browse" className="btn-primary inline-flex items-center">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <img src="/lovable-uploads/3ffcce05-977c-4fe4-a829-ae51510fa0ed.png" alt="Students walking on campus" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-100 rounded-lg -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-100 rounded-lg -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-medium mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from students who found their path through alumni connections
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Speaking with someone who had just been through the exact application process I was facing gave me insights that no guidebook could. I got accepted to my dream school!",
                author: "Taylor R., High School Senior",
                avatar: "/placeholder.svg",
                rating: 5
              },
              {
                quote: "My mentor helped me understand what classes to prioritize and which professors to seek out. This insider knowledge made my freshman year so much smoother.",
                author: "Jordan L., Freshman",
                avatar: "/placeholder.svg",
                rating: 5
              },
              {
                quote: "I was torn between two great schools until I spoke with alumni from both. Their perspectives on campus culture helped me make the best decision for me.",
                author: "Alex K., Transfer Student",
                avatar: "/placeholder.svg",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-lg mb-6 italic text-gray-700">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium">{testimonial.author}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/browse" className="btn-secondary inline-flex items-center">
              Find Your Match
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Updated CTA Section with modern design */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
          <div className="absolute top-1/2 right-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Ready to find your college mentor?
              </h2>
              <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Get personalized insights that can transform your college experience.
                Start your journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/browse" className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Users className="mr-2 h-5 w-5" />
                    Browse Alumni
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/sign-up" className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:-translate-y-1">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Join as a Mentor
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
