
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';

const stories = [
  {
    name: "Olivia Johnson",
    from: "First-generation college student from Ohio",
    to: "Harvard University, Class of 2025",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    story: "As a first-generation college student from a small town in Ohio, I had no idea where to even begin with my college applications. My high school counselor was helpful but overwhelmed with hundreds of other students. Connecting with Sarah, a current Harvard student through AlumniSights, completely changed my trajectory. She helped me understand what Harvard was really looking for, how to highlight my unique experiences, and gave me honest feedback on my essays. I truly don't think I would have been accepted without her guidance.",
    quote: "Having someone who had been through exactly what I was going through made all the difference."
  },
  {
    name: "Marcus Chen",
    from: "Struggling to choose between multiple programs",
    to: "Stanford University, School of Engineering",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    story: "I was fortunate enough to be accepted to several top engineering programs, but this created a new problem - how to choose between them? Rankings only tell you so much, and campus visits weren't enough to understand what daily life would actually be like. Through AlumniSights, I connected with engineering students at each of my top choices. These conversations revealed aspects of the programs I never would have discovered otherwise - from research opportunities to department culture to job placement. I ultimately chose Stanford because my mentor helped me see how it aligned with both my academic interests and personal preferences.",
    quote: "The insider perspective from current students helped me make a confident decision I haven't regretted for a moment."
  },
  {
    name: "Aisha Patel",
    from: "International student unsure about US admissions",
    to: "UC Berkeley, Class of 2024",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    story: "Applying to US universities as an international student was overwhelming. I had so many questions about standardized testing, financial aid for international students, and how to make my application stand out. Through AlumniSights, I connected with two Berkeley alumni who had also been international students. They walked me through every step of the process, helped me understand the unwritten cultural aspects of US applications, and gave me honest advice about financing my education. Their guidance was invaluable in helping me present my unique perspective and secure admission to my dream school.",
    quote: "Having mentors who understood both my culture and the American university system was exactly what I needed."
  }
];

const SuccessStories = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Success Stories</h1>
          
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto text-center">
            Real stories from students who found their path with the help of AlumniSights mentors.
            These connections made all the difference in their educational journeys.
          </p>
          
          <div className="space-y-16 mb-16">
            {stories.map((story, index) => (
              <Card key={index} className="overflow-hidden border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 bg-gray-100 flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full overflow-hidden mb-4">
                        <img 
                          src={story.image} 
                          alt={story.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-xl mb-1">{story.name}</h3>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">{story.from}</p>
                        <p className="text-sm font-medium text-blue-600">→</p>
                        <p className="text-sm font-medium">{story.to}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8 md:col-span-2">
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {story.story}
                    </p>
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
                      "{story.quote}"
                    </blockquote>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Join the Community Section */}
          <div className="bg-gray-50 rounded-lg p-8 text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Create Your Own Success Story</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Whether you're just starting your college journey or looking for guidance on your next educational step,
              our mentors are ready to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/browse">Find Your Mentor</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/become-mentor">Become a Mentor</Link>
              </Button>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
              <p className="text-gray-700">of students feel more confident in their applications after mentorship</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
              <p className="text-gray-700">of mentees were accepted to at least one of their top three school choices</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <p className="text-gray-700">report making a more confident school decision after alumni conversations</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SuccessStories;
