
import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  isMentor?: boolean;
  disabled?: boolean;
  showPresets?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSend, 
  isMentor = false, 
  disabled = false,
  showPresets = false
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const characterLimit = isMentor ? 120 : 1000;
  const characterCount = message.length;
  const isOverLimit = characterCount > characterLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    if (isOverLimit) {
      toast.error(`Message exceeds the ${characterLimit} character limit`);
      return;
    }
    
    try {
      setSending(true);
      await onSend(message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t">
      <div className="relative">
        <Textarea
          placeholder={disabled ? "Sign in to send messages" : isMentor ? "Type a response (120 character limit)" : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="pr-12 resize-none"
          disabled={disabled || sending}
          maxLength={1000}
          rows={2}
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-2 bottom-2"
          disabled={!message.trim() || disabled || sending || isOverLimit}
        >
          <Send size={16} />
        </Button>
      </div>

      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        {isMentor && (
          <div className={isOverLimit ? "text-red-500" : ""}>
            {characterCount}/{characterLimit} characters
          </div>
        )}
        {!showPresets && <div></div>}
        {disabled && <div className="italic">Sign in to send messages</div>}
      </div>
    </form>
  );
};
