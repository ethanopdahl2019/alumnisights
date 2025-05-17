
import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentCanceled = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Payment Canceled | AlumniSights</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container-custom py-12 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="text-red-600 w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">Payment Canceled</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <p className="text-center text-gray-600">
              Your payment has been canceled and no charges have been made.
            </p>
            
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <p className="text-gray-700">
                If you experienced any issues during the payment process, please try again or contact our support team for assistance.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3 pt-4">
              <Button asChild>
                <Link to="/browse">Browse Mentors</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentCanceled;
