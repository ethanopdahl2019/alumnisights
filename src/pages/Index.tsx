import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllPosts } from '@/services/blog';
import ProfileCard from '@/components/ProfileCard';
import { supabase } from '@/integrations/supabase/client';
import type { ProfileWithDetails } from '@/types/database';
import Header from "@/components/Header";

const Index = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  });

  const [profiles, setProfiles] = React.useState<ProfileWithDetails[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            school:schools(*),
            major:majors(*),
            activities:profile_activities(activities(*))
          `)
          .limit(6);

        if (error) {
          throw error;
        }

        const profilesWithDetails = data.map((profile: any) => ({
          ...profile,
          activities: profile.activities.map((pa: any) => pa.activities)
        }));

        setProfiles(profilesWithDetails);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div>
      <Header />
      <div className="container-custom py-20">
        <h1 className="text-5xl font-bold mb-8">
          Connect with Alumni and Students
        </h1>
        <p className="text-lg text-gray-700 mb-12">
          Explore profiles, discover insights, and build your network.
        </p>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Featured Alumni</h2>
          {loading ? (
            <p>Loading profiles...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/browse" className="text-blue-600 hover:underline">
              View All Alumni & Students
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Latest Insights</h2>
          {isLoading ? (
            <p>Loading posts...</p>
          ) : error ? (
            <p>Error loading posts</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.slice(0, 3).map((post) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post.id}
                  className="group block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                    />
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      {post.author?.name && (
                        <>
                          <span>By {post.author.name}</span>
                          <span className="mx-2">•</span>
                        </>
                      )}
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/blog" className="text-blue-600 hover:underline">
              Read More Insights
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
