
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const schools = [
  { name: "Harvard", logo: "/lovable-uploads/ac4ac494-9f39-4376-94ee-435e6eeaad53.png" },
  { name: "Stanford", logo: "/lovable-uploads/05100078-b238-4e77-b931-fc9455a696a9.png" },
  { name: "MIT", logo: "/lovable-uploads/bdaaf67c-3436-4d56-bf80-25d5b4978254.png" },
  { name: "Yale", logo: "/public/logos/default-university.png" },
  { name: "Princeton", logo: "/public/logos/default-university.png" },
  { name: "Columbia", logo: "/public/logos/default-university.png" },
];

const SchoolsSection = () => {
  return (
    <section className="py-20 px-4 bg-[#F5F5DC]">
      <div className="container-custom max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-garamond text-4xl md:text-5xl font-bold mb-6 text-navy">Featured Schools</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Connect with students from top universities across the country
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {schools.map((school) => (
            <Link 
              to={`/schools/undergraduate-admissions/${school.name.toLowerCase()}`} 
              key={school.name}
              className="transition-transform hover:scale-105"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center h-40">
                <img 
                  src={school.logo} 
                  alt={`${school.name} logo`} 
                  className="h-16 object-contain mb-3"
                />
                <p className="font-medium text-navy">{school.name}</p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/schools" className="text-navy font-medium hover:underline inline-flex items-center">
            View All Schools <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SchoolsSection;
