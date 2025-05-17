
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { getMentorChatContacts } from "@/services/mentor-chat";
import { MentorChatContact } from "@/types/mentor-chat";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { MessageSquare } from "@/components/mentor-chat/MessageSquare";

export const MentorChatInbox = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<MentorChatContact[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      
      try {
        const contactsList = await getMentorChatContacts(user.id);
        setContacts(contactsList);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, [user]);
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <MessageSquare className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">No messages yet</h3>
        <p className="text-gray-500 mt-1">
          When you message mentors, they'll appear here
        </p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 p-1">
        {contacts.map((contact, index) => (
          <motion.div 
            key={contact.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={`/mentor-chat/${contact.id}`}>
              <Card className={`p-3 flex items-center space-x-3 hover:bg-gray-50 ${contact.unreadCount > 0 ? 'bg-blue-50' : ''}`}>
                <div className="relative">
                  <img 
                    src={contact.image || "/placeholder.svg"}
                    alt={contact.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  {contact.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-medium truncate">{contact.name}</h4>
                    {contact.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(contact.lastMessage.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {contact.lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {contact.lastMessage.content}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};
