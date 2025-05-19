
import { getUniversitiesByLetter as fetchUniversitiesByLetter, getAlphabeticalLetters as fetchAlphabeticalLetters, University } from "@/services/universities";
import { getUniversityLogo } from "@/services/landing-page";

// Types for university data
export interface UniversityData {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  state?: string;
  type?: string;
  hasContent?: boolean;
  image?: string;
}

// Static data for fallback during loading states
const staticAlphabeticalLetters = ['A', 'B', 'C', 'D'];
const staticUniversities: UniversityData[] = [
  { id: "amherst-college", name: "Amherst College" },
  { id: "brown-university", name: "Brown University" },
  { id: "carnegie-mellon-university", name: "Carnegie Mellon University" },
  { id: "dartmouth-college", name: "Dartmouth College" },
];

// Function to get universities data by letter - tries DB first, falls back to loading state
export async function getUniversitiesByLetter(): Promise<Record<string, UniversityData[]>> {
  try {
    const data = await fetchUniversitiesByLetter();
    if (Object.keys(data).length > 0) {
      // Convert from University type to UniversityData type
      const convertedData: Record<string, UniversityData[]> = {};
      
      // Process each letter
      for (const letter in data) {
        convertedData[letter] = await Promise.all(data[letter].map(async (uni) => {
          // Try to get logo for this university
          const logo = await getUniversityLogo(uni.id);
          
          return {
            id: uni.id,
            name: uni.name,
            state: uni.state || undefined,
            type: uni.type || undefined,
            // Remove the reference to uni.description since it doesn't exist
            logo: logo || undefined,
            hasContent: !!logo // If we have a logo, likely there's content
          };
        }));
      }
      
      return convertedData;
    }
    
    // Return empty object while loading
    return {};
  } catch (error) {
    console.error("Error fetching universities by letter:", error);
    return {};
  }
}

// Function to get alphabetical letters - tries DB first, falls back to static data
export async function getAlphabeticalLetters(): Promise<string[]> {
  try {
    const letters = await fetchAlphabeticalLetters();
    if (letters.length > 0) {
      return letters;
    }
    return staticAlphabeticalLetters;
  } catch (error) {
    console.error("Error fetching alphabetical letters:", error);
    return staticAlphabeticalLetters;
  }
}

// Function to get all universities as a flat list
export async function getAllUniversities(): Promise<UniversityData[]> {
  try {
    const universitiesByLetter = await getUniversitiesByLetter();
    return Object.values(universitiesByLetter).flat();
  } catch (error) {
    console.error("Error fetching all universities:", error);
    return staticUniversities;
  }
}
