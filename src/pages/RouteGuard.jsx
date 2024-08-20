import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../providers/AuthProvider";

export default function RouteGuard({ children }) {
  let location = useLocation();
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);
  if (!isAuthenticated) {
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  return children;
}
