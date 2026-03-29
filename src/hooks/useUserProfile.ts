// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/provider/AuthProvider";
import axiosInstance from "@/lib/axiosInstance";

const useUserProfile = () => {
  const authContext = useContext(AuthContext) as any;
  const user = authContext?.user;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get("/user/get-single-user", {
          params: { email: user.email },
        });

        if (response?.data?.success) {
          setUserData(response?.data?.data || response?.data?.user || null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [reload, user?.email]);

  return {
    userData,
    loading,
    reload,
    setReload,
  };
};

export default useUserProfile;
