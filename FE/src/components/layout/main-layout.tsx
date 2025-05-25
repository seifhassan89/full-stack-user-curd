import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "wouter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  
  // Close sidebar when location changes or switching to desktop
  useEffect(() => {
    if (location || !isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);
  
  // Toggle sidebar visibility
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => !prevState);
  }, []);
  
  // Close the sidebar
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);
  
  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobile, sidebarOpen]);
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={sidebarOpen} 
        onCloseMobile={closeSidebar} 
      />
      
      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header - both mobile and desktop */}
        <Header 
          onMenuToggle={toggleSidebar}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="page-container pt-4 md:pt-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}