// @ts-nocheck

import { AuthContext } from "@/provider/AuthProvider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const TTIRoute = ({children}) => {
  const { user, loading } = useContext(AuthContext);
  

  if (loading) {
    return <div>loading...</div>;
  }

  // After loading, if user exists, check profile completion and roles
  if (user) {
    if (user.isProfileComplete === false) {
      return <Navigate to="/onboarding" replace />;
    }

    if (user.role === "tti" || user.role === "admin" || user.role === "superAdmin") {
      return children;
    } else {
      // User exists but doesn't have the required roles
      return <Navigate to="/dashboard"></Navigate>;
    }
  } else {
    // No user, redirect to login/home
    return <Navigate to="/"></Navigate>;
  }
};

export default TTIRoute;
