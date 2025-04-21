
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Messages = () => {
  const { conversationId } = useParams<{ conversationId: string }>();

  // Message UI coming soon
  return (
    <div>
      <Navbar />
      <main className="container-custom py-10">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="border rounded bg-white p-4">
          <div><strong>Conversation:</strong> {conversationId}</div>
          <div className="text-gray-500 my-6">Real-time chat between applicant and alumni here soon!</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
