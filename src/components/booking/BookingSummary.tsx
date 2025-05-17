
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, Clock, CreditCard } from "lucide-react";

interface ProductInfo {
  title: string;
  price: number;
  duration: string;
  id: string;
}

interface BookingSummaryProps {
  selectedProduct: ProductInfo;
  selectedDate: Date | undefined;
  selectedTime: string | null;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedProduct,
  selectedDate,
  selectedTime,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">{selectedProduct.title}</h3>
          <p className="text-sm text-gray-500">{selectedProduct.duration}</p>
        </div>
        
        {selectedDate && selectedTime && (
          <div className="pt-2 border-t">
            <h3 className="font-medium mb-1">Selected Time</h3>
            <p className="text-sm flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              {format(selectedDate, "MMMM d, yyyy")}
            </p>
            <p className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              {selectedTime}
            </p>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>${selectedProduct.price}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <CreditCard className="h-3.5 w-3.5" />
            Payment will be processed securely via Stripe
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
