
import React from 'react';
import { Link } from 'react-router-dom';
import { Conversation } from '@/types/messages';
import { useAuth } from '@/components/AuthProvider';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ 
  conversation, 
  isActive = false 
}) => {
  const { user } = useAuth();
  
  // Determine if current user is sender or recipient
  const isUserSender = user?.id === conversation.sender_id;
  const otherPersonId = isUserSender ? conversation.recipient_id : conversation.sender_id;
  const otherPersonName = isUserSender ? conversation.recipient_name : conversation.sender_name;
  const otherPersonImage = isUserSender ? conversation.recipient_image : conversation.sender_image;
  
  // Format time
  const timeAgo = formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true });
  
  return (
    <Link 
      to={`/messages/${otherPersonId}`}
      className={cn(
        "flex items-center p-3 hover:bg-gray-100 transition-colors rounded-lg",
        isActive && "bg-gray-100"
      )}
    >
      <div className="flex-shrink-0 mr-3">
        <img
          src={otherPersonImage || "/placeholder.svg"}
          alt={otherPersonName}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm truncate">{otherPersonName}</h4>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {isUserSender && <span className="text-gray-400 mr-1">You:</span>}
          {conversation.content}
        </p>
      </div>
    </Link>
  );
};

export default ConversationItem;
