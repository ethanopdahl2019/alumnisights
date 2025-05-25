
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Clock, User } from "lucide-react";
import { ProfileWithDetails } from "@/types/database";

interface BookingSummaryProps {
  profile: ProfileWithDetails;
  selectedDateTime: Date | null;
  selectedDuration: 15 | 30 | 60;
  price: number;
  onBooking: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  profile,
  selectedDateTime,
  selectedDuration,
  price,
  onBooking,
}) => {
  const isBookingReady = selectedDateTime && price > 0;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{profile.name}</h3>
            <p className="text-sm text-gray-500">{profile.school?.name}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{selectedDuration} minute session</span>
          </div>
          
          {selectedDateTime && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>{format(selectedDateTime, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{format(selectedDateTime, "h:mm a")}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span>${price}</span>
          </div>
        </div>
        
        <Button 
          onClick={onBooking}
          disabled={!isBookingReady}
          className="w-full"
          size="lg"
        >
          {isBookingReady ? "Book Session" : "Select Date & Time"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
