
import { Link } from 'react-router-dom';

interface SchoolCardProps {
  id: string;
  name: string;
  image: string | null;
  location: string | null;
  type: string | null;
}

const SchoolCard = ({ id, name, image, location, type }: SchoolCardProps) => {
  return (
    <Link 
      to={`/schools/${id}`}
      className="flex flex-col items-center p-4 transition-all hover:translate-y-[-5px]"
    >
      <div className="w-16 h-16 mb-3 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-400">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="text-center font-medium text-navy">{name}</h3>
      <div className="text-sm text-gray-500 text-center mt-1">
        {location && <div>{location}</div>}
        {type && <div className="capitalize">{type.replace(/_/g, ' ')}</div>}
      </div>
    </Link>
  );
};

export default SchoolCard;
