// @ts-nocheck
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthProvider from "./provider/AuthProvider";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import  { Toaster } from 'react-hot-toast';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </StrictMode>
); 
