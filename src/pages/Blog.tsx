import { useEffect, useState } from "react";
import { getAllPosts } from "@/services/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts()
      .then((res) => setPosts(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded w-full max-w-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Insights & Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="block p-5 rounded-lg border hover:shadow group">
              {post.featured_image && (
                <img src={post.featured_image} className="w-full rounded mb-4" alt={post.title} />
              )}
              <h2 className="text-xl font-semibold mb-2 group-hover:text-navy">{post.title}</h2>
              <p className="text-gray-600 mb-2">{post.excerpt}</p>
              <div className="flex items-center gap-2">
                {post.author?.image && (
                  <img src={post.author.image} alt={post.author.name} className="h-7 w-7 rounded-full" />
                )}
                <span className="text-gray-700 text-sm">{post.author?.name || "Anonymous"}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Blog;
