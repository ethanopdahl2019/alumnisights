
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BecomeMentor = () => {
  const benefits = [
    {
      title: "Make a difference",
      description: "Help shape the next generation of students by sharing your experiences and knowledge"
    },
    {
      title: "Earn extra income",
      description: "Set your own rates and availability, earning money while helping others"
    },
    {
      title: "Expand your network",
      description: "Connect with driven students and professionals in your field"
    },
    {
      title: "Strengthen your skills",
      description: "Develop your communication and mentorship abilities through meaningful conversations"
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create your profile",
      description: "Sign up and build your mentor profile highlighting your education, experiences, and expertise"
    },
    {
      number: "02",
      title: "Complete verification",
      description: "Verify your identity and credentials to build trust with potential mentees"
    },
    {
      number: "03",
      title: "Set your availability",
      description: "Define when you're available for conversations and what types of sessions you offer"
    },
    {
      number: "04",
      title: "Start connecting",
      description: "Begin receiving booking requests and helping prospective students navigate their educational journey"
    }
  ];

  const faqs = [
    {
      question: "How much time do I need to commit?",
      answer: "You're in complete control of your schedule. You can offer as few or as many time slots as you'd like, and you can adjust your availability at any time."
    },
    {
      question: "How much can I earn as a mentor?",
      answer: "Your earnings depend on your rates and the number of sessions you conduct. Many of our mentors earn between $20-50 per hour, but you set your own rates based on your experience and the type of guidance you provide."
    },
    {
      question: "What types of mentoring can I offer?",
      answer: "You can offer various session formats, from quick 15-minute introductory calls to in-depth 60-minute consultations. Common topics include application advice, field-specific insights, campus life experiences, and more."
    },
    {
      question: "How does the verification process work?",
      answer: "We verify mentors through a combination of university email verification, LinkedIn profile confirmation, and review of academic credentials. This ensures that all mentors have genuine experience at the institutions they represent."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Share Your Insights, Shape Futures
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Join our network of current students and alumni who help prospective students 
              make confident decisions about their education through authentic conversations.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/auth?mentor=true">Apply to Become a Mentor</Link>
            </Button>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Become a Mentor?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-medium mb-3">{benefit.title}</h3>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-8 h-full border border-gray-200 shadow-sm">
                    <div className="text-3xl font-light text-gray-300 mb-4">{step.number}</div>
                    <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                    <p className="text-gray-700">{step.description}</p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Mentors Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700 italic mb-6">
                  "Being an AlumniSights mentor has been incredibly rewarding. I've been able to help students just like me navigate the overwhelming college application process while earning extra income on my own schedule."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-medium">David Lee</h4>
                    <p className="text-sm text-gray-600">Stanford University '22</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700 italic mb-6">
                  "I wish I had access to this kind of guidance when I was applying to schools. Now I get to be the mentor I needed, helping first-generation students like myself navigate the complex world of higher education."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-medium">Maria Rodriguez</h4>
                    <p className="text-sm text-gray-600">NYU '23</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make an Impact?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Join our community of mentors and start sharing your valuable insights with prospective students.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="px-8">
                <Link to="/auth?mentor=true">Apply Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BecomeMentor;
