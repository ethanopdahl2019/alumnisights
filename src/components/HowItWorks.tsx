
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Browse profiles',
    description: 'Explore profiles of current students and alumni from your target schools.'
  },
  {
    number: '02',
    title: 'Choose your conversation',
    description: 'Select a 15-minute chat, 30-minute Q&A, or an in-depth hour-long discussion.'
  },
  {
    number: '03',
    title: 'Book a time',
    description: 'Schedule your conversation at a time that works best for both of you.'
  },
  {
    number: '04',
    title: 'Connect and learn',
    description: 'Gain authentic insights from someone who has been exactly where you want to go.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-gray-50 rounded-xl p-8 h-full">
                <div className="text-3xl font-light text-gray-300 mb-4">{step.number}</div>
                <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight size={24} className="text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="/browse" className="btn-primary">
            Find Your Connection
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
