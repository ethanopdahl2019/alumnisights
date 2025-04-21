
import { Link } from 'react-router-dom';
import Tag, { TagType } from './Tag';
import { ProfileWithDetails } from '@/types/database';

export interface ProfileCardProps {
  profile: ProfileWithDetails;
  variant?: "default" | "compact";
}

// Pills for tags
const TagPill = ({ text, type }: { text: string; type: TagType }) => (
  <span
    className={`inline-block px-2 py-0.5 text-xs rounded-full bg-tag-${type} text-tag-${type}-text`}
  >
    {text}
  </span>
);

const ProfileCard = ({ profile, variant = "default" }: ProfileCardProps) => {
  // Create tags from profile data (show up to 2 in compact)
  const tags =
    profile.activities?.map((activity) => ({
      id: activity.id,
      label: activity.name,
      type: activity.type as TagType,
    })) || [];
  const showTags = variant === "compact" ? tags.slice(0, 2) : tags.slice(0, 3);
  return (
    <Link
      to={`/profile/${profile.id}`}
      className={
        variant === "compact"
          ? "flex flex-col items-center px-4 py-4 mx-auto"
          : "profile-card group"
      }
      style={
        variant === "compact"
          ? { background: "none" }
          : {}
      }
    >
      {/* Profile Image */}
      <div
        className={
          variant === "compact"
            ? "w-20 h-20 mb-2 rounded-full overflow-hidden border-2 border-white shadow"
            : "relative aspect-[3/4] overflow-hidden"
        }
      >
        <img
          src={profile.image || '/placeholder.svg'}
          alt={`${profile.name}'s profile`}
          className={
            variant === "compact"
              ? "object-cover w-full h-full"
              : "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          }
        />
      </div>
      {/* Info */}
      <div className={variant === "compact" ? "text-center flex flex-col items-center" : "p-5 flex flex-col flex-grow"}>
        <h3 className="font-semibold text-base">{profile.name}</h3>
        <p className="text-sm text-gray-600">{profile.school?.name}</p>
        <div className="mt-1 flex flex-wrap gap-1 justify-center">
          {showTags.map((tag) => (
            <TagPill key={tag.id} text={tag.label} type={tag.type} />
          ))}
          {tags.length > showTags.length && (
            <span className="text-xs text-gray-400">+{tags.length - showTags.length} more</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
