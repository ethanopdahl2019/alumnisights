
import { getUniversitiesByLetter as fetchUniversitiesByLetter, getAlphabeticalLetters as fetchAlphabeticalLetters, University } from "@/services/universities";

// Types for university data
export interface UniversityData {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  state?: string;
  type?: string;
  hasContent?: boolean;
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
      Object.keys(data).forEach(letter => {
        convertedData[letter] = data[letter].map(uni => ({
          id: uni.id,
          name: uni.name,
          state: uni.state || undefined,
          type: uni.type || undefined,
          description: uni.type || undefined,
          hasContent: false // Default to false for now
        }));
      });
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
