
import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export const InsightsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-navy font-medium hover:text-navy/80 cursor-pointer">
        Insights <ChevronDown className="h-4 w-4 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem asChild>
          <Link to="/schools/undergraduate-admissions" className="cursor-pointer">
            Undergraduate Admissions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/insights/graduate-admissions" className="cursor-pointer">
            Graduate Admissions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/insights/industry" className="cursor-pointer">
            Industry Insights
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/insights/clubs-and-greek-life" className="cursor-pointer">
            Clubs & Greek Life
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
