
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface PaymentMethodSelectionProps {
  onStripeCheckout: () => void;
  onDirectBooking: () => void;
  isProcessing: boolean;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  onStripeCheckout,
  isProcessing
}) => {
  const handlePayNow = () => {
    onStripeCheckout();
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete your payment to confirm your session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3 p-4 rounded-md border border-primary bg-primary/5">
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="text-base font-medium flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pay with Card
              </div>
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
            "Proceed to Payment"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodSelection;
