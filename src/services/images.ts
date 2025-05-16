
import { supabase } from '@/integrations/supabase/client';
import { ImageData } from '@/data/images';

// Fetch images from database
export async function getImagesFromDatabase(): Promise<ImageData[]> {
  try {
    // Use raw SQL query instead of from() for tables not in TypeScript types yet
    const { data, error } = await supabase
      .rpc('get_all_site_images');
    
    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }
    
    return data?.map((img: any) => ({
      id: img.id,
      src: img.url,
      alt: img.alt_text || '',
      caption: img.caption,
      category: img.category
    })) || [];
  } catch (error) {
    console.error('Failed to fetch images from database:', error);
    return [];
  }
}

// Get images by category
export async function getDatabaseImagesByCategory(category: string, limit?: number): Promise<ImageData[]> {
  try {
    // Use raw SQL query instead of from() for tables not in TypeScript types yet
    let query = `
      category.eq.${category}
      ${limit ? `.limit(${limit})` : ''}
    `;
    
    const { data, error } = await supabase
      .rpc('get_site_images_by_category', { 
        category_param: category,
        limit_param: limit || null
      });
    
    if (error) {
      console.error(`Error fetching ${category} images:`, error);
      return [];
    }
    
    return data?.map((img: any) => ({
      id: img.id,
      src: img.url,
      alt: img.alt_text || '',
      caption: img.caption,
      category: img.category
    })) || [];
  } catch (error) {
    console.error(`Failed to fetch ${category} images from database:`, error);
    return [];
  }
}

// Get random images
export async function getRandomDatabaseImages(count: number = 3): Promise<ImageData[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_random_site_images', { count_param: count });
    
    if (error) {
      console.error('Error fetching random images:', error);
      return [];
    }
    
    return data?.map((img: any) => ({
      id: img.id,
      src: img.url,
      alt: img.alt_text || '',
      caption: img.caption,
      category: img.category
    })) || [];
  } catch (error) {
    console.error('Failed to fetch random images from database:', error);
    return [];
  }
}

// Upload a new image
export async function uploadImage(file: File, category: string, altText: string, caption?: string): Promise<ImageData | null> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `site_images/${category}/${fileName}`;
    
    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    // Use direct SQL instead of from()
    const { data, error } = await supabase.rpc(
      'insert_site_image',
      {
        url_param: publicUrl,
        category_param: category,
        alt_text_param: altText,
        caption_param: caption || null
      }
    );
      
    if (error) {
      console.error('Error saving image record:', error);
      return null;
    }
    
    return {
      id: data?.id || '',
      src: data?.url || '',
      alt: data?.alt_text || '',
      caption: data?.caption || undefined,
      category: data?.category || ''
    };
  } catch (error) {
    console.error('Failed to upload image:', error);
    return null;
  }
}

// Delete an image
export async function deleteImage(imageId: string): Promise<boolean> {
  try {
    // First get the image record to know the storage path
    const { data: imageData, error: fetchError } = await supabase.rpc(
      'get_site_image_by_id',
      { id_param: imageId }
    );
      
    if (fetchError || !imageData) {
      console.error('Error fetching image to delete:', fetchError);
      return false;
    }
    
    // Extract path from URL
    const urlParts = imageData.url.split('/');
    const filePath = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([filePath]);
      
    if (storageError) {
      console.error('Error deleting image from storage:', storageError);
    }
    
    // Delete from database using RPC
    const { error: dbError } = await supabase.rpc(
      'delete_site_image',
      { id_param: imageId }
    );
      
    if (dbError) {
      console.error('Error deleting image record:', dbError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
}
