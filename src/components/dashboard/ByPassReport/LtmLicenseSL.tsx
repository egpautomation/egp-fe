// @ts-nocheck

import useSingleData from "@/hooks/useSingleData";

const LtmLicenseSL = ({ data }) => {
  const egpMail = data?.egpMail;
  const field = data?.LtmLicenseNameCode;
  // https://egpserver.jubairahmad.com
  const url = `https://egpserver.jubairahmad.com/api/v1/jobOrder/ltm-license-sl?email=${egpMail}&field=${field}`;
  const { data: LtmSL } = useSingleData(url);
  return <p>{LtmSL?.SL} </p>;
};

export default LtmLicenseSL;
