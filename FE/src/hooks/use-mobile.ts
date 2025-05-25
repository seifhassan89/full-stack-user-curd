import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Function to check if screen width is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };
    
    // Check on initial load
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return isMobile;
}