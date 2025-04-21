
import { Link } from 'react-router-dom';
import Tag, { TagType } from './Tag';
import { ProfileWithDetails } from '@/types/database';

export interface TagData {
  id: string;
  label: string;
  type: TagType;
}

export interface ProfileCardProps {
  profile: ProfileWithDetails;
}

// Link must point to /profile/:id, ID must be present and correct from profile.id
const ProfileCard = ({ profile }: ProfileCardProps) => {
  const tags: TagData[] = [
    ...(profile.activities?.map(activity => ({
      id: activity.id,
      label: activity.name,
      type: activity.type as TagType
    })) || [])
  ];
  
  return (
    <Link to={`/profile/${profile.id}`} className="bg-white rounded-xl overflow-hidden flex flex-col items-center p-6 transition duration-300 hover:shadow-md" data-profileid={profile.id}>
      <div className="flex justify-center w-full mb-4">
        <img 
          src={profile.image || '/placeholder.svg'} 
          alt={`${profile.name}'s profile`} 
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm"
        />
      </div>
      <div className="flex flex-col items-center flex-grow w-full">
        <h3 className="font-medium text-lg text-center">{profile.name}</h3>
        <p className="text-gray-600 text-sm text-center mb-2">{profile.school?.name}</p>
        <div className="mb-3">
          <Tag type="major">{profile.major?.name}</Tag>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
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
