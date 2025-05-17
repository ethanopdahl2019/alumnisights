
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProfileWithDetails } from "@/types/database";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BookingHeaderProps {
  profile: ProfileWithDetails;
  id: string;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ profile, id }) => {
  return (
    <div className="mb-8">
      <Link to={`/profile/${id}`} className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Profile
      </Link>
      
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.image || ""} alt={profile.name} />
          <AvatarFallback>{profile.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">{profile.headline || "Mentor"}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingHeader;
