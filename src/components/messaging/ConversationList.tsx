
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { getConversations, Conversation } from "@/services/messaging";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export const ConversationList = () => {
  const { user } = useAuth();
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 flex items-center space-x-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-100 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No conversations yet
      </div>
    );
  }

  const getOtherParticipantName = (conversation: Conversation) => {
    if (!user) return "";
    return user.id === conversation.student_id ? "Mentor" : "Student";
  };

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <Link 
          key={conversation.id} 
          to={`/messaging/conversation/${conversation.id}`}
        >
          <Card className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <Avatar>
                {conversation.profile?.image ? (
                  <AvatarImage src={conversation.profile.image} alt={conversation.profile?.name || "User"} />
                ) : (
                  <AvatarFallback>{getOtherParticipantName(conversation).substring(0, 2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {conversation.profile?.name || getOtherParticipantName(conversation)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
