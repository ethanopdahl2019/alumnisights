
import { motion } from 'framer-motion';
import TypeWriter from './TypeWriter';

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
    <section className="relative min-h-[80vh] flex items-center">
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
      
      <div className="container-custom relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Connect with a <br />
            <TypeWriter words={schoolExamples} typingSpeed={100} deletingSpeed={50} />
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Book conversations with current students and alumni to gain authentic, 
            school-specific insights for your college journey and application process.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.a 
              href="/browse" 
              className="btn-primary min-w-[180px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Your Connection
            </motion.a>
            <motion.a 
              href="/sign-up" 
              className="btn-secondary min-w-[180px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join as Alumni/Student
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
