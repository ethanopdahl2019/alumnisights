
import { cn } from '@/lib/utils';

export type TagType = 'major' | 'sport' | 'club' | 'study';

interface TagProps {
  type: TagType;
  children: React.ReactNode;
  className?: string;
}

const Tag = ({ type, children, className }: TagProps) => {
  return (
    <span 
      className={cn(
        'tag',
        {
          'tag-major': type === 'major',
          'tag-sport': type === 'sport',
          'tag-club': type === 'club',
          'tag-study': type === 'study',
        },
        className
      )}
    >
      {children}
    </span>
  );
};

export default Tag;
