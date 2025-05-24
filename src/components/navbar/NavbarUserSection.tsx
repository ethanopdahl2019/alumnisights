
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
      navigate('/my-account');
    }
  };

  const goToAccount = () => {
    navigate('/my-account');
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
      <Link to="/auth" className="ml-2 px-4 py-2 rounded-full text-white bg-navy hover:bg-navy/90 font-medium transition-colors">
        Sign In
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
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
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={goToAccount}>
          <User className="mr-2 h-4 w-4" />
          View Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={goToDashboard}>
          Dashboard
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')} className="text-blue-600 flex items-center">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Admin Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/student-dashboard')}>
              Student Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/mentor-dashboard')}>
              Mentor Dashboard
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
