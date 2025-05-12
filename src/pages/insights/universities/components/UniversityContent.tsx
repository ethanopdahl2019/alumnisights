
import React from "react";

interface UniversityContentProps {
  content: string[];
  image?: string;
  name: string;
}

const UniversityContent: React.FC<UniversityContentProps> = ({ content, image, name }) => {
  return (
    <div className="prose prose-lg max-w-none">
      {image && (
        <div className="mb-8 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <p className="text-lg text-gray-700 mb-4">
              {content[0]}
            </p>
          </div>
          <div className="md:w-2/3">
            <img 
              src={image} 
              alt={name} 
              className="rounded-lg w-full h-auto shadow-md"
            />
          </div>
        </div>
      )}
      
      {content.slice(image ? 1 : 0).map((paragraph, index) => (
        <p key={index} className="mb-4 text-gray-700">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default UniversityContent;
