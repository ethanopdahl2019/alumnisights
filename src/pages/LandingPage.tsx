import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLandingPage } from '@/services/landing-pages';
import Footer from '@/components/Footer';
import Header from "@/components/Header";

const LandingPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: landingPage, isLoading, error } = useQuery({
    queryKey: ['landing-page', slug],
    queryFn: () => getLandingPage(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!landingPage) {
    return <p>Landing page not found.</p>;
  }

  return (
    <div>
      <Header />
      <div className="bg-white py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold text-center mb-8">{landingPage.title}</h1>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: landingPage.content }} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
