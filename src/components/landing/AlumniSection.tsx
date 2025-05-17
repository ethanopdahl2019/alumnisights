
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const alumni = [
  { 
    id: "1",
    name: "Emma Thompson", 
    school: "Harvard University", 
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    major: "Computer Science"
  },
  { 
    id: "2",
    name: "Marcus Johnson", 
    school: "Stanford University", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    major: "Business Administration"
  },
  { 
    id: "3",
    name: "Sophia Chen", 
    school: "MIT", 
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    major: "Mechanical Engineering"
  },
  { 
    id: "4",
    name: "James Wilson", 
    school: "Yale University", 
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    major: "Political Science"
  }
];

const AlumniSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container-custom max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-garamond text-4xl md:text-5xl font-bold mb-6 text-navy">Meet Our Alumni</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Connect with graduates who've walked the path before you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {alumni.map((person) => (
            <Link 
              to={`/alumni/${person.id}`} 
              key={person.id}
              className="transition-transform hover:scale-105"
            >
              <div className="bg-[#F5F5DC] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-navy">{person.name}</h3>
                  <p className="text-gray-600">{person.major}</p>
                  <p className="text-navy/80 font-medium">{person.school}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/browse" className="text-navy font-medium hover:underline inline-flex items-center">
            Browse All Alumni <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AlumniSection;
