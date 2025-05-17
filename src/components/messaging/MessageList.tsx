
import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { Message } from "@/services/messaging";

interface MessageListProps {
  messages: Message[];
  profiles: {
    [key: string]: {
      name: string;
      image: string | null;
    };
  };
  onScrollToBottom?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, profiles, onScrollToBottom }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref: bottomRef, inView } = useInView();

  useEffect(() => {
    if (inView && onScrollToBottom) {
      onScrollToBottom();
    }
  }, [inView, onScrollToBottom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 italic">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  const groupByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const date = new Date(message.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return Object.entries(groups);
  };

  const groupedMessages = groupByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-8">
      {groupedMessages.map(([date, messages]) => (
        <div key={date} className="space-y-4">
          <div className="sticky top-0 z-10 flex justify-center">
            <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>

          {messages.map((message) => {
            const isCurrentUser = user?.id === message.sender_id;
            const profile = profiles[message.sender_id];

            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-8 h-8 mt-1 mx-2">
                    {profile?.image ? (
                      <AvatarImage src={profile.image} alt={profile.name} />
                    ) : (
                      <AvatarFallback>
                        {profile?.name.substring(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div>
                    <div 
                      className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-gray-100 text-gray-800"
                      } ${message.is_preset ? "italic" : ""}`}
                    >
                      {message.content}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? "text-right mr-2" : "ml-2"}`}>
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      
      <div ref={bottomRef} />
      <div ref={messagesEndRef} />
    </div>
  );
};
