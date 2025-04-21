
import { Link } from "react-router-dom";
import Tag, { TagType } from "./Tag";
import { Avatar } from "@/components/ui/avatar";
import { ProfileWithDetails } from "@/types/database";

interface MinimalProfileCardProps {
  profile: ProfileWithDetails;
  variant?: "mini" | "standard";
}

const ProfileCard = ({ profile, variant = "standard" }: MinimalProfileCardProps) => {
  // Activity tags
  const tags = (profile.activities || []).map((activity) => ({
    id: activity.id,
    label: activity.name,
    type: (activity.type === "study_abroad" ? "study_abroad" : activity.type) as TagType,
  }));

  if (variant === "mini") {
    // Minimal/compact version for carousels
    return (
      <Link
        to={`/profile/${profile.id}`}
        className="profile-card bg-transparent shadow-none hover:shadow-none min-h-0 p-0 rounded-lg flex flex-col items-center gap-0 text-center group"
      >
        <div className="w-20 h-20 rounded-full border overflow-hidden mb-2 flex-shrink-0">
          <Avatar className="h-20 w-20">
            <img
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              className="object-cover"
            />
          </Avatar>
        </div>
        <div className="mt-0 flex flex-col items-center w-full">
          <h3 className="text-base font-semibold text-navy">{profile.name}</h3>
          <div className="text-xs text-gray-500 truncate max-w-[140px] w-full">{profile.school?.name}</div>
          <div className="mt-1 flex gap-1 flex-wrap justify-center">
            {profile.major && (
              <Tag type="major" className="px-2 py-0.5 text-xs">
                {profile.major.name}
              </Tag>
            )}
          </div>
          <div className="flex gap-1 mt-1 flex-wrap justify-center max-w-[140px]">
            {tags.slice(0, 2).map((tag) => (
              <Tag key={tag.id} type={tag.type} className="px-2 py-0.5 text-xs">
                {tag.label}
              </Tag>
            ))}
            {tags.length > 2 && (
              <span className="text-xs text-gray-400">+{tags.length - 2}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default standard card (could be used elsewhere)
  return (
    <Link to={`/profile/${profile.id}`} className="profile-card group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={profile.image || '/placeholder.svg'} 
          alt={`${profile.name}'s profile`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <Avatar className="h-10 w-10 mr-3">
            <img src={profile.image || '/placeholder.svg'} alt={profile.name} className="object-cover" />
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{profile.name}</h3>
            <p className="text-gray-600 text-sm">{profile.school?.name}</p>
          </div>
        </div>
        
        <div className="mt-1 mb-3">
          <Tag type="major">{profile.major?.name}</Tag>
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
