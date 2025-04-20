
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost, BlogCategory } from '@/types/database';

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  // For now, return mock data since the table doesn't exist yet
  return [
    {
      id: '1',
      title: 'How to Pick the Right College Major',
      slug: 'how-to-pick-right-college-major',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      excerpt: 'Tips for choosing the right major for your future career.',
      author_id: '1',
      published: true,
      featured: true,
      featured_image: '/placeholder.svg',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        name: 'Jane Smith',
        image: '/placeholder.svg'
      }
    },
    {
      id: '2',
      title: 'Campus Life at Ivy League Schools',
      slug: 'campus-life-ivy-league',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      excerpt: 'What to expect when attending an Ivy League institution.',
      author_id: '2',
      published: true,
      featured: true,
      featured_image: '/placeholder.svg',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        name: 'John Doe',
        image: '/placeholder.svg'
      }
    },
    {
      id: '3',
      title: 'Balancing Academics and Extracurriculars',
      slug: 'balancing-academics-extracurriculars',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      excerpt: 'Strategies for managing your time effectively in college.',
      author_id: '3',
      published: true,
      featured: true,
      featured_image: '/placeholder.svg',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        name: 'Alex Johnson',
        image: '/placeholder.svg'
      }
    }
  ];
}

export async function getAllPosts(): Promise<BlogPost[]> {
  // Mock data until database tables are created
  return [
    ...await getFeaturedPosts(),
    {
      id: '4',
      title: 'Internship Opportunities for College Students',
      slug: 'internship-opportunities',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      excerpt: 'How to find and secure valuable internships during college.',
      author_id: '1',
      published: true,
      featured: false,
      featured_image: '/placeholder.svg',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        name: 'Jane Smith',
        image: '/placeholder.svg'
      },
      categories: [
        {
          id: '1',
          name: 'Career',
          slug: 'career',
          description: 'Career advice and opportunities',
          created_at: new Date().toISOString()
        }
      ]
    }
  ];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function getCategories(): Promise<BlogCategory[]> {
  // Mock data until database tables are created
  return [
    {
      id: '1',
      name: 'Career',
      slug: 'career',
      description: 'Career advice and opportunities',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Academics',
      slug: 'academics',
      description: 'Academic tips and strategies',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Campus Life',
      slug: 'campus-life',
      description: 'Stories about life on campus',
      created_at: new Date().toISOString()
    }
  ];
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  const filteredPosts = allPosts.filter(post => 
    post.categories?.some(category => category.slug === categorySlug)
  );
  
  return filteredPosts;
}
