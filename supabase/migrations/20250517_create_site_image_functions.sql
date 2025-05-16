
-- Function to get all site images
CREATE OR REPLACE FUNCTION public.get_all_site_images()
RETURNS SETOF public.site_images
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.site_images;
$$;

-- Function to get site images by category
CREATE OR REPLACE FUNCTION public.get_site_images_by_category(
  category_param TEXT,
  limit_param INT DEFAULT NULL
)
RETURNS SETOF public.site_images
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF limit_param IS NULL THEN
    RETURN QUERY 
    SELECT * FROM public.site_images
    WHERE category = category_param;
  ELSE
    RETURN QUERY 
    SELECT * FROM public.site_images
    WHERE category = category_param
    LIMIT limit_param;
  END IF;
END;
$$;

-- Function to get random site images
CREATE OR REPLACE FUNCTION public.get_random_site_images(
  count_param INT DEFAULT 3
)
RETURNS SETOF public.site_images
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.site_images
  ORDER BY random()
  LIMIT count_param;
$$;

-- Function to get a site image by id
CREATE OR REPLACE FUNCTION public.get_site_image_by_id(
  id_param UUID
)
RETURNS public.site_images
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.site_images
  WHERE id = id_param
  LIMIT 1;
$$;

-- Function to insert a site image
CREATE OR REPLACE FUNCTION public.insert_site_image(
  url_param TEXT,
  category_param TEXT,
  alt_text_param TEXT DEFAULT NULL,
  caption_param TEXT DEFAULT NULL
)
RETURNS public.site_images
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_image public.site_images;
BEGIN
  INSERT INTO public.site_images (url, category, alt_text, caption)
  VALUES (url_param, category_param, alt_text_param, caption_param)
  RETURNING * INTO new_image;
  
  RETURN new_image;
END;
$$;

-- Function to delete a site image
CREATE OR REPLACE FUNCTION public.delete_site_image(
  id_param UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_affected INT;
BEGIN
  DELETE FROM public.site_images
  WHERE id = id_param;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;
