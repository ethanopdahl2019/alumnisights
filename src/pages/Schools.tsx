
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { getSchools } from '@/services/profiles';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
                <Link 
                  key={school.id} 
                  to={`/schools/${school.id}`}
                  className="transform transition-transform hover:scale-105"
                >
                  <Card className="h-full overflow-hidden border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      {school.image ? (
                        <img 
                          src={school.image} 
                          alt={school.name} 
                          className="max-h-full max-w-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-slate-500">
                            {school.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{school.name}</h3>
                      <p className="text-sm text-gray-600">{school.location || "Location unavailable"}</p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {school.type?.replace(/_/g, ' ') || "Type unavailable"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
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
