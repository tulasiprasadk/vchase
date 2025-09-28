import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("organizer" | "sponsor" | "admin")[];
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
  redirectTo = "/auth/signin",
}) => {
  const { userProfile, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If specific roles are required
      if (allowedRoles && userProfile) {
        const hasAllowedRole = allowedRoles.includes(userProfile.userType);
        if (!hasAllowedRole) {
          // Redirect to appropriate dashboard based on user type
          const userTypeToDashboard = {
            organizer: "/dashboard/organizer",
            sponsor: "/dashboard/sponsor",
            admin: "/dashboard/admin",
          };
          router.push(
            userTypeToDashboard[userProfile.userType] || "/dashboard"
          );
          return;
        }
      }
    }
  }, [
    loading,
    isAuthenticated,
    userProfile,
    allowedRoles,
    requireAuth,
    router,
    redirectTo,
  ]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if authentication/authorization fails
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (
    allowedRoles &&
    userProfile &&
    !allowedRoles.includes(userProfile.userType)
  ) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
