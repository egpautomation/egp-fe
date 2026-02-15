// @ts-nocheck
// "/" root route – EGP-style landing page for all users.

import { useContext } from "react";
import { AuthContext } from "./provider/AuthProvider";
import LandingPage from "./pages/homeLayout/LandingPage";

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <></>;
  }

  return <LandingPage />;
}

export default App;
