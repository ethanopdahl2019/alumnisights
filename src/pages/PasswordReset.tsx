
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PasswordReset = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a placeholder for the password reset page. Actual implementation will be done later.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordReset;
