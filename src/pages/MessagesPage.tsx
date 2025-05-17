
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { getConversations } from '@/services/messages';
import { getProfileById } from '@/services/profiles';
import { Conversation } from '@/types/messages';
import { ProfileWithDetails } from '@/types/database';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConversationItem from '@/components/messaging/ConversationItem';
import MessageContainer from '@/components/messaging/MessageContainer';
import { Inbox, MessagesSquare } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeProfile, setActiveProfile] = useState<ProfileWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const fetchedConversations = await getConversations();
        setConversations(fetchedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
    
    // Poll for new conversations every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);
  
  // Fetch profile if ID is provided
  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        try {
          const profile = await getProfileById(id);
          setActiveProfile(profile);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      
      fetchProfile();
    }
  }, [id]);
  
  if (!user) {
    return <Navigate to="/auth?redirect=/messages" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container-custom py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
            </div>
            
            <div className="divide-y">
              {loading ? (
                // Loading state for conversations
                [...Array(3)].map((_, i) => (
                  <div key={i} className="py-3 flex items-center">
                    <div className="animate-pulse flex-1">
                      <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={id === (
                      user.id === conversation.sender_id 
                        ? conversation.recipient_id 
                        : conversation.sender_id
                    )}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Inbox className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400">
                    Start a conversation with a mentor from their profile
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Message Container */}
          <div className="md:col-span-2">
            {id && activeProfile ? (
              <MessageContainer
                recipientId={id}
                recipientName={activeProfile.name}
                recipientImage={activeProfile.image}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-lg shadow p-4">
                <MessagesSquare className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your Messages</h3>
                <p className="text-gray-500 text-center max-w-xs">
                  Select a conversation or start a new one by visiting a mentor's profile.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MessagesPage;
