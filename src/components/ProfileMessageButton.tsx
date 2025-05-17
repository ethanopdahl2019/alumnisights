
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { startConversation } from "@/services/messaging";

interface ProfileMessageButtonProps {
  profileId: string;
  userId: string;
}

export const ProfileMessageButton: React.FC<ProfileMessageButtonProps> = ({ profileId, userId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => startConversation(userId),
    onSuccess: (data) => {
      navigate(`/messaging/conversation/${data.id}`);
    },
    onError: (error) => {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation. Please try again.");
    }
  });

  const handleClick = () => {
    if (!user) {
      navigate("/auth", { state: { from: `/profile/${profileId}` } });
      return;
    }
    
    mutation.mutate();
  };

  if (user?.id === userId) {
    return null; // Don't show button on own profile
  }

  return (
    <Button 
      onClick={handleClick} 
      variant="outline"
      disabled={mutation.isPending}
      className="flex items-center gap-2"
    >
      <MessageSquare className="h-4 w-4" />
      {mutation.isPending ? "Starting conversation..." : "Message"}
    </Button>
  );
};
