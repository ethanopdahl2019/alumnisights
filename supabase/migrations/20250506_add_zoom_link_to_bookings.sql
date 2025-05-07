
-- Add the zoom_link column to the bookings table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'bookings'
    AND column_name = 'zoom_link'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN zoom_link TEXT NULL;
    
    -- Log that the column was added
    RAISE NOTICE 'Added zoom_link column to bookings table';
  ELSE
    RAISE NOTICE 'zoom_link column already exists in bookings table';
  END IF;
END $$;
