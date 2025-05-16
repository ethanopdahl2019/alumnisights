
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <Hero />

        {/* Schools Section */}
        <section className="py-24 bg-soft-gray">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="heading-serif text-4xl mb-4">Discover Top Schools</h2>
              <p className="text-sans text-lg text-gray-600 max-w-2xl mx-auto">
                Explore universities and connect with students who share your interests and aspirations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Harvard University", image: "/placeholder.svg", path: "/schools/undergraduate-admissions/harvard-university" },
                { name: "Stanford University", image: "/placeholder.svg", path: "/schools/undergraduate-admissions/stanford-university" },
                { name: "Massachusetts Institute of Technology", image: "/placeholder.svg", path: "/schools/undergraduate-admissions/massachusetts-institute-of-technology-mit" }
              ].map((school, index) => (
                <Link to={school.path} key={index}>
                  <motion.div 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={school.image} 
                        alt={school.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="heading-serif text-xl mb-2">{school.name}</h3>
                      <p className="text-sans text-gray-600">
                        Click to explore this university
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/schools" className="inline-block font-medium text-navy border-b border-navy hover:border-navy/70 hover:text-navy/70 transition-all cursor-pointer">
                View All Schools
              </Link>
            </div>
          </div>
        </section>
        
        {/* Connect with Alumni Section */}
        <section className="py-24">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <img 
                  src="/placeholder.svg" 
                  alt="Students conversing" 
                  className="w-full h-auto rounded-xl shadow-md"
                />
              </div>
              
              <div>
                <h2 className="heading-serif text-4xl mb-6">Connect with Someone Who's Been There</h2>
                <p className="text-sans text-lg text-gray-600 mb-8">
                  Our platform matches you with current students and alumni who can provide authentic insights about college life, admissions, and academics tailored to your interests.
                </p>
                <Link to="/browse" className="inline-block font-medium text-navy border-b border-navy hover:border-navy/70 hover:text-navy/70 transition-all cursor-pointer">
                  Browse Alumni
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-24 bg-soft-gray">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="heading-serif text-4xl mb-4">What Students Say</h2>
              <p className="text-sans text-lg text-gray-600 max-w-2xl mx-auto">
                Real stories from students who found their path through alumni connections
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Speaking with someone who had just been through the exact application process I was facing gave me insights that no guidebook could. I got accepted to my dream school!",
                  author: "Taylor R.",
                  position: "High School Senior",
                  avatar: "/placeholder.svg",
                },
                {
                  quote: "My mentor helped me understand what classes to prioritize and which professors to seek out. This insider knowledge made my freshman year so much smoother.",
                  author: "Jordan L.",
                  position: "Freshman",
                  avatar: "/placeholder.svg",
                },
                {
                  quote: "I was torn between two great schools until I spoke with alumni from both. Their perspectives on campus culture helped me make the best decision for me.",
                  author: "Alex K.",
                  position: "Transfer Student",
                  avatar: "/placeholder.svg",
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <p className="text-sans text-lg mb-6 italic text-gray-700">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="heading-serif font-medium">{testimonial.author}</p>
                      <p className="text-sans text-gray-600">{testimonial.position}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-24">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="heading-serif text-4xl mb-4">How It Works</h2>
              <p className="text-sans text-lg text-gray-600 max-w-2xl mx-auto">
                Get connected with the right person to guide your college journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  step: "1",
                  title: "Browse Profiles", 
                  description: "Search through our diverse community of students and alumni from your target schools.",
                  image: "/placeholder.svg"
                },
                { 
                  step: "2",
                  title: "Book a Session", 
                  description: "Schedule a personalized conversation at a time that works best for you.",
                  image: "/placeholder.svg"
                },
                { 
                  step: "3",
                  title: "Get Insider Insights", 
                  description: "Gain authentic perspectives about academics, campus life, and admission strategies.",
                  image: "/placeholder.svg"
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute top-8 right-8 text-5xl font-serif text-gray-100 opacity-60">
                    {item.step}
                  </div>
                  <div className="mb-6 h-48">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <h3 className="heading-serif text-xl mb-3">{item.title}</h3>
                  <p className="text-sans text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-navy text-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="heading-serif text-4xl mb-6">Ready to find your college mentor?</h2>
              <p className="text-sans text-xl mb-10 opacity-90">
                Get personalized insights that can transform your college experience.
                Start your journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/browse" className="bg-white text-navy px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                  Browse Alumni
                </Link>
                <Link to="/sign-up" className="border border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white/10 transition-colors cursor-pointer">
                  Join as a Mentor
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
