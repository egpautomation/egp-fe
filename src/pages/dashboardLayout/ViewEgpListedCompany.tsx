// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSingleData from "@/hooks/useSingleData";
import { MoveLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ViewEgpListedCompany = () => {
  const { id } = useParams();
  const url = `${config.apiBaseUrlAlt}/egp-listed-company/${id}`;
  const { data: formData } = useSingleData(url);
  return (
    <div className="min-h-lvh py-5 pb-10">
      <Link to={"/dashboard/all-egp-listed-company"}>
        <Button className="flex items-center gap-1.5 mt-6 cursor-pointer">
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-semibold text-center my-6">
        Company Details
      </h1>
      <div>
        <form className="max-w-3xl border mx-auto p-5 shadow-xl rounded  grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* egp email */}
          <div className="">
            <Label htmlFor="egpEmail">
              E-GP Email<span className="text-red-700">*</span>
            </Label>
            <Input
              type="text"
              name="egpEmail"
              value={formData.egpEmail}
              placeholder="Enter Egp Email"
              className="mt-2"
              readOnly
            />
          </div>
          {/* company name */}
          <div className="">
            <Label htmlFor="district">
              Company Name<span className="text-red-700">*</span>
            </Label>
            <Input
              type="text"
              name="companyName"
              value={formData.companyName}
              className="mt-2"
              readOnly
            />
          </div>

          {/* Password */}
          <div className="">
            <Label htmlFor="Password">
              Password<span className="text-red-700">*</span>
            </Label>
            <Input
              type="text"
              name="password"
              value={formData.password}
              placeholder="Enter Password"
              className="mt-2"
              readOnly
            />
          </div>

          {/* Status */}
          <div className="">
            <Label htmlFor="Password">
              Status<span className="text-red-700">*</span>
            </Label>
            <Input className="mt-2" value={formData?.status} readOnly />
          </div>

          {/* remarks */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              Remarks<span className="text-red-700">*</span>
            </Label>
            <Input
              type="text"
              name="remarks"
              value={formData.remarks}
              placeholder="Reason of Deactivate"
              className="mt-2"
              readOnly
            />
          </div>

          {/* bankName */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              Bank Name<span className="text-red-700">*</span>
            </Label>
            <Input
              type="text"
              name="bankName"
              value={formData.bankName}
              placeholder="Bank Name"
              className="mt-2"
              readOnly
            />
          </div>

          {/* folderFile */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              Folder File<span className="text-red-700">*</span>
            </Label>
            <Input
              type="number"
              name="folderFile"
              value={formData.folderFile}
              placeholder="Enter Folder File"
              className="mt-2"
              readOnly
            />
          </div>

          {/* autho */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              Autho<span className="text-red-700">*</span>
            </Label>
            <Input
              type="number"
              name="autho"
              value={formData.autho}
              placeholder="Enter Auto"
              className="mt-2"
              readOnly
            />
          </div>

          {/* NID */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              NID<span className="text-red-700">*</span>
            </Label>
            <Input
              type="number"
              name="nid"
              value={formData.nid}
              placeholder="NID"
              className="mt-2"
              readOnly
            />
          </div>

          {/* Trade */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              Trade<span className="text-red-700">*</span>
            </Label>
            <Input
              type="number"
              name="trade"
              value={formData.trade}
              placeholder="Enter Trade"
              className="mt-2"
              readOnly
            />
          </div>

          {/* Tin */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              Tin<span className="text-red-700">*</span>
            </Label>
            <Input
              type="number"
              name="tin"
              value={formData.tin}
              placeholder="Enter Tin"
              className="mt-2"
              readOnly
            />
          </div>

          {/* vat */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              Vat<span className="text-red-700">*</span>
            </Label>
            <Input
              type="number"
              name="vat"
              value={formData.vat}
              placeholder="Enter amount of vat"
              className="mt-2"
              readOnly
            />
          </div>

          {/* Other 1 */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              Other 1<span className="text-red-700">*</span>
            </Label>
            <Input
              type="number"
              name="other1"
              value={formData.other1}
              placeholder="Other"
              className="mt-2"
              readOnly
            />
          </div>

          {/* Other 2 */}
          <div className="">
            <Label className="mb-2" htmlFor="lastUsePassDate">
              Other 2<span className="text-red-700">*</span>
            </Label>
            <Input
              type="number"
              name="other2"
              value={formData.other2}
              placeholder="Other"
              className="mt-2"
              readOnly
            />
          </div>

          {/* LGED */}
          {formData?.LGED && (
            <div>
              <Label className="mb-2" htmlFor="lastUsePassDate">
                LGED
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="LGED"
                  value={formData.LGED}
                  placeholder="LGED"
                  className="mt-2"
                  readOnly
                />
              </div>
            </div>
          )}

          {/* EED */}
          {formData?.EED && (
            <div className="">
              <Label className="mb-2" htmlFor="lastUsePassDate">
                EED
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="EED"
                  value={formData.EED}
                  placeholder="EED"
                  className="mt-2"
                  readOnly
                />
              </div>
            </div>
          )}

          {/* RHD */}
          {formData?.RHD && (
            <div className="">
              <Label className="mb-2" htmlFor="lastUsePassDate">
                RHD
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="RHD"
                  value={formData.RHD}
                  placeholder="RHD"
                  className="mt-2"
                  readOnly
                />
              </div>
            </div>
          )}

          {/* BWBD */}
          {formData?.BWBD && (
            <div className="">
              <Label className="mb-2" htmlFor="lastUsePassDate">
                BWBD
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="BWBD"
                  value={formData.BWBD}
                  placeholder="BWBD"
                  className="mt-2"
                  readOnly
                />
              </div>
            </div>
          )}

          {/* BSCIC */}
          {formData?.BSCIC && (
            <div className="">
              <Label className="mb-2" htmlFor="lastUsePassDate">
                BSCIC
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="BSCIC"
                  value={formData.BSCIC}
                  placeholder="BSCIC"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Food */}
          {formData?.Food && (
            <div className="">
              <Label className="mb-2" htmlFor="Food">
                Food
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="Food"
                  value={formData.Food}
                  placeholder="Food"
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ViewEgpListedCompany;
