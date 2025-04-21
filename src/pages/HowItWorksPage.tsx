import React from 'react';
import Header from "@/components/Header";
import Footer from '@/components/Footer';

const HowItWorksPage = () => {
  return (
    <div>
      <Header />
      <div className="container-custom py-20">
        <h1 className="text-4xl font-bold mb-8">How It Works</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">For Alumni</h2>
          <ol className="list-decimal pl-5">
            <li className="mb-2">
              <strong>Sign Up:</strong> Create an account and complete your profile with your educational and professional background.
            </li>
            <li className="mb-2">
              <strong>Connect:</strong> Find and connect with fellow alumni from your school or program.
            </li>
            <li className="mb-2">
              <strong>Share:</strong> Share your experiences, insights, and advice with current students and recent graduates.
            </li>
            <li>
              <strong>Network:</strong> Expand your professional network and discover new opportunities.
            </li>
          </ol>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">For Students</h2>
          <ol className="list-decimal pl-5">
            <li className="mb-2">
              <strong>Sign Up:</strong> Join the platform and create your student profile.
            </li>
            <li className="mb-2">
              <strong>Explore:</strong> Browse alumni profiles and discover potential career paths.
            </li>
            <li className="mb-2">
              <strong>Learn:</strong> Gain insights and advice from alumni who have been in your shoes.
            </li>
            <li>
              <strong>Connect:</strong> Reach out to alumni for mentorship, informational interviews, and networking opportunities.
            </li>
          </ol>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
          <ul className="list-disc pl-5">
            <li className="mb-2">
              <strong>Alumni:</strong> Give back to your alma mater, mentor students, and expand your professional network.
            </li>
            <li>
              <strong>Students:</strong> Gain valuable insights, explore career options, and connect with experienced professionals.
            </li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
