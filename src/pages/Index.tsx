
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Users, Building, Star } from 'lucide-react';
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
                  <Link to="/schools" className="clickable text-green-600">
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
        
        {/* Feature Schools Section - now using real data */}
        <FeaturedSchools />
        
        {/* CTA Section */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl mb-4">Ready to start your journey?</h2>
            <p className="text-gray-600 mb-6">Create an account today and get personalized guidance for your academic future.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth" className="clickable-primary text-lg py-2">
                Sign Up Now
              </Link>
              <Link to="/browse" className="clickable-secondary text-lg py-2">
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
