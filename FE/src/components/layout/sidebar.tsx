import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { UserAvatar } from "./user-avatar";
import { useAuthStore } from "@/store/auth-store";
import { 
  Home,
  Users,
  X
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ className, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuthStore();
  
  // Close sidebar on location change for mobile
  useEffect(() => {
    if (location && isMobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  }, [location, isMobileOpen, onCloseMobile]);
  
  const handleCloseSidebar = useCallback(() => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  }, [onCloseMobile]);
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Users", href: "/users", icon: Users },
  ];
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground shadow-lg transform transition-transform duration-300 ease-in-out",
          "md:translate-x-0 md:relative md:z-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-accent">
            <span className="text-xl font-bold text-white">Admin Portal</span>
            {/* Close button on mobile */}
            {isMobileOpen && (
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleCloseSidebar}
                className="md:hidden text-white hover:bg-sidebar-accent"
              >
                <X size={20} />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
          </div>
          
          {/* Navigation links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={handleCloseSidebar}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive(item.href)
                      ? "bg-sidebar-accent text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* User profile */}
          <div className="p-4 border-t border-sidebar-accent">
            {user && (
              <div className="flex items-center">
                <UserAvatar 
                  name={user.name || "User"} 
                  size="sm"
                />
                <div className="ml-3 truncate">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-300">
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}