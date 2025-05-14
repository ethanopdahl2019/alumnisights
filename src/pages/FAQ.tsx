
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
    },
    {
      question: "Is there a cost to use AlumniSights?",
      answer: "Browsing profiles and basic information is free. Booking conversations with alumni may involve a fee, which varies depending on the length and type of conversation. Some mentors also offer free initial consultations."
    },
    {
      question: "How do I become a mentor?",
      answer: "If you're a current student or alumnus interested in becoming a mentor, you can sign up through our 'Become a Mentor' page. After creating a profile and completing your verification, you'll be able to set your availability and start connecting with prospective students."
    },
    {
      question: "How are mentors verified?",
      answer: "We verify mentors through a combination of university email verification, LinkedIn profile confirmation, and review of academic credentials. This ensures that all mentors on our platform have genuine experience at the institutions they represent."
    },
    {
      question: "What types of conversations can I book?",
      answer: "You can book different types of conversations based on your needs: quick 15-minute introductory calls, 30-minute Q&A sessions, or comprehensive 60-minute consultations. Each mentor specifies which options they offer."
    },
    {
      question: "Can I get a refund if I'm not satisfied with my conversation?",
      answer: "Yes, we offer a satisfaction guarantee. If your conversation doesn't meet your expectations, please contact our support team within 24 hours of your meeting, and we'll work with you to resolve the issue or provide a refund."
    },
    {
      question: "How do I prepare for my conversation with a mentor?",
      answer: "We recommend preparing specific questions in advance to make the most of your time. Consider your goals for the conversation and what insights would be most valuable to you. Many mentors also appreciate receiving questions beforehand so they can prepare thoughtful responses."
    },
    {
      question: "Can I contact a mentor outside of scheduled conversations?",
      answer: "Our platform is designed to facilitate scheduled conversations. If you wish to maintain contact with a mentor beyond your scheduled meeting, that would be at the mentor's discretion and would happen outside our platform."
    },
    {
      question: "What if I need to reschedule or cancel my conversation?",
      answer: "You can reschedule or cancel conversations through your dashboard. Please note that our policy requires at least 24 hours notice for changes to avoid cancellation fees."
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
