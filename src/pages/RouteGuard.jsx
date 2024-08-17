import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RouteGuard({ children, isAuthenticated }) {
  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
