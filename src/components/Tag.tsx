
import { cn } from '@/lib/utils';

export type TagType = 'major' | 'sport' | 'club' | 'study' | 'study_abroad';

export interface TagData {
  id: string;
  label: string;
  type: TagType;
}

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
          'tag-study_abroad': type === 'study_abroad',
        },
        className
      )}
    >
      {children}
    </span>
  );
};

export default Tag;
