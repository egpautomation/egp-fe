// @ts-nocheck
import { useEffect, useState } from "react";

const useBankName = (initialBankName, egpMail) => {
  const [bankName, setBankName] = useState(initialBankName || "Loading...");

  useEffect(() => {
    if (!initialBankName && egpMail) {
      const fetchBankName = async () => {
        try {
          const res = await fetch(`https://egpserver.jubairahmad.com/api/v1/egp-listed-company/get-by-mail/${egpMail}`);
          const json = await res.json();
          setBankName(json?.data?.bankName || "NILL");
        } catch (err) {
          console.error("Error fetching bankName:", err);
          setBankName("NILL");
        }
      };
      fetchBankName();
    }
  }, [initialBankName, egpMail]);

  return bankName;
};

export default useBankName;
