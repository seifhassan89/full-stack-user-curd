import { PageLoading } from "@/components/ui/page-loading";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

// Import pages
import { useAuthStore } from "@/store/auth-store";

function ProtectedRoute({
  component: Component,
}: Readonly<{
  component: React.ComponentType;
}>) {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication and redirect if needed
    const checkAuth = () => {
      if (!isAuthenticated) {
        navigate("/login");
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, navigate]);

  if (isChecking) {
    return <PageLoading message="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Component />;
}

export default ProtectedRoute;
