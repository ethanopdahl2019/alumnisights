
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HowItWorksComponent from '@/components/HowItWorks';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/70 to-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="max-w-xl">
                <h1 className="text-4xl font-serif font-bold text-navy mb-6">
                  How AlumniSights Works
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  We connect prospective students with current students and alumni who've been in your shoes.
                  Get authentic insights, personalized advice, and make confident decisions about your education.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-medium">
                    Browse Profiles <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/become-mentor" className="inline-flex items-center gap-2 px-6 py-3 border border-navy text-navy rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Become a Mentor <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Students collaborating" 
                  className="rounded-lg shadow-lg w-full"
                />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Process Steps */}
        <HowItWorksComponent />
        
        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-serif font-bold text-navy mb-12 text-center">
              Why Connect Through AlumniSights?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">Authentic Perspectives</h3>
                <p className="text-gray-700">
                  Get beyond the glossy brochures and marketing materials. Hear what life is really like from people who've experienced it firsthand.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">Personalized Advice</h3>
                <p className="text-gray-700">
                  Every student's journey is unique. Get advice tailored to your specific situation, goals, and concerns from someone who understands.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-purple-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">Verified Mentors</h3>
                <p className="text-gray-700">
                  All our mentors go through a verification process to ensure they have genuine experience at the institutions they represent.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Detailed */}
        <section className="py-16 px-4 sm:px-6 bg-blue-50/80">
          <div className="container mx-auto">
            <h2 className="text-3xl font-serif font-bold text-navy mb-12 text-center">
              The Connection Process
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Browsing profiles" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-medium mb-4">1. Find Your Match</h3>
                <p className="text-gray-700 mb-4">
                  Browse our directory of verified alumni and current students. Filter by school, major, activities, and more to find someone who matches your interests.
                </p>
                <p className="text-gray-700">
                  Each profile includes background information, areas of expertise, and availability, making it easy to find the perfect match for your needs.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
              <div className="md:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Scheduling a call" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="md:order-1">
                <h3 className="text-2xl font-serif font-medium mb-4">2. Book A Conversation</h3>
                <p className="text-gray-700 mb-4">
                  Choose between 15, 30, or 60-minute sessions based on your needs. Our intuitive booking system allows you to select a time that works for both parties.
                </p>
                <p className="text-gray-700">
                  You can include specific questions or topics you'd like to discuss, allowing mentors to prepare for your session in advance.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Video call" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-medium mb-4">3. Connect and Learn</h3>
                <p className="text-gray-700 mb-4">
                  Meet via our secure video platform at your scheduled time. Ask questions, seek advice, and gain valuable insights to inform your academic and career decisions.
                </p>
                <p className="text-gray-700">
                  After your session, you can leave feedback, save notes from your conversation, and even maintain an ongoing connection with your mentor.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-serif font-bold text-navy mb-12 text-center">
              Student Success Stories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 overflow-hidden rounded-full mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                      alt="Alex J." 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-medium">Alex J.</h3>
                    <p className="text-sm text-gray-600">Harvard University '24</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "My conversation with a current Harvard student gave me insights I couldn't find anywhere else. 
                  They helped me understand what the admissions committee was really looking for and how to make 
                  my application stand out."
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 overflow-hidden rounded-full mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                      alt="Maya T." 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-medium">Maya T.</h3>
                    <p className="text-sm text-gray-600">Stanford University '25</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "I was torn between two universities, but after speaking with alumni from both, I had a much 
                  clearer picture of which program would better suit my goals and learning style. Best decision 
                  I could have made!"
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 bg-navy text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
              Browse our network of verified mentors and start getting the insights you need
              to make confident decisions about your education.
            </p>
            <Link to="/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy rounded-lg hover:bg-white/90 transition-colors font-medium">
              Find Your Connection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
