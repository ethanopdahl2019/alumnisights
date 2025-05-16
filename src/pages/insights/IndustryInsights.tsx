
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, TrendingUp, Users, Building, Code, HeartPulse, Scale, Laptop, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const IndustryInsights = () => {
  const industries = [
    {
      name: "Technology",
      icon: <Code className="h-8 w-8 text-blue-500" />,
      description: "Software development, data science, cybersecurity, and more",
      trends: ["AI and machine learning", "Remote work technologies", "Cybersecurity advancements"],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Finance",
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      description: "Banking, investments, financial planning, and fintech",
      trends: ["Digital banking", "Sustainable investing", "Blockchain applications"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Healthcare",
      icon: <HeartPulse className="h-8 w-8 text-red-500" />,
      description: "Medicine, healthcare administration, biotechnology",
      trends: ["Telemedicine", "Personalized medicine", "Digital health records"],
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Legal",
      icon: <Scale className="h-8 w-8 text-indigo-500" />,
      description: "Law practice, legal tech, compliance, and policy",
      trends: ["Legal tech automation", "Remote court proceedings", "International law focus"],
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Consulting",
      icon: <Briefcase className="h-8 w-8 text-amber-500" />,
      description: "Management consulting, strategy, operations",
      trends: ["Digital transformation consulting", "ESG consulting", "Remote advisory services"],
      image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Marketing",
      icon: <Users className="h-8 w-8 text-purple-500" />,
      description: "Digital marketing, brand management, market research",
      trends: ["Content marketing", "Social media strategies", "Data-driven marketing"],
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Real Estate",
      icon: <Building className="h-8 w-8 text-orange-500" />,
      description: "Property management, development, investments",
      trends: ["Proptech innovations", "Sustainable building", "Remote buying experiences"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Education",
      icon: <Laptop className="h-8 w-8 text-teal-500" />,
      description: "Teaching, EdTech, administration, curriculum development",
      trends: ["Online learning platforms", "Personalized education", "Global classroom connections"],
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/70 to-white">
      <Helmet>
        <title>Industry Insights | AlumniSights</title>
        <meta name="description" content="Discover industry trends and career paths" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-serif font-bold text-navy mb-4">
              Industry Insights
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Explore career paths and industry trends across various professional fields
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-serif font-semibold mb-8 text-center">Major Industries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry, index) => (
                <Card key={index} className="border shadow hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gray-50 p-2 rounded-full">
                          {industry.icon}
                        </div>
                        <h3 className="font-serif font-semibold text-lg">{industry.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{industry.description}</p>
                      <div className="mt-2">
                        <h4 className="font-medium text-sm mb-2">Current Trends:</h4>
                        <ul className="text-xs">
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

          <section className="mb-16">
            <div className="md:flex gap-8 items-center bg-white p-8 rounded-lg shadow-sm">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h2 className="text-2xl font-serif font-semibold mb-4">Connecting With Industry Professionals</h2>
                <p className="text-gray-700 mb-4">
                  Learning about industries from textbooks is one thing, but nothing beats insights from professionals who work in these fields every day.
                </p>
                <p className="text-gray-700 mb-4">
                  Our platform connects you with alumni who have established careers across various industries, giving you insider perspectives on:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                    <span>Day-to-day responsibilities and work environments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                    <span>Entry-level positions and career progression paths</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                    <span>Skills and qualifications that employers value most</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                    <span>Emerging trends and how to position yourself for success</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Professional networking" 
                  className="rounded-lg shadow-sm w-full h-auto"
                />
              </div>
            </div>
          </section>

          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-serif font-bold mb-3">Get career guidance from industry professionals</h2>
            <p className="mb-6 text-gray-700">Connect with alumni working in your field of interest</p>
            <Link 
              to="/browse" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-medium"
            >
              Find a Mentor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IndustryInsights;
