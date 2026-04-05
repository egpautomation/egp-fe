// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSingleData from "@/hooks/useSingleData";
import { MoveLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ViewCompanyMigration = () => {
  const { id } = useParams();
  const url = `${config.apiBaseUrl}/companyMigration/${id}`;
  const { data, loading } = useSingleData(url);
  console.log(data);

  return (
    <section className="min-h-lvh ">
      <Link className="mt-5 inline-block" to={"/dashboard/company-registration"}>
        <Button>
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center my-5">Company Migration</h1>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-2xl shadow-2xl p-3 md:p-5 rounded border">
          <form className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="">
              <Label htmlFor="egpEmail"> User </Label>
              <Input
                type="text"
                name="egpLoginKey"
                value={data?.user}
                placeholder="Enter Login Key"
                className="mt-2"
                readOnly
              />
            </div>
            <div className="">
              <Label htmlFor="egpEmail">E-GP Email</Label>
              <Input
                type="text"
                name="egpEmail"
                value={data.egpEmail}
                placeholder="Enter E-GP Email"
                className="mt-2"
                readOnly
              />
            </div>

            <div className="">
              <Label htmlFor="egpLoginKey">E-GP Login Key</Label>

              <Input
                type="text"
                name="egpLoginKey"
                value={data?.egpLoginKey}
                placeholder="Enter Login Key"
                className="mt-2"
                readOnly
              />
            </div>

            <div className="">
              <Label htmlFor="name">Company Name</Label>
              <Input
                type="text"
                name="companyName"
                value={data?.companyName}
                placeholder="Company Name"
                className="mt-2"
                readOnly
              />
            </div>

            <div className="">
              <Label htmlFor="companyTradeLicense">Up To Data?</Label>
              <Input
                type="text"
                name="egpPassword"
                value={data?.isUpToDate}
                placeholder="Enter E-GP Email"
                className="mt-2"
                readOnly
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="companyTradeLicense">LTM Licenses</Label>
              <div className="mt-2 flex items-center gap-2">
                {data?.ltmTenderLicenseShortName?.map((item, idx) => (
                  <Button key={idx} variant={"secondary"}>
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            {data?.companyTradeLicenseDocument?.length > 0 && (
              <div className="col-span-full">
                <Label htmlFor="companyTradeLicense">Trade Licenses</Label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {data?.companyTradeLicenseDocument?.map((item, idx) => (
                    <img src={item} className="h-24 w-24 rounded object-cover" key={idx} />
                  ))}
                </div>
              </div>
            )}
            {data?.tinCertificateDocument?.length > 0 && (
              <div className="col-span-full">
                <Label htmlFor="companyTradeLicense">Tin Certificates</Label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {data?.tinCertificateDocument?.map((item, idx) => (
                    <img src={item} className="h-24 w-24 rounded object-cover" key={idx} />
                  ))}
                </div>
              </div>
            )}
            {data?.othersFile?.length > 0 && (
              <div className="col-span-full">
                <Label htmlFor="companyTradeLicense">Others File</Label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {data?.othersFile?.map((item, idx) => (
                    <img src={item} className="h-24 w-24 rounded object-cover" key={idx} />
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ViewCompanyMigration;
