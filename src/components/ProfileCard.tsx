
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Tag, { TagType } from './Tag';
import { ProfileWithDetails } from '@/types/database';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

export interface TagData {
  id: string;
  label: string;
  type: TagType;
}

export interface ProfileCardProps {
  profile: ProfileWithDetails;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const { user } = useAuth();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  useEffect(() => {
    const checkIfOwnProfile = async () => {
      if (user && profile) {
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (data && data.id === profile.id) {
          setIsOwnProfile(true);
        }
      }
    };
    
    checkIfOwnProfile();
  }, [user, profile]);

  // Make sure we have proper profile data
  if (!profile || !profile.id) {
    return null;
  }

  const tags: TagData[] = [
    ...(profile.activities?.map(activity => ({
      id: activity.id,
      label: activity.name,
      type: activity.type as TagType
    })) || [])
  ];
  
  // Always link to the public profile page, regardless of who is viewing
  const linkDestination = `/alumni/${profile.id}`;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link 
        to={linkDestination} 
        className="bg-white rounded-xl overflow-hidden flex flex-col items-center p-6 transition duration-300 hover:shadow-md" 
        data-testid="profile-card"
      >
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
            {profile.major && (
              <Tag type="major">{profile.major.name}</Tag>
            )}
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
    </motion.div>
  );
};

export default ProfileCard;
