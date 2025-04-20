
import { Link } from 'react-router-dom';
import Tag, { TagType } from './Tag';
import { Avatar } from '@/components/ui/avatar';

export interface TagData {
  id: string;
  label: string;
  type: TagType;
}

export interface ProfileCardProps {
  id: string;
  name: string;
  image: string;
  school: string;
  major: string;
  tags: TagData[];
}

const ProfileCard = ({ id, name, image, school, major, tags }: ProfileCardProps) => {
  return (
    <Link to={`/profile/${id}`} className="profile-card group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={image} 
          alt={`${name}'s profile`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <Avatar className="h-10 w-10 mr-3">
            <img src={image} alt={name} className="object-cover" />
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-gray-600 text-sm">{school}</p>
          </div>
        </div>
        
        <div className="mt-1 mb-3">
          <Tag type="major">{major}</Tag>
        </div>
        
        <div className="mt-auto flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Tag key={tag.id} type={tag.type}>
              {tag.label}
            </Tag>
          ))}
          {tags.length > 3 && (
            <span className="text-sm text-gray-500">+{tags.length - 3} more</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
