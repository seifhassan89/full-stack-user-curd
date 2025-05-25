import { Button } from "@/components/ui/button";
import { Bell, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  className?: string;
  onMenuToggle?: () => void;
}

export function Header({ className, onMenuToggle }: HeaderProps) {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  
  return (
    <header className={cn(
      "sticky top-0 z-10 h-16 bg-white shadow flex items-center justify-between px-4",
      className
    )}>
      <div className="flex items-center">
        {/* Mobile menu toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuToggle}
          className="mr-2 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {/* Site title - visible on mobile only */}
        <div className="md:hidden">
          <span className="text-lg font-bold">Admin Portal</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification bell */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-1 rounded-full text-gray-400 hover:text-gray-500"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>
        
        {/* User profile */}
        <div className="flex items-center">
          <UserAvatar 
            name={user?.name || "User"} 
            size="sm"
            className="hidden md:block"
          />
          <div className="ml-2 hidden md:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
            </p>
          </div>
        </div>
        
        {/* Logout button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}