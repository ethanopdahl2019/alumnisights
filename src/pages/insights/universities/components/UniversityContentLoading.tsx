
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const UniversityContentLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar skeleton */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-96 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Form card skeleton */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-48" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                  {/* University name field */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Logo upload */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                  </div>

                  {/* Overview field */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-32 w-full" />
                  </div>

                  {/* Admission stats field */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Hero image upload */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </div>

                  {/* Did you know field */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                  </div>

                  {/* Application requirements field */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-32 w-full" />
                  </div>

                  {/* Alumni insights field */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 justify-end mt-8">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Loading indicator overlay */}
      <div className="fixed inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-navy border-t-transparent"></div>
          <p className="text-navy font-medium">Loading university content...</p>
        </div>
      </div>
    </div>
  );
};

export default UniversityContentLoading;
