// @ts-nocheck

import { AuthContext } from "@/provider/AuthProvider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({children}) => {
  const { user, loading } = useContext(AuthContext);
  

  if (loading) {
    return <div>loading...</div>;
  }
  if (user && user.role === "admin") {
    return children;
  }
  if (user) {
    return <Navigate to="/dashboard"></Navigate>;
  } else {
    return <Navigate to="/"></Navigate>;
  }
};

export default AdminRoute;
