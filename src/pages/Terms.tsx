
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-700">
              Last updated: May 14, 2025
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to AlumniSights ("Company", "we", "our", "us")! These Terms of Service ("Terms") govern your use of our website located at www.alumnisights.com (the "Service") operated by AlumniSights.
            </p>
            <p className="text-gray-700 mb-4">
              Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound by them.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">2. Communications</h2>
            <p className="text-gray-700 mb-4">
              By creating an Account on our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">3. Purchases</h2>
            <p className="text-gray-700 mb-4">
              If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
            </p>
            <p className="text-gray-700 mb-4">
              You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">4. Mentorship Services</h2>
            <p className="text-gray-700 mb-4">
              Our Service provides a platform connecting prospective students with current students and alumni. We do not guarantee any specific outcomes or results from these interactions. All advice provided by mentors is their own personal opinion and experience and should not be considered professional advice.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">5. Content</h2>
            <p className="text-gray-700 mb-4">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">6. Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may use the Service only for lawful purposes and in accordance with Terms. You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
              <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
            </ul>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">7. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">8. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms, please contact us at legal@alumnisights.com.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
