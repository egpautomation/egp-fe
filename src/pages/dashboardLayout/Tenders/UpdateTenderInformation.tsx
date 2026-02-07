// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateData } from "@/lib/updateData";
import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import UpdateJsonTender from "./UpdateJsonTender";

const UpdateTenderInformation = () => {
  const [formData, setFormData] = useState({});
  const [tenderId, setTenderId] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // If the input is cleared, remove the key from formData
      if (value.trim() === "") {
        const { [name]: removed, ...rest } = prev;
        return rest;
      }

      // Otherwise, update as usual
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const resetForm = () => {
    setFormData({});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrlAlt}/tenders/tenderId/${tenderId}`;
    await updateData(url, formData, null, resetForm);
  };

  return (
    <section className="min-h-lvh">
      <Link to={"/dashboard/tenders"}>
        <Button className="flex items-center gap-1.5 mt-6 cursor-pointer">
          <MoveLeft /> Back To Tender Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center my-5">
        Update Tender Information
      </h1>
      <div className="max-w-sm mx-auto">
        <UpdateJsonTender />
      </div>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-2xl shadow-xl p-3 md:p-5 rounded border">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <Label>
                Tender Id <span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name={"tenderId"}
                value={tenderId}
                onChange={(e) => setTenderId(e.target.value)}
                placeholder={`Enter TenderId`}
                className="mt-2"
                required
              />
            </div>
            {[
              "generalExperience",
              "similarNatureWork",
              "turnoverAmount",
              "liquidAssets",
              "tenderCapacity",
              "jvca",
              "typesOfSimilarNature",
              "selectedTenderCategory",
              "eligibilityOfTendererDocument",
              "financialCriteria",
              "tender_subCategories",
              "LtmLicenseNameCode",
              "liquidAssets"
            ].map((field) => (
              <div
                key={field}
                className={` ${
                  field == "financialCriteria" ? "col-span-full" : ""
                } ${field == "tender_subCategories" ? "col-span-full" : ""}`}
              >
                <Label>
                  {field}{" "}
                  {field == "tenderId" && (
                    <span className="text-red-700">*</span>
                  )}
                </Label>
                <Input
                  type="text"
                  name={field}
                  value={formData?.[field] || ""}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field}`}
                  className={`mt-2`}
                />
              </div>
            ))}

            <div className="col-span-full">
              <Button
                disabled={Object.keys(formData).length === 0 || !tenderId}
                type="submit"
                className="w-full cursor-pointer"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateTenderInformation;
