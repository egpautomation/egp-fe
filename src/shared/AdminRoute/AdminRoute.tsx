// @ts-nocheck

import { AuthContext } from "@/provider/AuthProvider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({children}) => {
  const { user, loading } = useContext(AuthContext);
  

  if (loading) {
    return <div>loading...</div>;
  }

  if (user) {
    if (user.isProfileComplete === false) {
      return <Navigate to="/onboarding" replace />;
    }

    if (user.role === "admin" || user.role === "superAdmin") {
      return children;
    } else {
      // User is logged in but not admin/superAdmin
      return <Navigate to="/dashboard"></Navigate>;
    }
  } else {
    // No user is logged in
    return <Navigate to="/"></Navigate>;
  }
};

export default AdminRoute;
