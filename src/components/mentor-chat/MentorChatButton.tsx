
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { MessageSquare, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MentorChatButtonProps {
  mentorId: string;
  mentorName: string;
  className?: string;
}

export const MentorChatButton = ({ mentorId, mentorName, className }: MentorChatButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileId, setProfileId] = useState<string | null>(null);
  
  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        setProfileId(data.id);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    getProfile();
  }, [user]);
  
  const handleClick = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to message mentors",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    // Open chat dialog/page with this mentor
    navigate(`/mentor-chat/${mentorId}`);
  };
  
  return (
    <Button 
      onClick={handleClick} 
      variant="secondary" 
      size="sm" 
      className={className}
      title={`Message ${mentorName}`}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      Message
    </Button>
  );
};
