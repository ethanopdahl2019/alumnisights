
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentMethodSelectionProps {
  paymentMethod: 'card' | 'paypal';
  onPaymentMethodChange: (method: 'card' | 'paypal') => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  paymentMethod,
  onPaymentMethodChange
}) => {
  return (
    <div className="space-y-4">
      <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
        <div className="flex items-center space-x-2 p-3 border rounded-lg">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
            <CreditCard className="h-4 w-4" />
            Credit/Debit Card
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-3 border rounded-lg">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
            <Wallet className="h-4 w-4" />
            PayPal
          </Label>
        </div>
      </RadioGroup>
      
      <div className="text-xs text-gray-500 mt-2">
        Secure payment processing. Your payment information is encrypted and protected.
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
