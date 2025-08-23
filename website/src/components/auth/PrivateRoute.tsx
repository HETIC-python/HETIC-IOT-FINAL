import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SERVER_API_URL } from "../../utils/api";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthorized(false);
        setIsVerifying(false);
        return;
      }

      if (!requiredRole) {
        setIsAuthorized(true);
        setIsVerifying(false);
        return;
      }

      try {
        setIsVerifying(true);

        if (requiredRole === "admin") {
          const response = await fetch(`${SERVER_API_URL}/api/users/admin`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setIsAuthorized(true);
          } else if (response.status === 401) {
            localStorage.removeItem("token");
            setIsAuthorized(false);
          } else {
            setIsAuthorized(false);
          }
        }
      } catch (error) {
        console.error("Error verifying access:", error);
        setIsAuthorized(false);
        if (error instanceof Response && error.status === 401) {
          localStorage.removeItem("token");
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAccess();
  }, [requiredRole]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!localStorage.getItem("token") || !isAuthorized) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
