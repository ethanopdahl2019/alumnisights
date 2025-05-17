
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CreditCard } from "lucide-react";

interface DateTimePickerProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-navy" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={time === selectedTime ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className="text-sm"
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedDate && selectedTime && (
        <Button
          onClick={handleConfirmBooking}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Payment
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default DateTimePicker;
