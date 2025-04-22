
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface ConversationPreviewProps {
  id: string;
  otherUser: {
    name: string;
    image: string | null;
  };
  lastMessage?: string;
  timestamp?: string;
  paymentStatus: string;
  productType: string;
  schoolName?: string;
}

const ConversationPreview = ({
  id,
  otherUser,
  lastMessage,
  timestamp,
  paymentStatus,
  productType,
  schoolName
}: ConversationPreviewProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => navigate(`/messages/${id}`)}
    >
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={otherUser.image} alt={otherUser.name} />
          <AvatarFallback>{otherUser.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{otherUser.name}</h3>
          <p className="text-sm text-gray-500">
            {schoolName && `${schoolName} · `}{productType}
          </p>
          {lastMessage && (
            <p className="text-sm text-gray-600 mt-1 truncate max-w-xs">
              {lastMessage}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end">
        {timestamp && (
          <span className="text-xs text-gray-500 mb-1">
            {new Date(timestamp).toLocaleDateString()}
          </span>
        )}
        <span className={`px-2 py-1 rounded-full text-xs ${
          paymentStatus === "completed" || paymentStatus === "free"
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {paymentStatus === "completed" || paymentStatus === "free" ? "Paid" : "Unpaid"}
        </span>
      </div>
    </div>
  );
};

export default ConversationPreview;
