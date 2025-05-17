
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getProfileById } from "@/services/profiles";
import { getProfileReviews } from "@/services/reviews";
import { School, Briefcase, Award, MapPin, Calendar, ExternalLink, Star, MessageSquare, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ReviewCard from "@/components/ReviewCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Tag from "@/components/Tag";
import { MentorChatButton } from "@/components/mentor-chat/MentorChatButton";

const AlumniProfilePage = () => {
  const { id } = useParams();
  
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileById(id!),
    enabled: !!id
  });

  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ['profile-reviews', id],
    queryFn: async () => {
      // This will be implemented in services/reviews.ts
      // For now, we'll return mock data
      return [
        {
          id: '1',
          profile_id: id!,
          author_id: 'author1',
          author_name: 'Jamie Smith',
          author_image: '/placeholder.svg',
          rating: 5,
          comment: 'Speaking with this mentor was incredibly insightful. They provided me with great advice about the application process and helped me understand what makes their school unique.',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          profile_id: id!,
          author_id: 'author2',
          author_name: 'Alex Johnson',
          author_image: '/placeholder.svg',
          rating: 5,
          comment: 'Very knowledgeable and approachable! They took the time to answer all my questions and provided valuable insights about campus life that I couldn\'t find anywhere else.',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          profile_id: id!,
          author_id: 'author3',
          author_name: 'Taylor Rodriguez',
          author_image: '/placeholder.svg',
          rating: 4,
          comment: 'Great conversation! They shared their personal experience with the school and helped me understand if it would be a good fit for me.',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    },
    enabled: !!id
  });

  if (loadingProfile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container-custom py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container-custom py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <Link to="/browse" className="text-blue-600 hover:underline">
            Browse other profiles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse social_links if it's a string
  const socialLinks = typeof profile?.social_links === 'string' && profile.social_links
    ? JSON.parse(profile.social_links)
    : profile?.social_links || {};

  // Calculate average rating
  const averageRating = reviews?.length ? 
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 
    0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container-custom py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Info and Booking Section */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Header Card */}
              <Card className="p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-50 to-purple-50"></div>
                <div className="relative z-10 flex items-start gap-6 pt-16">
                  <div className="relative">
                    <img
                      src={profile.image || "/placeholder.svg"}
                      alt={profile.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                    />
                    {reviews?.length > 0 && (
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow border">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-sm">{averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                        {profile.headline && (
                          <p className="text-lg text-gray-600 mb-4">{profile.headline}</p>
                        )}
                        
                        <div className="flex flex-col gap-2 text-gray-600">
                          <div className="flex items-center gap-2">
                            <School className="h-5 w-5" />
                            <span>{profile.school.name}</span>
                            {profile.graduation_year && (
                              <>
                                <span>•</span>
                                <Calendar className="h-4 w-4" />
                                <span>Class of {profile.graduation_year}</span>
                              </>
                            )}
                          </div>
                          {profile.major && (
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-5 w-5" />
                              <span>{profile.major.name}</span>
                            </div>
                          )}
                          {profile.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-5 w-5" />
                              <span>{profile.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Add the mentor chat button here */}
                      <MentorChatButton 
                        mentorId={profile.user_id} 
                        mentorName={profile.name}
                        className="ml-auto"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b rounded-none p-0 h-auto">
                  <TabsTrigger 
                    value="about" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3"
                  >
                    Reviews {reviews?.length ? `(${reviews.length})` : ''}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="mt-6 space-y-6">
                  {/* Bio Section */}
                  {profile.bio && (
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">About</h2>
                      <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                    </Card>
                  )}

                  {/* Achievements Section */}
                  {profile.achievements && profile.achievements.length > 0 && (
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                      <ul className="space-y-3">
                        {profile.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Award className="h-5 w-5 text-blue-600 mt-1" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Activities and Interests */}
                  {profile.activities && profile.activities.length > 0 && (
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Activities & Interests</h2>
                      <div className="flex flex-wrap gap-2">
                        {profile.activities.map((activity) => (
                          <Tag key={activity.id} type={activity.type}>
                            {activity.name}
                          </Tag>
                        ))}
                      </div>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6 space-y-4">
                  {loadingReviews ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card className="p-6" key={i}>
                          <div className="animate-pulse">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                              <div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-full"></div>
                              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm px-4 py-3 flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" /> 
                          <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                          <span className="text-gray-500">• {reviews.length} reviews</span>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Write a Review
                        </Button>
                      </div>
                      
                      {reviews.map((review, index) => (
                        <ReviewCard 
                          key={review.id} 
                          review={review} 
                          delay={0.1 * index}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Users className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="text-xl font-medium mt-4">No Reviews Yet</h3>
                      <p className="text-gray-500 mt-2">
                        Be the first to share your experience with this mentor.
                      </p>
                      <Button className="mt-6">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Write a Review
                      </Button>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Section */}
            <div className="space-y-6">
              <Card className="p-6 bg-white border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Book a Session</h2>
                <p className="text-gray-600 mb-6">
                  Get personalized insights about {profile?.school?.name} from someone who's been there.
                </p>
                
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {profile?.price_15_min && (
                      <ProductCard
                        title="Quick Chat"
                        price={profile.price_15_min}
                        duration="15 minutes"
                        description="Perfect for specific questions about the application process"
                        onBook={() => {/* Fallback for old functionality */}}
                        profileId={id}
                        productId="quick-chat"
                      />
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {profile?.price_30_min && (
                      <ProductCard
                        title="Deep Dive"
                        price={profile.price_30_min}
                        duration="30 minutes"
                        description="Ideal for in-depth discussion about academics and campus life"
                        onBook={() => {/* Fallback for old functionality */}}
                        profileId={id}
                        productId="deep-dive"
                      />
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {profile?.price_60_min && (
                      <ProductCard
                        title="Comprehensive Session"
                        price={profile.price_60_min}
                        duration="60 minutes"
                        description="Full consultation covering all aspects of your application"
                        onBook={() => {/* Fallback for old functionality */}}
                        profileId={id}
                        productId="comprehensive"
                      />
                    )}
                  </motion.div>
                </div>
              </Card>

              {/* Social Links */}
              {socialLinks && Object.keys(socialLinks).length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Connect</h3>
                  <div className="space-y-3">
                    {Object.entries(socialLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="capitalize">{platform}</span>
                      </a>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniProfilePage;
