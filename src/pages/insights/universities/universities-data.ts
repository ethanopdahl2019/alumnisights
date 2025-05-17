
import { getUniversitiesByLetter as fetchUniversitiesByLetter, getAlphabeticalLetters as fetchAlphabeticalLetters } from "@/services/universities";

// Static data for fallback and initial rendering
const staticUniversitiesByLetter: Record<string, { id: string; name: string; logo?: string }[]> = {
  "A": [
    { id: "amherst-college", name: "Amherst College" },
    { id: "arizona-state-university", name: "Arizona State University" },
    { id: "appalachian-state-university", name: "Appalachian State University" },
    { id: "allegheny-college", name: "Allegheny College" },
    { id: "auburn-university", name: "Auburn University" },
    { id: "american-university", name: "American University" },
  ],
  "B": [
    { id: "ball-state-university", name: "Ball State University" },
    { id: "brown-university", name: "Brown University" },
    { id: "boston-college", name: "Boston College" },
    { id: "boston-university", name: "Boston University" },
  ],
  "C": [
    { id: "carnegie-mellon-university", name: "Carnegie Mellon University" },
    { id: "columbia-university", name: "Columbia University" },
    { id: "cornell-university", name: "Cornell University" },
    { id: "case-western-reserve-university", name: "Case Western Reserve University" },
    { id: "california-institute-of-technology", name: "California Institute of Technology" },
  ],
  "D": [
    { id: "duke-university", name: "Duke University" },
    { id: "dartmouth-college", name: "Dartmouth College" },
  ],
};

const staticAlphabeticalLetters = Object.keys(staticUniversitiesByLetter).sort();

// Export the static universities list for reference
export const universities = Object.values(staticUniversitiesByLetter).flat();

// Function to get universities data by letter - tries DB first, falls back to static data
export async function getUniversitiesByLetter(): Promise<Record<string, { id: string; name: string; logo?: string }[]>> {
  try {
    const data = await fetchUniversitiesByLetter();
    if (Object.keys(data).length > 0) {
      return data;
    }
    return staticUniversitiesByLetter;
  } catch (error) {
    console.error("Error fetching universities by letter:", error);
    return staticUniversitiesByLetter;
  }
}

// Function to get alphabetical letters - tries DB first, falls back to static data
export async function getAlphabeticalLetters(): Promise<string[]> {
  try {
    const data = await fetchAlphabeticalLetters();
    if (data.length > 0) {
      return data;
    }
    return staticAlphabeticalLetters;
  } catch (error) {
    console.error("Error fetching alphabetical letters:", error);
    return staticAlphabeticalLetters;
  }
}
