// ...existing code...
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken { // ✅ NEW: define the decoded token interface
  exp: number;
  [key: string]: any;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, setUser, loading } = useAuth();
  const location = useLocation();

  // Refresh user from localStorage on every route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log("Decoded token:", decoded);
        if (decoded.exp) {
          const expiryTime = decoded.exp * 1000; // ✅ convert exp to ms
          console.log("Token expires at:", new Date(expiryTime).toLocaleString());

          // ✅ NEW: check if expired
          if (Date.now() >= expiryTime) {
            console.warn("Token expired — clearing storages and logging out.");
            localStorage.clear(); // ✅ NEW: clear localStorage
            sessionStorage.clear(); // ✅ NEW: clear sessionStorage
            setUser(null); // ✅ NEW: reset user
            return; // ✅ NEW: stop further execution
          }
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
        localStorage.clear(); // ✅ clear on decode error
        sessionStorage.clear();
        setUser(null);
        return;
      }
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
