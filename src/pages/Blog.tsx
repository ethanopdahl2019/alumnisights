
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getAllPosts } from '@/services/blog';

const Blog = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-20">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">Insights</h1>
          
          {isLoading && <p>Loading...</p>}
          {error && <p>Error loading posts</p>}
          
          {posts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <article key={post.id} className="border rounded-lg overflow-hidden shadow-sm">
                  {post.featured_image && (
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
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
                </article>
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
