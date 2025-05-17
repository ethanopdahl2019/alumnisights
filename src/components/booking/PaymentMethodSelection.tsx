
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, CalendarCheck } from "lucide-react";

interface PaymentMethodSelectionProps {
  onStripeCheckout: () => void;
  onDirectBooking: () => void;
  isProcessing: boolean;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  onStripeCheckout,
  onDirectBooking,
  isProcessing
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("stripe");

  const handlePayNow = () => {
    if (selectedMethod === "stripe") {
      onStripeCheckout();
    } else {
      onDirectBooking();
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
        <CardDescription>
          Choose how you'd like to pay for your session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedMethod} 
          onValueChange={setSelectedMethod}
          className="space-y-4"
        >
          <div className={`flex items-start space-x-3 p-4 rounded-md border ${selectedMethod === "stripe" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
            <RadioGroupItem value="stripe" id="stripe" className="mt-1" />
            <div className="flex-1">
              <div className="flex justify-between">
                <Label htmlFor="stripe" className="text-base font-medium flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pay with Card
                </Label>
                <div className="flex items-center gap-1">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" className="h-6" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" className="h-6" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple Pay" className="h-6" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1 ml-7">
                Secure payment through Stripe. You'll be redirected to complete your payment.
              </p>
            </div>
          </div>

          <div className={`flex items-start space-x-3 p-4 rounded-md border ${selectedMethod === "direct" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
            <RadioGroupItem value="direct" id="direct" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="direct" className="text-base font-medium flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                Book Now, Pay Later
              </Label>
              <p className="text-sm text-muted-foreground mt-1 ml-7">
                Reserve your session now and pay directly to the mentor. You'll coordinate payment details later.
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePayNow} 
          disabled={isProcessing} 
          className="w-full"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2">◌</span>
              Processing...
            </>
          ) : (
            selectedMethod === "stripe" ? "Proceed to Payment" : "Confirm Booking"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodSelection;
