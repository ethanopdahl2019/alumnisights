
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UniversityContentProps {
  content: string[];
  image?: string;
  name: string;
  didYouKnow?: string | null;
}

const UniversityContent: React.FC<UniversityContentProps> = ({ content, image, name, didYouKnow }) => {
  // Calculate where to insert the "Did You Know" section
  // We'll aim for roughly the middle of the content
  const contentWithoutFirstParagraph = image ? content.slice(1) : content;
  const middleIndex = Math.floor(contentWithoutFirstParagraph.length / 2);
  
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
      
      {/* First part of content */}
      {contentWithoutFirstParagraph.slice(0, middleIndex).map((paragraph, index) => (
        <p key={`first-${index}`} className="mb-4 text-gray-700">
          {paragraph}
        </p>
      ))}
      
      {/* Did You Know section in the middle */}
      {didYouKnow && (
        <div className="my-6 bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-purple-800 mb-3">Did You Know?</h3>
          <p className="text-sm text-purple-900">{didYouKnow}</p>
        </div>
      )}
      
      {/* Second part of content */}
      {contentWithoutFirstParagraph.slice(middleIndex).map((paragraph, index) => (
        <p key={`second-${index}`} className="mb-4 text-gray-700">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default UniversityContent;
