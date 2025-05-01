
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const insightsItems = [
  {
    title: "Undergraduate Admissions",
    href: "/insights/undergraduate-admissions",
    description: "Learn about undergraduate admission processes and strategies",
  },
  {
    title: "Graduate Admissions",
    href: "/insights/graduate-admissions",
    description: "Explore graduate school application insights and tips",
  },
  {
    title: "Industry Insights",
    href: "/insights/industry",
    description: "Discover trends and opportunities across various industries",
  },
  {
    title: "Clubs & Greek Life",
    href: "/insights/clubs-and-greek-life",
    description: "Find information about campus organizations and Greek life",
  },
];

export const InsightsDropdown = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
-         <NavigationMenuTrigger className="bg-transparent text-navy font-medium hover:text-navy/80 hover:bg-transparent focus:bg-transparent">
+         <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium">
            Insights
          </NavigationMenuTrigger>
          <NavigationMenuContent>
-           <ul className="grid gap-3 p-4 w-[400px] md:grid-cols-2">
+           <ul className="grid grid-cols-1 gap-3 p-4 w-[250px]">
              {insightsItems.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">
                        {item.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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