import React from 'react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const ProfileComplete = () => {
  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12">
        <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white text-center py-4">
            <h2 className="text-2xl font-semibold">Profile Complete!</h2>
          </div>
          <div className="px-6 py-8">
            <p className="text-gray-700 mb-4">
              Your profile has been successfully completed. You can now start exploring AlumniSights and connect with other alumni.
            </p>
            <div className="flex justify-between">
              <Button asChild>
                <Link to="/browse">
                  Browse Profiles
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/">
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComplete;
