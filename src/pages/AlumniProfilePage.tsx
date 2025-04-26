
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getProfileById } from "@/services/profiles";
import { School, Briefcase, Award, MapPin, Calendar, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import Tag from "@/components/Tag";

const AlumniProfilePage = () => {
  const { id } = useParams();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileById(id!),
    enabled: !!id
  });

  if (isLoading) {
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
  const socialLinks = typeof profile.social_links === 'string' && profile.social_links
    ? JSON.parse(profile.social_links)
    : profile.social_links || {};

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
            {/* Profile Info */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-6">
                  <img
                    src={profile.image || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                  />
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                    {profile.headline && (
                      <p className="text-lg text-gray-600 mb-4">{profile.headline}</p>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
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
                    {profile.location && (
                      <div className="flex items-center gap-2 text-gray-600 mt-2">
                        <MapPin className="h-5 w-5" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

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
            </div>

            {/* Booking Section */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {profile.price_15_min && (
                  <ProductCard
                    title="Quick Chat"
                    price={profile.price_15_min}
                    duration="15 minutes"
                    description="Perfect for specific questions about the application process"
                    onBook={() => {/* Add booking logic */}}
                  />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {profile.price_30_min && (
                  <ProductCard
                    title="Deep Dive"
                    price={profile.price_30_min}
                    duration="30 minutes"
                    description="Ideal for in-depth discussion about academics and campus life"
                    onBook={() => {/* Add booking logic */}}
                  />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {profile.price_60_min && (
                  <ProductCard
                    title="Comprehensive Session"
                    price={profile.price_60_min}
                    duration="60 minutes"
                    description="Full consultation covering all aspects of your application"
                    onBook={() => {/* Add booking logic */}}
                  />
                )}
              </motion.div>

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
