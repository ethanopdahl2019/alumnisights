
import { supabase } from '@/integrations/supabase/client';
import { ImageData } from '@/data/images';

// Fetch images from database
export async function getImagesFromDatabase(): Promise<ImageData[]> {
  try {
    const { data, error } = await supabase
      .from('site_images')
      .select('*');
    
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
    let query = supabase
      .from('site_images')
      .select('*')
      .eq('category', category);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
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
      .from('site_images')
      .select('*')
      .order('id') // Order randomly using the database function
      .limit(count);
    
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
    
    // Insert the record into the database
    const { data, error } = await supabase
      .from('site_images')
      .insert({
        url: publicUrl,
        category: category,
        alt_text: altText,
        caption: caption || null
      })
      .select('*')
      .single();
      
    if (error) {
      console.error('Error saving image record:', error);
      return null;
    }
    
    return {
      id: data.id,
      src: data.url,
      alt: data.alt_text || '',
      caption: data.caption || undefined,
      category: data.category
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
    const { data: imageData, error: fetchError } = await supabase
      .from('site_images')
      .select('*')
      .eq('id', imageId)
      .single();
      
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
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('site_images')
      .delete()
      .eq('id', imageId);
      
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
