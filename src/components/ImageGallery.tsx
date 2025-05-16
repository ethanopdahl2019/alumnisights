
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageData } from '@/data/images';

interface ImageGalleryProps {
  images: ImageData[];
  columns?: number;
  caption?: boolean;
  animated?: boolean;
  hover?: boolean;
  height?: string;
  className?: string;
}

const ImageGallery = ({
  images,
  columns = 3,
  caption = true,
  animated = true,
  hover = true,
  height = 'h-56',
  className = '',
}: ImageGalleryProps) => {
  const [shuffledImages, setShuffledImages] = useState<ImageData[]>([]);
  
  useEffect(() => {
    setShuffledImages(images);
  }, [images]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4 ${className}`}>
      {shuffledImages.map((image, index) => (
        <motion.div
          key={image.id}
          className={`overflow-hidden rounded-lg ${hover ? 'transition-all duration-300 hover:shadow-md' : 'shadow-sm'}`}
          initial={animated ? { opacity: 0, y: 20 } : undefined}
          whileInView={animated ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={hover ? { y: -5 } : undefined}
        >
          <div className={`overflow-hidden ${height}`}>
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          {caption && image.caption && (
            <div className="p-3 text-center bg-white">
              <p className="text-sm text-gray-600 font-sans">{image.caption}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGallery;
