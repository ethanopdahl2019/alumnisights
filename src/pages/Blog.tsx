
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: "How to Choose the Right University for You: Beyond the Rankings",
    excerpt: "Rankings aren't everything. Learn what factors you should really consider when selecting your ideal university.",
    author: "Sarah Johnson",
    date: "May 10, 2023",
    category: "University Selection",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "how-to-choose-right-university"
  },
  {
    id: 2,
    title: "Crafting a Standout College Application Essay: Tips from Admissions Officers",
    excerpt: "Get insider advice from former admissions officers on how to write an essay that truly showcases your unique voice.",
    author: "Michael Chen",
    date: "April 22, 2023",
    category: "Application Tips",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "crafting-standout-college-application-essay"
  },
  {
    id: 3,
    title: "The Hidden Costs of College: Budgeting Beyond Tuition",
    excerpt: "Tuition is just the beginning. Learn about all the costs you need to plan for to avoid financial surprises.",
    author: "Alexis Rivera",
    date: "March 15, 2023",
    category: "Financial Planning",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "hidden-costs-of-college"
  },
  {
    id: 4,
    title: "Gap Year: Pros, Cons, and How to Make the Most of It",
    excerpt: "Considering a gap year? Explore the benefits, potential drawbacks, and strategies for making it a valuable experience.",
    author: "Jordan Taylor",
    date: "February 28, 2023",
    category: "Planning",
    image: "https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "gap-year-pros-cons"
  },
  {
    id: 5,
    title: "Building Relationships with Professors: Why It Matters and How to Do It",
    excerpt: "Strong faculty relationships can enhance your education and open doors. Learn how to connect with professors effectively.",
    author: "Priya Patel",
    date: "January 18, 2023",
    category: "College Life",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "building-relationships-with-professors"
  },
  {
    id: 6,
    title: "Navigating the First Semester: Survival Guide for Freshmen",
    excerpt: "The transition to college life can be challenging. Here are essential tips to help you thrive during your first semester.",
    author: "Marcus Johnson",
    date: "December 5, 2022",
    category: "College Life",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "navigating-first-semester"
  }
];

const categories = ["All", "University Selection", "Application Tips", "Financial Planning", "College Life", "Planning"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = React.useState("All");
  
  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">AlumniSights Blog</h1>
          
          <p className="text-lg text-gray-700 mb-8">
            Insights, advice, and stories to help you navigate your educational journey.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-2">{post.category}</div>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2 hover:text-blue-600">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Newsletter Signup */}
          <div className="bg-gray-50 p-8 rounded-lg mt-16 border border-gray-200">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-4">Stay Updated</h2>
              <p className="text-gray-700 text-center mb-6">
                Subscribe to our newsletter for the latest articles, advice, and insights.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
