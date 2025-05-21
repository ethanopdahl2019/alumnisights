
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <p className="text-muted-foreground">
          This is a placeholder for the blog page. Actual implementation will be done later.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
