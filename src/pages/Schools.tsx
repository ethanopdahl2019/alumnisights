import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { getSchools } from '@/services/profiles';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SchoolCard = ({ school }: { school: School }) => (
  <Link 
    to={`/schools/${school.id}`}
    className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors"
  >
    <div className="w-12 h-12 flex items-center justify-center">
      {school.image ? (
        <img src={school.image} alt={school.name} className="w-full h-full object-contain" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-lg font-medium rounded">
          {school.name.charAt(0)}
        </div>
      )}
    </div>
    <div>
      <h3 className="font-medium">{school.name}</h3>
      <div className="text-sm text-gray-500 space-x-2">
        {school.location && <span>{school.location}</span>}
        {school.type && <span className="capitalize">{school.type.replace('_', ' ')}</span>}
      </div>
    </div>
  </Link>
);

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: getSchools
  });
  
  const filteredSchools = schools?.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Browse Schools</h1>
          
          <div className="relative mb-10 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for schools..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <p>Loading schools...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
              
              {filteredSchools.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No schools found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schools;
