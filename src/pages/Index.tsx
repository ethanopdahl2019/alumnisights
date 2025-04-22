import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProfiles } from '@/services/profiles';
import type { ProfileWithDetails } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import ProfileCard from '@/components/ProfileCard';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInView } from '@/hooks/use-in-view';
import { MoveRight } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const [profiles, setProfiles] = useState<ProfileWithDetails[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const profilesRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const schoolsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
  const profilesInView = useInView(profilesRef, { once: true, threshold: 0.1 });
  const benefitsInView = useInView(benefitsRef, { once: true, threshold: 0.1 });
  const successInView = useInView(successRef, { once: true, threshold: 0.1 });
  const schoolsInView = useInView(schoolsRef, { once: true, threshold: 0.1 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, threshold: 0.1 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const featuredProfiles = await getFeaturedProfiles();
        setProfiles(featuredProfiles);
        
        const { data: schoolsData } = await supabase
          .from('schools')
          .select('id, name, image')
          .order('name');
          
        setSchools(schoolsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const benefits = [
    {
      title: "Authentic Insights",
      description: "Get real, unfiltered advice from current students and recent graduates who've been in your shoes.",
      icon: "M12 15V3m0 12l-4-4m4 4l4-4",
    },
    {
      title: "Direct Connections",
      description: "Book one-on-one conversations tailored to your specific interests and questions.",
      icon: "M8 7h8M8 12h4",
    },
    {
      title: "Inside Access",
      description: "Learn about campus culture, hidden gems, and how to navigate the realities of college life.",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2a2 2 0 012 2v2.945",
    },
    {
      title: "Career Clarity",
      description: "Connect with alumni in your desired career path to gain clarity on your academic journey.",
      icon: "M2 3h6a4 4 0 014 4v14a3 3 0 01-3 3H2z",
    },
  ];

  const successStories = [
    {
      name: "Sarah J.",
      story: "After speaking with a Harvard economics major, I completely changed my application strategy. I got accepted to 3 of my top choice schools!",
      image: "/placeholder.svg",
    },
    {
      name: "Michael T.",
      story: "Talking to an alumni from my dream school gave me the confidence to apply. Their advice on the essay portion was invaluable.",
      image: "/placeholder.svg",
    },
    {
      name: "Aisha K.",
      story: "The insights I got about campus life and activities helped me decide between two great schools. Best decision I've made!",
      image: "/placeholder.svg",
    },
  ];

  const testimonials = [
    {
      quote: "This platform opened doors I never knew existed. My mentor helped me navigate the complex world of college applications.",
      author: "Jamie Smith, UCLA Freshman",
    },
    {
      quote: "Being able to talk with someone who was exactly where I wanted to be was game-changing for my college decision.",
      author: "Alex Johnson, High School Senior",
    },
    {
      quote: "The advice I received was more valuable than anything I found in college guidebooks or websites.",
      author: "Taylor Rodriguez, Stanford Applicant",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        
        <section className="py-12 bg-gray-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">
              Connect with Students & Alumni for Authentic Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized application guidance and insider perspectives from current 
              students and alumni who've walked the path you're considering.
            </p>
          </div>
        </section>

        <section 
          ref={profilesRef}
          className={`py-20 transition-all duration-1000 ${
            profilesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-medium text-center mb-4">Featured Alumni</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Connect with current students and alumni from top schools across the country
            </p>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Carousel slidesToShow={isMobile ? 1 : Math.min(3, profiles.length)}>
                {profiles.map(profile => (
                  <ProfileCard 
                    key={profile.id}
                    profile={profile}
                  />
                ))}
              </Carousel>
            )}
            <div className="mt-12 text-center">
              <Link to="/browse" className="btn-secondary inline-flex items-center">
                View All Profiles
                <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section 
          ref={benefitsRef}
          className={`py-20 bg-gray-50 transition-all duration-1000 delay-100 ${
            benefitsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-medium text-center mb-4">Why Connect with Alumni?</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Gain valuable insights that you won't find in brochures or official websites
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-500 hover:shadow-md ${
                    benefitsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-tag-major rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-tag-major-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={benefit.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section 
          ref={successRef}
          className={`py-20 transition-all duration-1000 delay-200 ${
            successInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-medium text-center mb-4">Success Stories</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Real students who found their path through alumni connections
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div 
                  key={index} 
                  className={`bg-white border border-gray-100 p-6 rounded-xl transition-all duration-500 ${
                    successInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center mb-4">
                    <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full mr-4" />
                    <h3 className="text-xl font-medium">{story.name}</h3>
                  </div>
                  <p className="text-gray-600 italic">"{story.story}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section 
          ref={schoolsRef}
          className={`py-20 bg-gray-50 overflow-hidden transition-all duration-1000 delay-300 ${
            schoolsInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-medium text-center mb-4">Schools We Cover</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Connect with students from diverse institutions across the country
            </p>
            
            <div className="relative">
              <div className="flex animate-marquee space-x-8">
                {schools.map((school) => (
                  <Link 
                    key={school.id} 
                    to={`/schools/${school.id}`}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden p-2 transition-transform duration-300 group-hover:scale-110">
                      {school.image ? (
                        <img src={school.image} alt={school.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-3xl font-bold text-navy">{school.name.charAt(0)}</div>
                      )}
                    </div>
                    <span className="mt-2 text-sm text-center font-medium text-gray-700 group-hover:text-navy">
                      {school.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section 
          ref={testimonialsRef}
          className={`py-20 transition-all duration-1000 delay-400 ${
            testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-medium text-center mb-16">What Students Say</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`bg-white p-8 rounded-xl shadow transition-all duration-500 ${
                    testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="mb-6 text-5xl text-navy/20">"</div>
                  <p className="text-lg text-gray-700 mb-6">{testimonial.quote}</p>
                  <p className="font-medium text-navy">{testimonial.author}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link to="/sign-up" className="btn-primary inline-flex items-center">
                Start Your Journey
                <MoveRight className="ml-2 h-4 w-4" />
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
