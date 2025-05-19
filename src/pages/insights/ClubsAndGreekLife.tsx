
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Award, Flag, Medal, Trophy, Calendar, Music, Dumbbell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ClubsAndGreekLife = () => {
  const orgTypes = [
    {
      name: "Fraternities",
      icon: <Trophy className="h-8 w-8 text-blue-500" />,
      description: "Traditional brotherhood organizations focused on leadership, service, and social activities",
      examples: ["Phi Beta Kappa", "Sigma Alpha Epsilon", "Alpha Phi Alpha"]
    },
    {
      name: "Sororities",
      icon: <Award className="h-8 w-8 text-pink-500" />,
      description: "Sisterhood organizations promoting academic excellence, leadership, and philanthropic efforts",
      examples: ["Alpha Chi Omega", "Delta Sigma Theta", "Kappa Kappa Gamma"]
    },
    {
      name: "Academic Clubs",
      icon: <Medal className="h-8 w-8 text-amber-500" />,
      description: "Field-specific organizations that enhance your academic experience and career prospects",
      examples: ["Pre-Med Society", "Economics Club", "Future Teachers of America"]
    },
    {
      name: "Cultural Organizations",
      icon: <Flag className="h-8 w-8 text-red-500" />,
      description: "Groups celebrating diversity and promoting cultural awareness and education",
      examples: ["Black Student Union", "Asian Cultural Association", "Latino Student Alliance"]
    },
    {
      name: "Athletic Clubs",
      icon: <Dumbbell className="h-8 w-8 text-green-500" />,
      description: "Sports and recreational activities outside of NCAA athletics",
      examples: ["Rugby Club", "Climbing Club", "Ultimate Frisbee Team"]
    },
    {
      name: "Performing Arts",
      icon: <Music className="h-8 w-8 text-purple-500" />,
      description: "Organizations focused on theater, dance, music and other artistic expressions",
      examples: ["A Cappella Groups", "Dance Company", "Theater Club"]
    },
    {
      name: "Service Organizations",
      icon: <Users className="h-8 w-8 text-teal-500" />,
      description: "Groups dedicated to community service and volunteerism",
      examples: ["Habitat for Humanity", "Circle K", "Alpha Phi Omega"]
    },
    {
      name: "Special Interest",
      icon: <Calendar className="h-8 w-8 text-indigo-500" />,
      description: "Clubs centered around specific hobbies, interests, or causes",
      examples: ["Environmental Club", "Chess Club", "Debate Team"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Clubs & Greek Life | AlumniSights</title>
        <meta name="description" content="Discover campus organizations and Greek life options" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Clubs & Greek Life
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Explore campus organizations and opportunities to get involved outside the classroom
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Campus Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {orgTypes.map((org, index) => (
                <Card key={index} className="border shadow hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 bg-gray-50 p-4 rounded-full">
                        {org.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{org.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{org.description}</p>
                      <div className="w-full">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">POPULAR EXAMPLES:</h4>
                        <ul className="text-sm">
                          {org.examples.map((example, i) => (
                            <li key={i} className="mb-1">{example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Benefits of Getting Involved</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Leadership Development</h3>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Organization Leaders</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    90% of campus organization leaders report significant improvement in leadership skills
                  </p>

                  <h3 className="text-lg font-medium mb-2">Academic Performance</h3>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Involved Students</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600">
                    65% of involved students report better academic performance due to time management skills
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Career Readiness</h3>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Job Placement</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    75% of employers favor candidates with leadership experience in campus organizations
                  </p>

                  <h3 className="text-lg font-medium mb-2">Alumni Network</h3>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Professional Connections</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600">
                    80% of organization alumni maintain connections that benefit their professional network
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-3">Get insights from alumni about campus life</h2>
            <p className="mb-4">Connect with alumni who participated in various organizations and Greek life</p>
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
