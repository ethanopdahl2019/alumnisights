import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from "@/components/Header";

const Schools = () => {
  const { data: schools, isLoading, error } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name, location, type, image, created_at');

      if (error) {
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading schools...</div>;
  }

  if (error) {
    return <div>Error loading schools.</div>;
  }

  return (
    <div>
      <Header />
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Schools</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {schools?.map((school) => (
            <Link
              key={school.id}
              to={`/schools/${school.id}`}
              className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={school.image || '/placeholder.svg'}
                  alt={school.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-semibold">{school.name}</h3>
                  <p className="text-sm">{school.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schools;
