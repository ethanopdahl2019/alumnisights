
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Users, Building, Star, Sparkles, Target } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import FeaturedSchools from '@/components/FeaturedSchools';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Feature Schools Section with scroll hijack effect */}
        <FeaturedSchools />

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4 font-serif font-bold text-navy">Discover Your Path to Success</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-sans">
                Connect with alumni who've walked the path before you, get insights into universities,
                and prepare for your academic journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border border-gray-200 hover:shadow-lg transition-all bg-white">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg mb-2 font-serif font-bold text-navy">Connect with Alumni</h3>
                  <p className="text-gray-600 mb-4 font-sans">Get advice from graduates who've been in your shoes</p>
                  <Link to="/browse" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                    Browse Alumni <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 hover:shadow-lg transition-all bg-white">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg mb-2 font-serif font-bold text-navy">University Insights</h3>
                  <p className="text-gray-600 mb-4 font-sans">Explore detailed information about universities and programs</p>
                  <Link to="/insights/undergraduate-admissions" className="inline-flex items-center text-green-600 font-semibold hover:text-green-800 transition-colors">
                    View Universities <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 hover:shadow-lg transition-all bg-white">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg mb-2 font-serif font-bold text-navy">Industry Knowledge</h3>
                  <p className="text-gray-600 mb-4 font-sans">Gain insights into different careers and industries</p>
                  <Link to="/insights/industry" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                    Explore Industries <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 hover:shadow-lg transition-all bg-white">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-orange-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg mb-2 font-serif font-bold text-navy">Campus Life</h3>
                  <p className="text-gray-600 mb-4 font-sans">Learn about clubs, activities, and campus culture</p>
                  <Link to="/insights/clubs-and-greek-life" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-800 transition-colors">
                    Discover Campus Life <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Updated CTA Section */}
        <section className="py-20 px-4 sm:px-6 bg-white border-t">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-navy/10 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2 text-navy" />
              <span className="text-navy font-sans">Join thousands of successful students</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight text-navy">
              Ready to start your journey?
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-sans">
              Create an account today and get personalized guidance for your academic future. 
              Connect with mentors who understand your goals and can help you achieve them.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/auth" 
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-navy text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Target className="w-5 h-5 mr-2" />
                Sign Up Now
              </Link>
              
              <Link 
                to="/browse" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-navy text-navy font-semibold rounded-xl hover:bg-navy hover:text-white transition-all duration-300 transform hover:-translate-y-1"
              >
                <Users className="w-5 h-5 mr-2" />
                Browse Alumni
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-600 font-sans">
              <span className="inline-flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Free to join • No hidden fees • Connect instantly
              </span>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
