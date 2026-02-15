// @ts-nocheck

import { AuthContext } from "@/provider/AuthProvider";
import { useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LandingLoginBox from "@/components/landing/LandingLoginBox";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const toastId = toast.loading("Logging in...");

    try {
      await login(email, password);

      toast.dismiss(toastId);
      toast.success("Successfully Logged In");
      navigate("/dashboard");
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="min-h-lvh flex justify-center items-center py-10">
      <div className="w-full max-w-md px-4">
        <LandingLoginBox preview={false} onSubmit={handleLogin} />
      </div>
    </section>
  );
};

export default Login;
