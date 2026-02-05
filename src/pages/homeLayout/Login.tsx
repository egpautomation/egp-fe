// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/provider/AuthProvider";
import { Label } from "@radix-ui/react-label";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");

    try {
      await login(formData.email, formData.password);

      toast.dismiss(toastId);
      toast.success("Successfully Logged In");
      navigate("/dashboard");

      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    }
  };
  return (
    <section className="min-h-lvh">
      <h1 className="text-3xl font-bold text-center my-5">Login</h1>
      <div className=" flex justify-center items-center">
        <div className="w-full max-w-full sm:max-w-md md:max-w-lg shadow-2xl p-4 md:p-6 lg:p-8 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 gap-5"
          >
            <div className="">
              <Label htmlFor="Email">Email</Label>
              <Input
                type="text"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                placeholder="Your Email Address"
                className="mt-2"
              />
            </div>
            <div className="">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  placeholder="Use A strong Password"
                  className="mt-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="col-span-full">
              <Button type="submit" className="w-full cursor-pointer">
                Submit
              </Button>
            </div>
          </form>
          <p className="mt-4 text-sm">
            Don't Have account?{" "}
            <Link className="underline" to={"/registration"}>
              Registration
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
