
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
        <section className="py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Discover Your Path to Success</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Connect with alumni who've walked the path before you, get insights into universities,
                and prepare for your academic journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border border-gray-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg mb-2">Connect with Alumni</h3>
                  <p className="text-gray-600 mb-4">Get advice from graduates who've been in your shoes</p>
                  <Link to="/browse" className="clickable text-blue-600">
                    Browse Alumni <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg mb-2">University Insights</h3>
                  <p className="text-gray-600 mb-4">Explore detailed information about universities and programs</p>
                  <Link to="/insights/undergraduate-admissions" className="clickable text-green-600">
                    View Universities <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg mb-2">Industry Knowledge</h3>
                  <p className="text-gray-600 mb-4">Gain insights into different careers and industries</p>
                  <Link to="/insights/industry" className="clickable text-purple-600">
                    Explore Industries <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-orange-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg mb-2">Campus Life</h3>
                  <p className="text-gray-600 mb-4">Learn about clubs, activities, and campus culture</p>
                  <Link to="/insights/clubs-and-greek-life" className="clickable text-orange-600">
                    Discover Campus Life <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Updated CTA Section with modern design */}
        <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-2000"></div>
          </div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Join thousands of successful students
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Ready to start your journey?
            </h2>
            
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Create an account today and get personalized guidance for your academic future. 
              Connect with mentors who understand your goals and can help you achieve them.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/auth" 
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  <Target className="w-5 h-5 mr-2 inline" />
                  Sign Up Now
                </span>
              </Link>
              
              <Link 
                to="/browse" 
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <Users className="w-5 h-5 mr-2" />
                Browse Alumni
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-blue-200">
              <span className="inline-flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
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
