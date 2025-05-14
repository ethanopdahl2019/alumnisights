
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqItems = [
    {
      question: "What is AlumniSights?",
      answer: "AlumniSights is a platform that connects prospective students with current students and alumni to provide authentic insights into universities, programs, and campus life. We help applicants make informed decisions about their education by facilitating conversations with people who have firsthand experience."
    },
    {
      question: "How does AlumniSights work?",
      answer: "Our platform allows you to browse profiles of current students and alumni, and book conversations with them based on your interests and questions. You can choose from different conversation formats, from quick 15-minute chats to in-depth hour-long discussions."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
          
          <p className="text-lg text-gray-700 mb-10">
            Find answers to common questions about AlumniSights, our services, and how we can help you
            make informed decisions about your education.
          </p>
          
          <Accordion type="single" collapsible className="mb-10">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-medium mb-4">Still have questions?</h2>
            <p className="text-gray-700 mb-4">
              We're here to help! If you couldn't find the answer you were looking for, please reach out to our support team.
            </p>
            <a href="mailto:support@alumnisights.com" className="text-blue-600 hover:underline">
              Contact Support →
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
