
import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface BookingOption {
  id: string;
  title: string;
  duration: string;  // ensure this is always required when passing booking options
  description: string;
  price: number;
}

interface BookingOptionsProps {
  profileId: string;
  options: BookingOption[];
}

const BookingOptions = ({ profileId, options }: BookingOptionsProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-medium mb-6">Book a Conversation</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {options.map((option) => (
          <div 
            key={option.id}
            className={`border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
              selectedOption === option.id 
                ? 'border-navy shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedOption(option.id)}
          >
            <h4 className="text-lg font-medium mb-2">{option.title}</h4>
            
            <div className="flex items-center text-gray-600 mb-4">
              <Clock size={16} className="mr-2" />
              <span>{option.duration}</span>
            </div>
            
            <p className="text-gray-600 mb-6">{option.description}</p>
            
            <div className="flex justify-between items-center mt-auto">
              <span className="font-medium">${option.price}</span>
              
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedOption === option.id
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-navy hover:bg-gray-200'
                }`}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedOption && (
        <div className="mt-10">
          <h4 className="text-xl font-medium mb-6">Select a Time</h4>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-6">
              <Calendar size={20} className="mr-2 text-navy" />
              <span className="font-medium">Available dates</span>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-8">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i + 1);
                
                return (
                  <button
                    key={i}
                    className="p-3 rounded-lg border border-gray-200 hover:border-navy focus:outline-none focus:border-navy transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-500">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="font-medium mt-1">
                        {date.getDate()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center mb-6">
              <Clock size={20} className="mr-2 text-navy" />
              <span className="font-medium">Available times</span>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-8">
              {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                <button
                  key={time}
                  className="py-2 px-4 rounded-lg border border-gray-200 hover:border-navy focus:outline-none focus:border-navy transition-colors text-center"
                >
                  {time}
                </button>
              ))}
            </div>
            
            <button className="w-full btn-primary">
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingOptions;
