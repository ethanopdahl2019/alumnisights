
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPostBySlug, getCategories } from '@/services/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => getPostBySlug(slug || ''),
    enabled: !!slug
  });

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: getCategories
  });

  if (isPostLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="py-20">
          <div className="container-custom">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="py-20">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
              <Button onClick={() => navigate('/blog')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-20">
        <div className="container-custom max-w-4xl">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />
          )}

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            {post.author?.name && (
              <>
                <span>By {post.author.name}</span>
                <span>•</span>
              </>
            )}
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>

          {post.categories && (
            <div className="flex gap-2 mb-8">
              {post.categories.map(category => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}

          <div 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
