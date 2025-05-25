
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface DateTimePickerProps {
  selectedDateTime: Date | null;
  onDateTimeChange: (date: Date | null) => void;
  selectedDuration: 15 | 30 | 60;
  onDurationChange: (duration: 15 | 30 | 60) => void;
  availableDurations: (15 | 30 | 60)[];
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDateTime,
  onDateTimeChange,
  selectedDuration,
  onDurationChange,
  availableDurations,
}) => {
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // If we already have a selected time, preserve it when changing date
      if (selectedDateTime) {
        const newDateTime = new Date(date);
        newDateTime.setHours(selectedDateTime.getHours());
        newDateTime.setMinutes(selectedDateTime.getMinutes());
        onDateTimeChange(newDateTime);
      } else {
        onDateTimeChange(date);
      }
    } else {
      onDateTimeChange(null);
    }
  };

  const handleTimeSelect = (timeString: string) => {
    if (!selectedDateTime) return;
    
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let adjustedHours = hours;
    if (period === 'PM' && hours !== 12) {
      adjustedHours += 12;
    } else if (period === 'AM' && hours === 12) {
      adjustedHours = 0;
    }
    
    const newDateTime = new Date(selectedDateTime);
    newDateTime.setHours(adjustedHours, minutes, 0, 0);
    onDateTimeChange(newDateTime);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getSelectedTimeString = () => {
    if (!selectedDateTime) return null;
    return format(selectedDateTime, "h:mm a");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Session Duration
        </h3>
        <div className="flex gap-2">
          {availableDurations.map((duration) => (
            <Badge
              key={duration}
              variant={selectedDuration === duration ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => onDurationChange(duration)}
            >
              {duration} min
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Select Date
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <Calendar
            mode="single"
            selected={selectedDateTime || undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border-0"
          />
        </div>
      </div>
      
      {selectedDateTime && (
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Available Times for {format(selectedDateTime, "MMMM d, yyyy")}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={getSelectedTimeString() === time ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
