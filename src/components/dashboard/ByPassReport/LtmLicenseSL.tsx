// @ts-nocheck

import useSingleData from "@/hooks/useSingleData";
import { config } from "@/lib/config";

const LtmLicenseSL = ({ data }) => {
  const egpMail = data?.egpMail;
  const field = data?.LtmLicenseNameCode;
  const url = config.apiBaseUrl
    ? `${config.apiBaseUrl}/jobOrder/ltm-license-sl?email=${encodeURIComponent(egpMail || "")}&field=${encodeURIComponent(field || "")}`
    : "";
  const { data: LtmSL } = useSingleData(url);
  return <p>{LtmSL?.SL} </p>;
};

export default LtmLicenseSL;
