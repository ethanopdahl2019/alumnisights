
import * as React from "react";
import { useState } from "react";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-navy text-sm font-medium hover:text-navy/80 px-0"
            onClick={() => setOpen(!open)}
            onPointerEnter={(e) => e.preventDefault()} // Disable hover behavior
            onPointerLeave={(e) => e.preventDefault()} // Disable hover behavior
          >
            Insights
          </NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[220px]">
            <ul className="grid gap-1 p-2 w-full">
              {insightsItems.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      )}
                    >
                      <div className="text-sm font-medium">{item.title}</div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
