
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const logoPath = "/lovable-uploads/bdaaf67c-3436-4d56-bf80-25d5b4978254.png";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Dashboard redirection using role column in profiles table
  const goToDashboard = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("user_id", user.id)
          .maybeSingle();
        if (error || !data) {
          navigate("/applicant-dashboard");
          return;
        }
        if (data.role === "alumni") {
          navigate("/alumni-dashboard");
        } else {
          navigate("/applicant-dashboard");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/applicant-dashboard");
      }
    }
  };

  // Insights dropdown items
  const insightsItems = [
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

  return (
    <nav className="py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoPath} alt="AlumniSights Logo" className="h-4" />
        </Link>
        {isMobile ? (
          <>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-navy hover:bg-gray-100 rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 py-4 shadow-md">
                <div className="container-custom flex flex-col space-y-4">
                  <Link 
                    to="/browse" 
                    className="text-navy font-medium py-2 hover:bg-gray-50 px-4 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse
                  </Link>
                  <Link 
                    to="/schools" 
                    className="text-navy font-medium py-2 hover:bg-gray-50 px-4 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Schools
                  </Link>
                  
                  {/* Mobile Insights Dropdown */}
                  <div className="flex flex-col gap-2">
                    <div className="text-navy font-medium py-2 px-4">
                      Insights
                    </div>
                    <div className="pl-4 flex flex-col gap-1">
                      {insightsItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="text-navy py-2 px-4 hover:bg-gray-50 rounded"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {!user ? (
                    <Link 
                      to="/auth" 
                      className="w-full text-center py-2 rounded-full text-white bg-navy hover:bg-navy/90 font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        goToDashboard();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
                      title={user.email}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user.email || "profile"} />
                        <AvatarFallback>{(user.user_metadata?.first_name?.[0] || user.email?.[0] || "U").toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-navy">{user.user_metadata?.first_name || user.email}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/browse" className="text-navy font-medium hover:text-navy/80">
              Browse
            </Link>
            <Link to="/schools" className="text-navy font-medium hover:text-navy/80">
              Schools
            </Link>
            
            {/* Desktop Insights Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-navy font-medium hover:text-navy/80 hover:bg-transparent focus:bg-transparent">Insights</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] md:grid-cols-2">
                      {insightsItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              <div className="text-sm font-medium leading-none">{item.title}</div>
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
            
            {!user ? (
              <Link to="/auth" className="ml-2 px-4 py-2 rounded-full text-white bg-navy hover:bg-navy/90 font-medium transition-colors">
                Sign In
              </Link>
            ) : (
              <button
                onClick={goToDashboard}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                title={user.email}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user.email || "profile"} />
                  <AvatarFallback>{(user.user_metadata?.first_name?.[0] || user.email?.[0] || "U").toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium text-navy">{user.user_metadata?.first_name || user.email}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
