
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MentorChatInbox } from "@/components/mentor-chat/MentorChatInbox";
import { MentorChatConversation } from "@/components/mentor-chat/MentorChatConversation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "@/components/mentor-chat/MessageSquare";

const MentorChat = () => {
  const { mentorId } = useParams<{ mentorId?: string }>();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Mentor Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* On mobile, show tabs to switch between inbox and conversation */}
          <div className="md:hidden w-full">
            {mentorId ? (
              <Tabs defaultValue="conversation">
                <TabsList className="w-full">
                  <TabsTrigger value="inbox" className="w-1/2">Inbox</TabsTrigger>
                  <TabsTrigger value="conversation" className="w-1/2">Conversation</TabsTrigger>
                </TabsList>
                <TabsContent value="inbox">
                  <div className="rounded-lg border border-t-0 rounded-t-none bg-white">
                    <MentorChatInbox />
                  </div>
                </TabsContent>
                <TabsContent value="conversation">
                  <div className="rounded-lg border border-t-0 rounded-t-none bg-white h-[500px]">
                    <MentorChatConversation recipientId={mentorId} />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="rounded-lg border bg-white">
                <MentorChatInbox />
              </div>
            )}
          </div>
          
          {/* On desktop, show inbox and conversation side by side */}
          <div className="hidden md:block md:col-span-1">
            <div className="rounded-lg border bg-white h-[600px]">
              <MentorChatInbox />
            </div>
          </div>
          
          <div className="hidden md:block md:col-span-2">
            {mentorId ? (
              <div className="rounded-lg border bg-white h-[600px]">
                <MentorChatConversation recipientId={mentorId} />
              </div>
            ) : (
              <div className="rounded-lg border bg-white h-[600px] flex items-center justify-center">
                <div className="text-center p-4">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h2 className="text-lg font-semibold mb-1">No conversation selected</h2>
                  <p className="text-gray-500">Choose a contact from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentorChat;
