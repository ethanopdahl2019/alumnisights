
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getAllPosts } from '@/services/blog';

const EXAMPLE_POSTS = [
  {
    id: "1",
    slug: "how-to-choose-your-college",
    title: "How to Choose the Right College",
    excerpt: "Tips for making your college selection process easier.",
    content: "<p>Choosing a college can be daunting. Here's how to narrow your options...</p>",
    featured_image: "/placeholder.svg",
    created_at: new Date().toISOString(),
    author: { name: "Jane Doe", image: null },
    categories: [],
  }
];

const Blog = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts
  });

  // Populate with static example posts if no data returned
  const displayPosts = posts && posts.length > 0 ? posts : EXAMPLE_POSTS;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-20">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">Insights</h1>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error loading posts</p>}
          {displayPosts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPosts.map(post => (
                <Link 
                  to={`/blog/${post.slug}`}
                  key={post.id} 
                  className="group block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
