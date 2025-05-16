
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UniversityHeader from "@/pages/insights/universities/components/UniversityHeader";
import UniversityContent from "@/pages/insights/universities/components/UniversityContent";
import UniversityNotFound from "@/pages/insights/universities/components/UniversityNotFound";
import { universities } from "@/pages/insights/universities/university-data";
import ImageGallery from "@/components/ImageGallery";
import { getImagesByCategory } from "@/data/images";
import { motion } from "framer-motion";

const UniversityAdmissions = () => {
  const { id } = useParams<{ id: string }>();
  const university = id ? universities[id] : null;
  const campusImages = getImagesByCategory('campus', 3);
  const studentImages = getImagesByCategory('students', 2);

  if (!university) {
    return <UniversityNotFound />;
  }

  return (
    <div className="min-h-screen bg-soft-beige">
      <Helmet>
        <title>{university.title} | AlumniSights</title>
        <meta name="description" content={`Learn how to get admitted to ${university.name}`} />
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <UniversityHeader title={university.title} />
          
          {/* Featured Campus Image */}
          {campusImages.length > 0 && (
            <motion.div 
              className="mb-8 rounded-lg overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src={campusImages[0].src} 
                alt={university.name} 
                className="w-full h-64 object-cover"
              />
              <div className="bg-white p-3 text-center">
                <p className="text-sm text-gray-600 font-sans">{campusImages[0].caption || university.name} Campus</p>
              </div>
            </motion.div>
          )}
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <UniversityContent 
                content={university.content}
                image={university.image}
                name={university.name}
              />
              
              {/* Student Life Images */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h3 className="text-2xl font-alice mb-4">Student Life</h3>
                <ImageGallery 
                  images={studentImages} 
                  columns={2}
                  height="h-48"
                />
              </motion.div>
            </div>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Quick Facts */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-alice mb-4">Quick Facts</h3>
                <ul className="space-y-3 font-sans">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Acceptance Rate</span>
                    <span className="font-medium">5.2%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Student-Faculty Ratio</span>
                    <span className="font-medium">6:1</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Undergraduate Enrollment</span>
                    <span className="font-medium">6,788</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Financial Aid Recipients</span>
                    <span className="font-medium">55%</span>
                  </li>
                </ul>
              </div>
              
              {/* Campus Views */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-alice mb-4">Campus Views</h3>
                <div className="space-y-4">
                  {campusImages.slice(1).map((image, i) => (
                    <div key={i} className="overflow-hidden rounded-md">
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="w-full h-32 object-cover"
                      />
                      {image.caption && (
                        <p className="text-xs text-gray-500 mt-1 font-sans">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Connect CTA */}
              <div className="bg-navy/5 p-6 rounded-lg">
                <h3 className="text-xl font-alice mb-3">Connect with Students</h3>
                <p className="text-sm text-gray-700 mb-4 font-sans">
                  Get firsthand insights about {university.name} from current students and recent graduates.
                </p>
                <a 
                  href="/browse" 
                  className="text-navy font-medium text-sm border-b border-navy font-sans"
                >
                  Find a Mentor
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversityAdmissions;
