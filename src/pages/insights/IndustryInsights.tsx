
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, TrendingUp, Users, Building, Code, HeartPulse, Scale, Laptop } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const IndustryInsights = () => {
  const industries = [
    {
      name: "Technology",
      icon: <Code className="h-8 w-8 text-blue-500" />,
      description: "Software development, data science, cybersecurity, and more",
      trends: ["AI and machine learning", "Remote work technologies", "Cybersecurity advancements"]
    },
    {
      name: "Finance",
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      description: "Banking, investments, financial planning, and fintech",
      trends: ["Digital banking", "Sustainable investing", "Blockchain applications"]
    },
    {
      name: "Healthcare",
      icon: <HeartPulse className="h-8 w-8 text-red-500" />,
      description: "Medicine, healthcare administration, biotechnology",
      trends: ["Telemedicine", "Personalized medicine", "Digital health records"]
    },
    {
      name: "Legal",
      icon: <Scale className="h-8 w-8 text-indigo-500" />,
      description: "Law practice, legal tech, compliance, and policy",
      trends: ["Legal tech automation", "Remote court proceedings", "International law focus"]
    },
    {
      name: "Consulting",
      icon: <Briefcase className="h-8 w-8 text-amber-500" />,
      description: "Management consulting, strategy, operations",
      trends: ["Digital transformation consulting", "ESG consulting", "Remote advisory services"]
    },
    {
      name: "Marketing",
      icon: <Users className="h-8 w-8 text-purple-500" />,
      description: "Digital marketing, brand management, market research",
      trends: ["Content marketing", "Social media strategies", "Data-driven marketing"]
    },
    {
      name: "Real Estate",
      icon: <Building className="h-8 w-8 text-orange-500" />,
      description: "Property management, development, investments",
      trends: ["Proptech innovations", "Sustainable building", "Remote buying experiences"]
    },
    {
      name: "Education",
      icon: <Laptop className="h-8 w-8 text-teal-500" />,
      description: "Teaching, EdTech, administration, curriculum development",
      trends: ["Online learning platforms", "Personalized education", "Global classroom connections"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Industry Insights | AlumniSights</title>
        <meta name="description" content="Discover industry trends and career paths" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Industry Insights
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Explore career paths and industry trends across various professional fields
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Major Industries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry, index) => (
                <Card key={index} className="border shadow hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 bg-gray-50 p-4 rounded-full">
                        {industry.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{industry.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{industry.description}</p>
                      <div className="mt-2">
                        <h4 className="font-medium text-sm mb-2">Current Trends:</h4>
                        <ul className="text-xs text-left">
                          {industry.trends.map((trend, i) => (
                            <li key={i} className="mb-1 flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1.5"></span>
                              {trend}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-3">Get career guidance from industry professionals</h2>
            <p className="mb-4">Connect with alumni working in your field of interest</p>
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

export default IndustryInsights;
