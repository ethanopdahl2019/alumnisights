
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLandingPageBySlug } from '@/services/landing-pages';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const LandingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { data: page, isLoading } = useQuery({
    queryKey: ['landing-page', slug],
    queryFn: () => getLandingPageBySlug(slug || ''),
    enabled: !!slug
  });

  if (isLoading) {
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

  if (!page) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="py-20">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-4">Page not found</h1>
              <Button onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
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
          <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
          
          {page.content_blocks?.map((block) => (
            <div key={block.id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">{block.title}</h2>
              <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: block.content }} />
            </div>
          ))}
          
          <div className="mt-12">
            <Button onClick={() => navigate('/sign-up')} size="lg">
              Start Your Journey
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
