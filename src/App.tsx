// @ts-nocheck
// "/" root route – EGP-style landing page. Logged-in users redirect to dashboard. Login at /login.

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./provider/AuthProvider";
import { Navigate } from "react-router-dom";
import LandingPage from "./pages/homeLayout/LandingPage";

function App() {
  const { user, loading } = useContext(AuthContext);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
  }, [user]);
  if (loading || !authChecked) {
    return <></>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

export default App;
