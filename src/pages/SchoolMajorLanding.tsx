
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getImagesByCategory, getRandomImages, ImageData } from "@/data/images";
import { motion } from "framer-motion";

const SchoolMajorLanding = () => {
  const { schoolId, majorId } = useParams();
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [school, setSchool] = useState<any>(null);
  const [major, setMajor] = useState<any>(null);
  const [campusImages, setCampusImages] = useState<ImageData[]>([]);
  const [academicImages, setAcademicImages] = useState<ImageData[]>([]);

  useEffect(() => {
    // Get some images for the page
    setCampusImages(getImagesByCategory('campus', 3));
    setAcademicImages(getImagesByCategory('academic', 3));
  }, []);

  useEffect(() => {
    if (!schoolId || !majorId) return;
    const fetchData = async () => {
      const { data: paraData } = await supabase
        .from("school_major_paragraphs")
        .select("*")
        .eq("school_id", schoolId)
        .eq("major_id", majorId);
      setParagraphs((paraData || []).map((p: any) => p.paragraph));

      const { data: schoolData } = await supabase
        .from("schools")
        .select("*")
        .eq("id", schoolId)
        .maybeSingle();
      setSchool(schoolData);

      const { data: majorData } = await supabase
        .from("majors")
        .select("*")
        .eq("id", majorId)
        .maybeSingle();
      setMajor(majorData);
    };
    fetchData();
  }, [schoolId, majorId]);

  return (
    <div className="bg-soft-beige min-h-screen">
      <Navbar />
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-3xl font-alice font-medium mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {school?.name} &middot; {major?.name}
          </motion.h1>
          
          {/* Featured Image */}
          {campusImages.length > 0 && (
            <div className="mb-10">
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <motion.img
                  src={campusImages[0].src} 
                  alt={campusImages[0].alt}
                  className="w-full h-64 object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                />
                <div className="absolute bottom-0 w-full bg-black/30 p-4 backdrop-blur-sm">
                  <p className="text-white font-sans text-sm">
                    {campusImages[0].caption}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {paragraphs.length === 0 ? (
                <p className="text-lg font-sans text-gray-700">
                  No insights about this school/major yet.
                </p>
              ) : (
                paragraphs.map((p, i) => (
                  <motion.div 
                    key={i} 
                    className="bg-white p-6 rounded-lg border border-gray-100 font-sans"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {p}
                  </motion.div>
                ))
              )}
              
              {/* Additional Academic Images */}
              <div className="mt-8">
                <h3 className="font-alice text-xl mb-4">Academic Life</h3>
                <div className="grid grid-cols-2 gap-4">
                  {academicImages.map((image, index) => (
                    <motion.div 
                      key={image.id} 
                      className="profile-image"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    >
                      <img src={image.src} alt={image.alt} className="w-full h-40 object-cover rounded-lg" />
                      <p className="image-caption">{image.caption}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* School Information */}
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="font-alice text-xl mb-3">School Information</h3>
                <ul className="space-y-2 font-sans">
                  {school?.location && (
                    <li className="text-sm">
                      <span className="font-medium">Location:</span> {school.location}
                    </li>
                  )}
                  {school?.founded_year && (
                    <li className="text-sm">
                      <span className="font-medium">Founded:</span> {school.founded_year}
                    </li>
                  )}
                  {school?.student_population && (
                    <li className="text-sm">
                      <span className="font-medium">Students:</span> {school.student_population.toLocaleString()}
                    </li>
                  )}
                  {school?.acceptance_rate && (
                    <li className="text-sm">
                      <span className="font-medium">Acceptance Rate:</span> {(school.acceptance_rate * 100).toFixed(1)}%
                    </li>
                  )}
                </ul>
              </motion.div>
              
              {/* Campus Images */}
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="font-alice text-xl mb-3">Campus Views</h3>
                <div className="space-y-3">
                  {campusImages.slice(1).map((image, index) => (
                    <div key={image.id} className="profile-image">
                      <img src={image.src} alt={image.alt} className="w-full h-32 object-cover rounded-lg" />
                      <p className="image-caption text-xs">{image.caption}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Related Majors CTA */}
              <motion.div 
                className="bg-navy/5 p-6 rounded-lg border border-navy/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="font-alice text-lg mb-3">Explore More</h3>
                <p className="font-sans text-sm mb-4">
                  Connect with students and alumni to learn more about {major?.name} at {school?.name}.
                </p>
                <a href="/browse" className="text-navy font-medium text-sm border-b border-navy font-sans">
                  Find your mentor
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SchoolMajorLanding;
