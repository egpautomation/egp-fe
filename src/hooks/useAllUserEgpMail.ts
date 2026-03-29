// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useAllUserEgpMail = (userEmail) => {
  const [userMail, setUserMail] = useState([]);
  const [mailCount, setMailCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // Fetching from the master list (egp-listed-company) which has the fresh data.
        // We fetch a large batch (limit=2000) to ensure we find the user's records even if not indexed properly for search.
        const url = `${config.apiBaseUrl}/egp-listed-company?limit=2000`;
        const response = await fetch(url);
        const data = await response.json();

        // Client-side filtering removed as per user request to allow everyone to see all mails
        // const myMails = data.data.filter(item => item.userMail === userEmail);

        setUserMail(data.data);
        setMailCount(data.data.length);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    if (userEmail) {
      result();
    }
  }, [reload, userEmail]);

  return {
    userMail,
    setUserMail,
    mailCount,
    setMailCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllUserEgpMail;
