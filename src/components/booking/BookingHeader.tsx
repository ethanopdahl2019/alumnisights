
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ProfileWithDetails } from "@/types/database";

interface BookingHeaderProps {
  profile: ProfileWithDetails;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(`/alumni/${profile.id}`)}
          className="flex items-center text-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img 
                  src={profile.image || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl">Book a Session with {profile.name}</h1>
                <p className="text-sm text-gray-500 font-normal">
                  {profile.school?.name} • {profile.major?.name}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>
    </>
  );
};

export default BookingHeader;
