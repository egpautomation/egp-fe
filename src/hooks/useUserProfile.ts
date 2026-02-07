// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useUserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const url = `${config.apiBaseUrl}/user/get-single-user`;
                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();

                if (result?.success) {
                    setUserData(result?.user || null);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [reload]);

    return {
        userData,
        loading,
        reload,
        setReload,
    };
};

export default useUserProfile;
