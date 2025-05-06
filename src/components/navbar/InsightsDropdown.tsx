
import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

// Define and export the insightsItems
export const insightsItems = [
  {
    title: "Undergraduate Admissions",
    href: "/schools/undergraduate-admissions",
  },
  {
    title: "Graduate Admissions",
    href: "/insights/graduate-admissions",
  },
  {
    title: "Industry Insights",
    href: "/insights/industry",
  },
  {
    title: "Clubs & Greek Life",
    href: "/insights/clubs-and-greek-life",
  },
];

export const InsightsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-navy font-medium hover:text-navy/80 cursor-pointer">
        Insights <ChevronDown className="h-4 w-4 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {insightsItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link to={item.href} className="cursor-pointer">
              {item.title}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
