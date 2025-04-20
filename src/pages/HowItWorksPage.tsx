
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <section className="py-20">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-medium text-center mb-6">How AlumniSights Works</h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Get authentic insights directly from current students and alumni
            </p>
            
            <HowItWorks />
          </div>
        </section>
        
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-medium text-center mb-16">Frequently Asked Questions</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">How do I schedule a conversation?</h3>
                  <p className="text-gray-600">
                    Browse our profiles to find current students or alumni who match your interests.
                    Select your preferred conversation option (15, 30, or 60 minutes) and choose an available
                    time slot that works for you. Once confirmed, you'll receive instructions for connecting.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">What should I prepare for my conversation?</h3>
                  <p className="text-gray-600">
                    We recommend preparing specific questions based on what you'd like to learn.
                    Think about your interests, concerns, and what insider knowledge would be most valuable
                    for your college decision. Our mentors appreciate thoughtful questions!
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">How are conversations conducted?</h3>
                  <p className="text-gray-600">
                    All conversations take place through our secure video platform. You'll receive
                    a link to join at your scheduled time. The platform works on any device with
                    a modern web browser, no downloads required.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Can I request specific topics to discuss?</h3>
                  <p className="text-gray-600">
                    Absolutely! When booking your conversation, you'll have the opportunity to
                    share what topics you'd like to cover. This helps your mentor prepare to
                    give you the most relevant insights.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">How do I become a mentor?</h3>
                  <p className="text-gray-600">
                    Current students and alumni can sign up to become mentors in just a few minutes.
                    Create your profile, share your experiences, and set your availability. You'll earn
                    money for each conversation while helping future students make informed decisions.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <a href="/browse" className="btn-primary">
                  Start Exploring
                </a>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-medium text-center mb-8">What Our Users Say</h2>
              <p className="text-center text-gray-600 mb-16">Hear from students who found their perfect college fit</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 mb-6">
                    "Speaking with a current student gave me insights I never would have gotten from the campus tour.
                    I learned about the real social scene, which professors to seek out, and how to make the most of
                    my first year. Worth every penny!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-medium">Michael T.</h4>
                      <p className="text-sm text-gray-500">Incoming Freshman</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 mb-6">
                    "As a first-generation college student, I had so many questions about what college life is really like.
                    My AlumniSights mentor helped me understand everything from financial aid to campus culture, and gave
                    me the confidence to make my decision."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-medium">Sofia R.</h4>
                      <p className="text-sm text-gray-500">High School Senior</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
