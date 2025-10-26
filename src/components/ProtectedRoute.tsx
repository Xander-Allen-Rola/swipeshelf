import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, setUser, loading } = useAuth();
  const location = useLocation();

  // Refresh user from localStorage on every route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setUser({ id: userId, token });
    } else {
      setUser(null);
    }
  }, [location.pathname, setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
