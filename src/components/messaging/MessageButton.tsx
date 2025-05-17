
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { sendMessage } from '@/services/messages';
import { toast } from 'sonner';

interface MessageButtonProps {
  profileId: string;
  mentorName: string;
  buttonVariant?: 'default' | 'outline' | 'secondary';
  buttonSize?: 'default' | 'sm' | 'lg';
  className?: string;
}

const MessageButton: React.FC<MessageButtonProps> = ({
  profileId,
  mentorName,
  buttonVariant = 'default',
  buttonSize = 'default',
  className,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleOpenChange = (open: boolean) => {
    if (!user && open) {
      // Redirect to auth page if not logged in
      navigate(`/auth?redirect=/alumni/${profileId}`);
      return;
    }
    setIsOpen(open);
  };
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (message.length > 120) {
      toast.error('Message cannot exceed 120 characters');
      return;
    }
    
    setLoading(true);
    try {
      await sendMessage(profileId, message);
      toast.success('Message sent successfully');
      setIsOpen(false);
      setMessage('');
      // Navigate to messages page with this recipient
      navigate(`/messages/${profileId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={className}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message to {mentorName}</DialogTitle>
          <DialogDescription>
            Start a conversation with {mentorName}. Messages are limited to 120 characters.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${mentorName}, I'd like to connect...`}
            className="resize-none"
            maxLength={120}
          />
          <div className="flex justify-between mt-2">
            <span className={message.length > 120 ? "text-red-500 text-sm" : "text-gray-500 text-sm"}>
              {message.length}/120 characters
            </span>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading || !message.trim() || message.length > 120}
            onClick={handleSendMessage}
          >
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageButton;
