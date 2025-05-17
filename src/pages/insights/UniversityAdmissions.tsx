
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UniversityHeader from "./universities/components/UniversityHeader";
import UniversityContent from "./universities/components/UniversityContent";
import UniversityNotFound from "./universities/components/UniversityNotFound";
import { universities } from "./universities/university-data";

const UniversityAdmissions = () => {
  const { id } = useParams<{ id: string }>();
  const university = id ? universities[id] : null;

  if (!university) {
    return <UniversityNotFound />;
  }

  // Check if there's chart data in the content
  const content = {
    ...university.content,
    chartData: university.chartData || [
      { year: 2022, acceptanceRate: 12 },
      { year: 2023, acceptanceRate: 11 },
      { year: 2024, acceptanceRate: 10 }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{university.title} | AlumniSights</title>
        <meta name="description" content={`Learn how to get admitted to ${university.name}`} />
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <UniversityHeader title={university.title} />
          <UniversityContent 
            content={content}
            image={university.image}
            name={university.name}
            didYouKnow={university.didYouKnow}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversityAdmissions;
