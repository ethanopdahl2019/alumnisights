
import TypeWriter from './TypeWriter';
import { Link } from 'react-router-dom';
import SchoolLogoCarousel from './SchoolLogoCarousel';

const schoolExamples = [
  'Harvard economics major',
  'Amherst lacrosse player',
  'Alabama sorority member',
  'Stanford computer science student',
  'Duke basketball player',
  'Berkeley entrepreneur',
  'Yale debate team captain',
  'NYU film student',
  'Michigan engineering major',
  'Georgetown politics student'
];

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center">
      {/* Background video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-6794-large.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      </div>
      
      <div className="container-custom relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 tracking-tight">
            Connect with a <br />
            <TypeWriter words={schoolExamples} typingSpeed={100} deletingSpeed={50} />
          </h1>
          
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Book conversations with current students and alumni to gain authentic, 
            school-specific insights for your college journey.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/browse" className="text-xl font-medium text-blue-600 hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600 transition duration-200">
              Find Your Connection
            </Link>
            <Link to="/auth" className="text-xl font-medium text-green-600 hover:text-green-800 border-b-2 border-transparent hover:border-green-600 transition duration-200">
              Join as Alumni/Student
            </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full relative z-10 mt-auto">
        <div className="container mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-xl font-medium text-gray-700">Partnered with top universities</h2>
          </div>
          <SchoolLogoCarousel />
        </div>
      </div>
    </section>
  );
};

export default Hero;
