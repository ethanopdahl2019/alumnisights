
import { useEffect, useState } from "react";
import { getSchools } from "@/services/profiles";

const placeholder =
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=facearea&w=400&q=80&facepad=2";

const SchoolImageCarousel = () => {
  const [schools, setSchools] = useState<
    { id: string; name: string; image: string | null }[]
  >([]);

  useEffect(() => {
    (async () => {
      const schoolData = await getSchools();
      setSchools(
        schoolData.map((s) => ({
          id: s.id,
          name: s.name,
          image: s.image || placeholder,
        }))
      );
    })();
  }, []);

  return (
    <div className="py-6">
      <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar px-1">
        {schools.map((school) => (
          <div className="flex flex-col items-center min-w-[100px]" key={school.id}>
            <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border shadow-sm">
              <img
                src={school.image}
                alt={school.name}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="mt-2 text-xs text-gray-700 font-medium text-center whitespace-pre-line">
              {school.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SchoolImageCarousel;
