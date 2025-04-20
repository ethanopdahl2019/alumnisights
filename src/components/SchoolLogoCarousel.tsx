
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSchools } from '@/services/profiles';
import { School } from '@/types/database';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

const SchoolLogoCarousel = () => {
  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools-carousel'],
    queryFn: getSchools
  });

  // Filter out schools without logos
  const schoolsWithLogos = schools?.filter(school => school.image) || [];

  if (isLoading || schoolsWithLogos.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="space-y-2">
          <div className="h-16 w-16 rounded-md bg-gray-200 animate-pulse mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {schoolsWithLogos.map((school) => (
            <CarouselItem key={school.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
              <div className="p-1">
                <Link to={`/schools/${school.id}`} className="flex items-center justify-center p-4 h-28 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={school.image || '/placeholder.svg'} 
                    alt={`${school.name} logo`}
                    className="max-h-20 max-w-full object-contain"
                  />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default SchoolLogoCarousel;
