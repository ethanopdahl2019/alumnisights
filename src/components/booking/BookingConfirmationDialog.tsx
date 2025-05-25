
import React from "react";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ProfileWithDetails } from "@/types/database";

interface BookingConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ProfileWithDetails;
  selectedDateTime: Date | null;
  selectedDuration: 15 | 30 | 60;
  price: number;
  paymentMethod: 'card' | 'paypal';
}

const BookingConfirmationDialog: React.FC<BookingConfirmationProps> = ({
  open,
  onOpenChange,
  profile,
  selectedDateTime,
  selectedDuration,
  price,
  paymentMethod
}) => {
  const navigate = useNavigate();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-green-100 p-1 rounded-full">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            Booking Confirmed!
          </DialogTitle>
          <DialogDescription>
            Your session has been booked successfully and is awaiting confirmation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Session:</span>
            <span className="font-medium">{selectedDuration} minute session</span>
          </div>
          {selectedDateTime && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{format(selectedDateTime, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium">{format(selectedDateTime, "h:mm a")}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">With:</span>
            <span className="font-medium">{profile.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment:</span>
            <span className="font-medium">${price} via {paymentMethod === 'card' ? 'Card' : 'PayPal'}</span>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md mt-4">
            <p className="text-sm text-blue-800">
              An administrator will review your booking and add a Zoom link. You'll be able to see the link in your student dashboard once it's added.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => navigate(`/student-dashboard`)}>
            Go to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationDialog;
