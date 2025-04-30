
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UndergraduateAdmissions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Undergraduate Admissions Insights | AlumniSights</title>
        <meta name="description" content="Learn about undergraduate admission processes and strategies" />
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Undergraduate Admissions Insights
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Expert advice and insights on undergraduate admissions processes at top universities
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>
          
          <div className="grid gap-8 md:gap-12 mb-16">
            {/* Stanford University */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
                  <CardTitle className="text-2xl font-semibold text-navy">How to Get Into Stanford University</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-lg">
                  Strategies and insights for Stanford University admissions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-navy">127. Stanford University</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Founded in 1885 by Leland and Jane Stanford in memory of their only child, Stanford University is a private research university located in Stanford, California, in the heart of Silicon Valley. Widely regarded as one of the most prestigious institutions in the world, Stanford has played a central role in advancing education, entrepreneurship, science, technology, and public leadership across the modern era. Its motto, "Die Luft der Freiheit weht" ("The wind of freedom blows"), reflects the university's spirit of intellectual independence and innovation.
                    </p>
                    <Button variant="outline" asChild className="mt-4">
                      <Link to="#" className="flex items-center">
                        Read full guide <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-gray-100 rounded-lg flex items-center justify-center min-h-[240px]">
                    <p className="text-gray-500 italic">Image placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Harvard University */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-red-50 pb-2">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-6 w-6 text-red-600 mr-2" />
                  <CardTitle className="text-2xl font-semibold text-navy">How to Get Into Harvard University</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-lg">
                  Strategies and insights for Harvard University admissions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-navy">Harvard University</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Content about Harvard University admissions will be added here.
                    </p>
                    <Button variant="outline" asChild className="mt-4">
                      <Link to="#" className="flex items-center">
                        Read full guide <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-gray-100 rounded-lg flex items-center justify-center min-h-[240px]">
                    <p className="text-gray-500 italic">Image placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Yale University */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
                  <CardTitle className="text-2xl font-semibold text-navy">How to Get Into Yale University</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-lg">
                  Strategies and insights for Yale University admissions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-navy">Yale University</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Content about Yale University admissions will be added here.
                    </p>
                    <Button variant="outline" asChild className="mt-4">
                      <Link to="#" className="flex items-center">
                        Read full guide <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-gray-100 rounded-lg flex items-center justify-center min-h-[240px]">
                    <p className="text-gray-500 italic">Image placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UndergraduateAdmissions;
