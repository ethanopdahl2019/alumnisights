
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, BookOpen, BriefcaseBusiness, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const GraduateAdmissions = () => {
  const gradSchoolTypes = [
    {
      title: "Master's Programs",
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      description: "Specialized degrees typically taking 1-2 years to complete, focusing on advanced knowledge in a specific field."
    },
    {
      title: "Doctoral Programs",
      icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
      description: "Research-intensive degrees leading to a Ph.D., typically taking 4-6 years and requiring original research contributions."
    },
    {
      title: "Professional Programs",
      icon: <BriefcaseBusiness className="h-8 w-8 text-green-500" />,
      description: "Career-focused degrees like MBA, JD, or MD, preparing students for specific professional paths."
    },
    {
      title: "Certificate Programs",
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      description: "Short-term credentials demonstrating specialized knowledge, often completed in less than a year."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Graduate Admissions Insights | AlumniSights</title>
        <meta name="description" content="Learn about graduate admission processes and strategies" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Graduate Admissions Insights
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Expert advice and insights on graduate school admissions processes at top universities
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Types of Graduate Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gradSchoolTypes.map((type, index) => (
                <Card key={index} className="border shadow hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 bg-gray-50 p-4 rounded-full">
                        {type.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                      <p className="text-gray-600 text-sm">{type.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Preparing for Graduate School</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                Graduate school applications require careful planning and preparation. Here are some key aspects to consider:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Research programs that align with your career goals and academic interests</li>
                <li>Prepare for standardized tests like the GRE, GMAT, LSAT, or MCAT</li>
                <li>Craft compelling personal statements and research proposals</li>
                <li>Secure strong letters of recommendation from academic and professional references</li>
                <li>Build relevant experience through research, internships, or work experience</li>
                <li>Plan your finances, including exploring scholarship and funding opportunities</li>
              </ul>
            </div>
          </section>

          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-3">Need personalized graduate admissions advice?</h2>
            <p className="mb-4">Connect with alumni who have successfully navigated the graduate school process</p>
            <a 
              href="/browse" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Find a Mentor
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GraduateAdmissions;
