// @ts-nocheck
// "/" root route – EGP-style landing page for all users.

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./provider/AuthProvider";
import LandingPage from "./pages/homeLayout/LandingPage";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <></>;
  }

  // Redirect logged-in users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

export default App;
