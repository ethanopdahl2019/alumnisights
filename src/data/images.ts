
export interface ImageData {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: 'campus' | 'students' | 'alumni' | 'events' | 'academic' | 'profile';
}

export const siteImages: ImageData[] = [
  {
    id: 'campus-1',
    src: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3',
    alt: 'University campus with historic buildings',
    caption: 'Historic university architecture',
    category: 'campus'
  },
  {
    id: 'campus-2',
    src: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b',
    alt: 'Modern university library',
    caption: 'State-of-the-art research facilities',
    category: 'campus'
  },
  {
    id: 'campus-3',
    src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a',
    alt: 'Campus quadrangle with students',
    caption: 'The heart of campus life',
    category: 'campus'
  },
  {
    id: 'student-1',
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
    alt: 'Students studying together',
    caption: 'Collaborative learning environments',
    category: 'students'
  },
  {
    id: 'student-2',
    src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70',
    alt: 'Student with laptop in courtyard',
    caption: 'Finding your study spot',
    category: 'students'
  },
  {
    id: 'student-3',
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
    alt: 'Group of diverse students',
    caption: 'Building lifelong connections',
    category: 'students'
  },
  {
    id: 'alumni-1',
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf',
    alt: 'Alumni at networking event',
    caption: 'Alumni networks that open doors',
    category: 'alumni'
  },
  {
    id: 'alumni-2',
    src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
    alt: 'Alumni giving presentation',
    caption: 'Leading in their fields',
    category: 'alumni'
  },
  {
    id: 'events-1',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    alt: 'Campus event with speakers',
    caption: 'Distinguished speaker series',
    category: 'events'
  },
  {
    id: 'events-2',
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    alt: 'Student club fair',
    caption: 'Discover your passions',
    category: 'events'
  },
  {
    id: 'academic-1',
    src: 'https://images.unsplash.com/photo-1577036421869-8b7f082cd62e',
    alt: 'Professor in lecture',
    caption: 'Learning from the best minds',
    category: 'academic'
  },
  {
    id: 'academic-2',
    src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    alt: 'Student in laboratory',
    caption: 'Hands-on research experience',
    category: 'academic'
  },
  {
    id: 'profile-1',
    src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    alt: 'Professional headshot of female alumni',
    category: 'profile'
  },
  {
    id: 'profile-2',
    src: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857',
    alt: 'Professional headshot of male alumni',
    category: 'profile'
  },
  {
    id: 'profile-3',
    src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    alt: 'Professional headshot of female student',
    category: 'profile'
  },
  {
    id: 'profile-4',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    alt: 'Professional headshot of male student',
    category: 'profile'
  }
];

// Helper function to get images by category
export const getImagesByCategory = (category: ImageData['category'], limit?: number): ImageData[] => {
  const filtered = siteImages.filter(image => image.category === category);
  return limit ? filtered.slice(0, limit) : filtered;
};

// Helper function to get random images
export const getRandomImages = (count: number = 3): ImageData[] => {
  const shuffled = [...siteImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
