// @ts-nocheck

import { useContext, useEffect, useState } from "react";
import Login from "./pages/homeLayout/Login";
import { AuthContext } from "./provider/AuthProvider";
import { Navigate } from "react-router-dom";

function App() {
  const { user, loading } = useContext(AuthContext);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
  }, [user]);
  if (loading || !authChecked) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/dashboard" replace /> : <Login />;
}

export default App;
