
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost, BlogCategory } from '@/types/database';

export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:author_id(name, image),
      categories:blog_post_categories(
        category:blog_categories(*)
      )
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(post => ({
    ...post,
    categories: post.categories?.map((c: any) => c.category) || [],
    author: post.author || { name: 'Anonymous', image: null }
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:author_id(name, image),
      categories:blog_post_categories(
        category:blog_categories(*)
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    ...data,
    categories: data.categories?.map((c: any) => c.category) || [],
    author: data.author || { name: 'Anonymous', image: null }
  };
}

export async function getCategories(): Promise<BlogCategory[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}
