
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Award, Puzzle, Microphone, Palette, Globe, Trophy, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClubsAndGreekLife = () => {
  const greekOrgs = [
    {
      category: "Fraternities",
      description: "Social and professional organizations for male students",
      benefits: ["Networking opportunities", "Leadership development", "Community service", "Lifelong brotherhood"]
    },
    {
      category: "Sororities",
      description: "Social and professional organizations for female students",
      benefits: ["Networking opportunities", "Leadership development", "Community service", "Lifelong sisterhood"]
    },
    {
      category: "Professional Greek Organizations",
      description: "Career-focused fraternities and sororities",
      benefits: ["Industry connections", "Professional development", "Career mentoring", "Alumni networks"]
    },
    {
      category: "Cultural Greek Organizations",
      description: "Organizations celebrating specific cultural identities",
      benefits: ["Cultural awareness", "Community building", "Identity exploration", "Cultural events"]
    }
  ];

  const clubTypes = [
    {
      name: "Academic & Professional",
      icon: <Award className="h-8 w-8 text-blue-500" />,
      examples: ["Pre-med Society", "Business Association", "Engineering Club", "Psychology Club"]
    },
    {
      name: "Arts & Culture",
      icon: <Palette className="h-8 w-8 text-purple-500" />,
      examples: ["Theater Group", "Dance Company", "Film Society", "Cultural Awareness Club"]
    },
    {
      name: "Community Service",
      icon: <Heart className="h-8 w-8 text-red-500" />,
      examples: ["Habitat for Humanity", "Food Bank Volunteers", "Environmental Action", "Tutoring Programs"]
    },
    {
      name: "Media & Publications",
      icon: <Microphone className="h-8 w-8 text-amber-500" />,
      examples: ["Student Newspaper", "Literary Magazine", "Radio Station", "TV Production Club"]
    },
    {
      name: "Political & Advocacy",
      icon: <Globe className="h-8 w-8 text-green-500" />,
      examples: ["Model UN", "Political Party Organizations", "Advocacy Groups", "Debate Team"]
    },
    {
      name: "Recreation & Sports",
      icon: <Trophy className="h-8 w-8 text-orange-500" />,
      examples: ["Intramural Sports", "Outdoor Adventure Club", "Chess Club", "Gaming Society"]
    },
    {
      name: "Special Interest",
      icon: <Puzzle className="h-8 w-8 text-indigo-500" />,
      examples: ["Robotics Club", "Investment Group", "Culinary Club", "Photography Society"]
    },
    {
      name: "Student Government",
      icon: <Users className="h-8 w-8 text-teal-500" />,
      examples: ["Student Council", "Residence Hall Association", "Class Committees", "Student Senate"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Clubs & Greek Life | AlumniSights</title>
        <meta name="description" content="Explore university clubs and Greek organizations" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Clubs & Greek Life
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover the diverse landscape of student organizations and Greek societies
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>
          
          <Tabs defaultValue="clubs" className="mb-12">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clubs">Student Clubs</TabsTrigger>
              <TabsTrigger value="greek">Greek Life</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clubs" className="mt-6">
              <h2 className="text-2xl font-semibold mb-6">Types of Student Organizations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clubTypes.map((club, index) => (
                  <Card key={index} className="border shadow hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 bg-gray-50 p-4 rounded-full">
                          {club.icon}
                        </div>
                        <h3 className="font-semibold text-lg mb-3">{club.name}</h3>
                        <div>
                          <h4 className="font-medium text-sm mb-2">Examples:</h4>
                          <ul className="text-xs">
                            {club.examples.map((example, i) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Benefits of Joining Student Organizations</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                    <span>Build leadership and teamwork skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                    <span>Expand your social circle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                    <span>Explore academic and career interests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                    <span>Enhance your resume</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                    <span>Make a difference in your community</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                    <span>Balance your academic experience</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="greek" className="mt-6">
              <h2 className="text-2xl font-semibold mb-6">Greek Life Organizations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {greekOrgs.map((org, index) => (
                  <Card key={index} className="border shadow hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{org.category}</h3>
                      <p className="text-gray-600 text-sm mb-4">{org.description}</p>
                      <h4 className="font-medium text-sm mb-2">Key Benefits:</h4>
                      <ul className="text-sm">
                        {org.benefits.map((benefit, i) => (
                          <li key={i} className="mb-1 flex items-start">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1.5"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Joining Greek Life: What to Consider</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Pros</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <span className="inline-block h-5 w-5 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                        <span>Strong social and professional network</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-5 w-5 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                        <span>Leadership opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-5 w-5 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                        <span>Community service experiences</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-5 w-5 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs">✓</span>
                        <span>Academic support systems</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Considerations</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <span className="inline-block h-5 w-5 rounded-full bg-amber-500 mr-2 flex items-center justify-center text-white text-xs">!</span>
                        <span>Financial commitments (dues, etc.)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-5 w-5 rounded-full bg-amber-500 mr-2 flex items-center justify-center text-white text-xs">!</span>
                        <span>Time management challenges</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-5 w-5 rounded-full bg-amber-500 mr-2 flex items-center justify-center text-white text-xs">!</span>
                        <span>Recruitment/rushing process</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-5 w-5 rounded-full bg-amber-500 mr-2 flex items-center justify-center text-white text-xs">!</span>
                        <span>Campus policies and expectations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-3">Want to learn more about campus life?</h2>
            <p className="mb-4">Connect with alumni who were involved in student organizations</p>
            <a 
              href="/browse" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Find a Mentor
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClubsAndGreekLife;
