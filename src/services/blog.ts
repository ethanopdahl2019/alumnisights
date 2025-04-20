
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost, BlogCategory } from '@/types/database';

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles(name, image)
    `)
    .eq('published', true)
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }

  return data;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles(name, image),
      categories:blog_post_categories(blog_categories(*))
    `)
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data.map(post => ({
    ...post,
    categories: post.categories?.map((c: any) => c.blog_categories) || []
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles(name, image),
      categories:blog_post_categories(blog_categories(*))
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return {
    ...data,
    categories: data.categories?.map((c: any) => c.blog_categories) || []
  };
}

export async function getCategories(): Promise<BlogCategory[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }

  return data;
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select(`
      blog_post_categories!inner(
        blog_posts(
          *,
          author:profiles(name, image)
        )
      )
    `)
    .eq('slug', categorySlug)
    .eq('blog_posts.published', true)
    .order('blog_posts.published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }

  return data.flatMap((category: any) => 
    category.blog_post_categories.map((post: any) => post.blog_posts)
  );
}
