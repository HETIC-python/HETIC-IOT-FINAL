import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  role?: string;
}

export function PrivateRoute({ children, role }: PrivateRouteProps) {
  // const { isAuthenticated, user } = useAuth();
  const isAuthenticated = true; // Replace with actual authentication logic
  const user = { role: "admin" }; // Replace with actual user data

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
