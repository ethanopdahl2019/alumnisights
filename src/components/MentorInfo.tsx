
import { ProfileWithDetails } from '@/types/database';

interface MentorInfoProps {
  profile: ProfileWithDetails;
}

const MentorInfo = ({ profile }: MentorInfoProps) => {
  // Parse achievements to extract specific information
  const parseAchievements = (achievements: string[] | null) => {
    if (!achievements) return {};
    
    const parsed: Record<string, string[]> = {
      occupation: [],
      experience: [],
      activities: [],
      clubs: [],
      greekLife: [],
      degrees: []
    };
    
    achievements.forEach(achievement => {
      if (achievement.startsWith('Current Occupation:')) {
        parsed.occupation.push(achievement.replace('Current Occupation: ', ''));
      } else if (achievement.startsWith('Years of Experience:')) {
        parsed.experience.push(achievement.replace('Years of Experience: ', ''));
      } else if (achievement.startsWith('Activity:')) {
        parsed.activities.push(achievement.replace('Activity: ', ''));
      } else if (achievement.startsWith('Club:')) {
        parsed.clubs.push(achievement.replace('Club: ', ''));
      } else if (achievement.startsWith('Greek Life:')) {
        parsed.greekLife.push(achievement.replace('Greek Life: ', ''));
      } else if (achievement.includes('from') && achievement.includes('(')) {
        parsed.degrees.push(achievement);
      }
    });
    
    return parsed;
  };

  const achievementData = parseAchievements(profile.achievements);

  return (
    <div className="space-y-6">
      {/* Professional Info */}
      {achievementData.occupation.length > 0 && (
        <div>
          <h3 className="text-lg font-serif font-bold text-navy mb-2">Current Position</h3>
          <p className="text-gray-700 font-sans">{achievementData.occupation[0]}</p>
        </div>
      )}

      {achievementData.experience.length > 0 && (
        <div>
          <h3 className="text-lg font-serif font-bold text-navy mb-2">Experience</h3>
          <p className="text-gray-700 font-sans">{achievementData.experience[0]}</p>
        </div>
      )}

      {/* Education */}
      <div>
        <h3 className="text-lg font-serif font-bold text-navy mb-2">Education</h3>
        <div className="space-y-2">
          <p className="text-gray-700 font-sans">
            {profile.major?.name} at {profile.school?.name}
            {profile.graduation_year && ` (Class of ${profile.graduation_year})`}
          </p>
          
          {achievementData.degrees.length > 0 && (
            <div className="space-y-1">
              {achievementData.degrees.map((degree, index) => (
                <p key={index} className="text-gray-700 font-sans text-sm">{degree}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* College Activities */}
      {achievementData.activities.length > 0 && (
        <div>
          <h3 className="text-lg font-serif font-bold text-navy mb-2">College Activities</h3>
          <div className="flex flex-wrap gap-2">
            {achievementData.activities.map((activity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-sans"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* College Clubs */}
      {achievementData.clubs.length > 0 && (
        <div>
          <h3 className="text-lg font-serif font-bold text-navy mb-2">College Clubs</h3>
          <div className="flex flex-wrap gap-2">
            {achievementData.clubs.map((club, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-sans"
              >
                {club}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Greek Life */}
      {(achievementData.greekLife.length > 0 || profile.greek_life) && (
        <div>
          <h3 className="text-lg font-serif font-bold text-navy mb-2">Greek Life</h3>
          <p className="text-gray-700 font-sans">
            {achievementData.greekLife[0] || profile.greek_life}
          </p>
        </div>
      )}

      {/* Location */}
      {profile.location && (
        <div>
          <h3 className="text-lg font-serif font-bold text-navy mb-2">Location</h3>
          <p className="text-gray-700 font-sans">{profile.location}</p>
        </div>
      )}
    </div>
  );
};

export default MentorInfo;
