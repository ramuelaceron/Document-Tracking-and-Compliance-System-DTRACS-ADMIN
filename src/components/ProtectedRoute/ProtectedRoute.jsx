// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser");
    setIsAuthenticated(!!user);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // or null
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;