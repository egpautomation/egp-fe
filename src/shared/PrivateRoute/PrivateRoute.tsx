// @ts-nocheck

import { AuthContext } from "@/provider/AuthProvider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Loader from "@/components/ui/loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" color="#000000" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/"></Navigate>;
  }

  // If user is logged in but hasn't completed their Google onboarding profile
  if (user.isProfileComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
 
};

export default PrivateRoute;
