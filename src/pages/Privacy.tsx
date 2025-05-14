
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-700">
              Last updated: May 14, 2025
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              AlumniSights ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.alumnisights.com or use our platform.
            </p>
            <p className="text-gray-700 mb-4">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We may collect information about you in a variety of ways. The information we may collect includes:
            </p>
            <h3 className="text-xl font-medium mt-6 mb-2">Personal Data</h3>
            <p className="text-gray-700 mb-4">
              When you register with us, we collect personally identifiable information, such as your name, email address, educational background, and other information you directly provide us on our platform.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-2">Usage Data</h3>
            <p className="text-gray-700 mb-4">
              We may also collect information on how the platform is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our platform that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Provide, operate, and maintain our platform</li>
              <li>Improve, personalize, and expand our platform</li>
              <li>Understand and analyze how you use our platform</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners, for customer service, updates and other information relating to the platform</li>
              <li>Send you emails regarding our services</li>
              <li>Find and prevent fraud</li>
            </ul>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">4. Disclosure of Your Information</h2>
            <p className="text-gray-700 mb-4">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <h3 className="text-xl font-medium mt-6 mb-2">By Law or to Protect Rights</h3>
            <p className="text-gray-700 mb-4">
              If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-2">Third-Party Service Providers</h3>
            <p className="text-gray-700 mb-4">
              We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">5. Security of Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have certain rights regarding the personal information we collect about you:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>You have the right to access personal information we hold about you.</li>
              <li>You can ask us to correct inaccurate personal information.</li>
              <li>You can ask us to delete your personal information.</li>
              <li>You can withdraw consent to our processing of your personal information.</li>
            </ul>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">7. Children's Information</h2>
            <p className="text-gray-700 mb-4">
              The Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13 years of age.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
            
            <h2 className="text-2xl font-medium mt-8 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              AlumniSights<br />
              123 Education Lane<br />
              San Francisco, CA 94107<br />
              privacy@alumnisights.com
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
