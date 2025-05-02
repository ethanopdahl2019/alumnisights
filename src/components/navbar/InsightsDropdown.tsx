import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// your items
export const insightsItems = [
  { title: "Undergraduate Admissions", href: "/insights/undergraduate-admissions", description: "Learn about undergraduate admission processes and strategies" },
  { title: "Graduate Admissions",     href: "/insights/graduate-admissions",    description: "Explore graduate school application insights and tips" },
  { title: "Industry Insights",       href: "/insights/industry-insights",     description: "Discover trends and opportunities across various industries" },
  { title: "Clubs & Greek Life",      href: "/insights/clubs-and-greek-life",   description: "Find information about campus organizations and Greek life" },
];

export const InsightsDropdown: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {/* 1) Bigger trigger text */}
          <NavigationMenuTrigger className="px-4 py-2 text-base font-medium">
            Insights
          </NavigationMenuTrigger>

          {/* 2) Attach our custom “roll-down” CSS animation */}
          <NavigationMenuContent className="origin-top-center">
            <ul className="grid grid-cols-1 gap-3 p-4 w-[250px]">
              {insightsItems.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md px-4 py-2 text-base font-medium no-underline outline-none transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground"
                      )}
                    >
                      <div className="leading-none">{item.title}</div>
                      <p className="line-clamp-2 leading-snug text-muted-foreground">
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
