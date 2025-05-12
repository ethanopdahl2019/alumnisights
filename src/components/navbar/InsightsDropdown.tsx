
import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

// Define and export the insightsItems
export const insightsItems = [
  {
    title: "Undergraduate Admissions",
    href: "/schools/undergraduate-admissions",
    description: "Explore admission requirements for undergraduate programs",
  },
  {
    title: "Graduate Admissions",
    href: "/insights/graduate-admissions",
    description: "Learn about graduate school application processes",
  },
  {
    title: "Industry Insights",
    href: "/insights/industry",
    description: "Discover career trends and industry information",
  },
  {
    title: "Clubs & Greek Life",
    href: "/insights/clubs-and-greek-life",
    description: "Find information about campus organizations",
  },
];

export const InsightsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-navy font-medium hover:text-navy/80 cursor-pointer">
        Insights <ChevronDown className="h-4 w-4 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        {insightsItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild className="py-2">
            <Link to={item.href} className="cursor-pointer flex flex-col">
              <span className="font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground mt-1">{item.description}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
