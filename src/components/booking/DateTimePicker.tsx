
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  availableTimes: string[];
  isDateDisabled: (date: Date) => boolean;
  handleConfirmBooking: () => void;
  isProcessing: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  availableTimes,
  isDateDisabled,
  handleConfirmBooking,
  isProcessing,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Date & Time</CardTitle>
        <CardDescription>
          Choose from available slots in the mentor's calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Date
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
          </div>
        </div>
        
        {selectedDate && (
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Available Times for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={cn(
                    "justify-center",
                    selectedTime === time ? "bg-primary text-primary-foreground" : ""
                  )}
                  onClick={() => setSelectedTime(time)}
                  disabled={isProcessing}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!selectedDate || !selectedTime || isProcessing}
          onClick={handleConfirmBooking}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DateTimePicker;
