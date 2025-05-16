
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ShieldAlert, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isMentor, isStudent } from "@/services/auth";

export const NavbarUserSection = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const goToDashboard = () => {
    if (!user) return;
    
    if (isMentor(user)) {
      navigate('/mentor-dashboard');
    } else if (isStudent(user)) {
      navigate('/student-dashboard');
    } else if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      // Default fallback
      navigate('/account');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <Link to="/auth" className="text-sm font-medium text-navy hover:text-navy/80 transition-colors">
        Sign In
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
          title={user.email}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user.email || "profile"} />
            <AvatarFallback>{(user.user_metadata?.first_name?.[0] || user.email?.[0] || "U").toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium text-navy">{user.user_metadata?.first_name || user.email}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-serif">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/account')} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span className="font-sans text-sm">View Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={goToDashboard} className="cursor-pointer">
          <span className="font-sans text-sm">Dashboard</span>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')} className="text-blue-600 flex items-center cursor-pointer">
              <ShieldAlert className="mr-2 h-4 w-4" />
              <span className="font-sans text-sm">Admin Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/student-dashboard')} className="cursor-pointer">
              <span className="font-sans text-sm">Student Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/mentor-dashboard')} className="cursor-pointer">
              <span className="font-sans text-sm">Mentor Dashboard</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <span className="font-sans text-sm">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
