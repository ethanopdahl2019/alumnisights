
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

// Template for generating university overview
const OVERVIEW_TEMPLATE = 
`Write a comprehensive overview for {{universityName}}. Include information about:
- Brief history and founding
- Location and campus
- Academic reputation
- Notable aspects or distinctions
- Size and student body characteristics
- General atmosphere and culture`;

// Template for generating admission statistics
const ADMISSION_STATS_TEMPLATE = 
`Create a detailed section about admission statistics for {{universityName}} covering:
- Acceptance rate ranges
- Average test scores (SAT/ACT) ranges
- Average GPA expectations
- Application volume statistics
- Early decision/action statistics (if applicable)
- Competitiveness of admissions
- Recent admission trends`;

// Template for generating application requirements
const APPLICATION_REQUIREMENTS_TEMPLATE = 
`List and explain the application requirements for {{universityName}} including:
- Required application materials
- Essay requirements and prompts
- Recommendation letter requirements
- Interview information
- Application deadlines
- Required standardized tests
- Application fee information
- Special requirements for specific programs`;

// Template for generating alumni insights
const ALUMNI_INSIGHTS_TEMPLATE = 
`Create a section with alumni insights for {{universityName}} covering:
- Quotes or perspectives from alumni
- Notable career outcomes
- Value of the university's network
- Common experiences shared by alumni
- How the university prepared them for careers
- Alumni community engagement and support`;

/**
 * Generates a content prompt based on a template and university name
 */
function generatePrompt(template: string, universityName: string): string {
  return template.replace('{{universityName}}', universityName);
}

/**
 * Handles sending a request to the OpenAI API through our Supabase Edge Function
 */
async function generateContentWithAI(prompt: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-university-content', {
      body: { prompt }
    });
    
    if (error) {
      console.error("AI generation error:", error);
      return null;
    }
    
    return data.generatedText;
  } catch (error) {
    console.error("Error calling AI service:", error);
    return null;
  }
}

export interface GeneratedUniversityContent {
  overview?: string;
  admissionStats?: string;
  applicationRequirements?: string;
  alumniInsights?: string;
}

/**
 * Generates university content sections using AI
 */
export async function generateUniversityContent(
  universityName: string,
  sections: Array<'overview' | 'admissionStats' | 'applicationRequirements' | 'alumniInsights'>
): Promise<GeneratedUniversityContent> {
  const content: GeneratedUniversityContent = {};
  
  const generateSection = async (section: string, template: string) => {
    toast.info(`Generating ${section} for ${universityName}...`);
    const prompt = generatePrompt(template, universityName);
    const generatedContent = await generateContentWithAI(prompt);
    return generatedContent;
  };
  
  try {
    const tasks = [];
    
    if (sections.includes('overview')) {
      tasks.push(
        generateSection('overview', OVERVIEW_TEMPLATE).then(result => {
          content.overview = result || '';
        })
      );
    }
    
    if (sections.includes('admissionStats')) {
      tasks.push(
        generateSection('admissionStats', ADMISSION_STATS_TEMPLATE).then(result => {
          content.admissionStats = result || '';
        })
      );
    }
    
    if (sections.includes('applicationRequirements')) {
      tasks.push(
        generateSection('applicationRequirements', APPLICATION_REQUIREMENTS_TEMPLATE).then(result => {
          content.applicationRequirements = result || '';
        })
      );
    }
    
    if (sections.includes('alumniInsights')) {
      tasks.push(
        generateSection('alumniInsights', ALUMNI_INSIGHTS_TEMPLATE).then(result => {
          content.alumniInsights = result || '';
        })
      );
    }
    
    await Promise.all(tasks);
    return content;
  } catch (error) {
    console.error('Error generating university content:', error);
    toast.error('Failed to generate university content');
    return {};
  }
}

/**
 * Saves generated content to the database
 */
export async function saveGeneratedContent(
  id: string,
  name: string,
  content: GeneratedUniversityContent
): Promise<boolean> {
  try {
    await saveUniversityContent(id, {
      name,
      ...content,
    });
    
    toast.success(`Content for ${name} saved successfully`);
    return true;
  } catch (error) {
    console.error('Error saving content:', error);
    toast.error(`Failed to save content for ${name}`);
    return false;
  }
}

// Re-export the saveUniversityContent function from the university-content file
import { saveUniversityContent } from '@/services/landing-page';
