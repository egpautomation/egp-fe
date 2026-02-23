// @ts-nocheck

import { config } from "@/lib/config";
import SlOfCreditLine from "@/components/dashboard/SLOfCreditLine";
import UserEgpMail from "@/components/dashboard/UserEgpMail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAllDepartments from "@/hooks/useAllDepartments";
import useAllUserJobOrderCart from "@/hooks/useUserJobOrderCart";
import { createData } from "@/lib/createData";
import { updateData } from "@/lib/updateData";
import { AuthContext } from "@/provider/AuthProvider";
import { CartContext } from "@/provider/CartContext";
import { MoveLeft } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { json } from "stream/consumers";
import toast from "react-hot-toast";

const CreateJobOrder = () => {
  const { user } = useContext(AuthContext);
  const { setReload } = useContext(CartContext);
  const { transformedDepartments: AGENCIES } = useAllDepartments();
  const [ltmLicenseNameCode, setLtmLicenseNameCode] = useState("");
  const [formData, setFormData] = useState({
    userMail: user?.email,
    egpMail: "",
    tenderId: "",
    SlNoLineOfCredit: "",
    SLOfCredit: "",
    liquidAssetsTenderAmount: "",
    bankName: "",
    equipment: "",
    manpower: "",
    activityDate1: "",
    activityDate2: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleReset = () => {
    setFormData({
      userMail: user?.email,
      egpMail: "",
      tenderId: "",
      SlNoLineOfCredit: "",
      SLOfCredit: "",
      liquidAssetsTenderAmount: "",
      bankName: "",
      equipment: "",
      manpower: "",
      activityDate1: "",
      activityDate2: "",
    });
    setLtmLicenseNameCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ltmLicenseNameCode) {
      toast.error("Please select Short Name");
      return;
    }

    const url = `${config.apiBaseUrl}/jobOrder-cart/create-jobOrderCart`;

    const toastId = toast.loading("Adding to cart...");

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      formDataToSend.append("userMail", formData.userMail || "");
      formDataToSend.append("egpMail", formData.egpMail || "");
      formDataToSend.append("tenderId", formData.tenderId || "");
      formDataToSend.append("SlNoLineOfCredit", formData.SlNoLineOfCredit || "");
      formDataToSend.append("SLOfCredit", formData.SLOfCredit || "");
      formDataToSend.append(
        "liquidAssetsTenderAmount",
        formData.liquidAssetsTenderAmount || ""
      );
      formDataToSend.append("bankName", formData.bankName || "");
      formDataToSend.append("equipment", formData.equipment || "");
      formDataToSend.append("manpower", formData.manpower || "");
      formDataToSend.append("activityDate1", formData.activityDate1 || "");
      formDataToSend.append("activityDate2", formData.activityDate2 || "");
      formDataToSend.append("serviceId", "1001");


      // Create a dummy empty file to prevent "Cannot read properties of undefined (reading 'buffer')" error
      const dummyFile = new File([""], "no-file.txt", { type: "text/plain" });
      formDataToSend.append("file", dummyFile);

      const res = await fetch(url, {
        method: "POST",
        body: formDataToSend, // Send as FormData, browser will set correct Content-Type
      });

      const data = await res.json();
      console.log("Response:", data);

      toast.dismiss(toastId);

      if (data.success) {
        const tenderUpdateUrl = `${config.apiBaseUrl}/tenders/tenderId/${formData.tenderId}`;
        await updateData(
          tenderUpdateUrl,
          { LtmLicenseNameCode: ltmLicenseNameCode },
          null,
          null
        );
        toast.success("Added to cart successfully!");
        setReload((prev) => prev + 1);
        handleReset();
      } else {
        toast.error(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(toastId);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <section className="min-h-lvh mt-5">
      <Link to={"/dashboard/job-order/me"}>
        <Button className="cursor-pointer">
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center mb-5 underline">
        Order A Job{" "}
      </h1>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1  gap-5"
          >
            <div className="">
              <Label htmlFor="egpEmail">
                E-GP Email<span className="text-red-700">*</span>
              </Label>
              <UserEgpMail setFormData={setFormData} value={formData.egpMail} />
            </div>
            {/* Tender Id */}
            <div className="">
              <Label htmlFor="tenderId">
                Tender Id<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="tenderId"
                onChange={handleInputChange}
                value={formData.tenderId}
                placeholder="Enter Tender Id"
                className="mt-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
              {/* Liquid Assets Tender Amount */}
              <div>
                <Label htmlFor="liquidAssets">Liquid Assets Tender Amount</Label>
                <Input
                  type="number"
                  name="liquidAssetsTenderAmount"
                  onChange={handleInputChange}
                  value={formData.liquidAssetsTenderAmount}
                  placeholder="Liquid Assets Tender Amount (From Bank)"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="ltmLicenseNameCode">
                  Short Name<span className="text-red-700">*</span>
                </Label>
                <Select value={ltmLicenseNameCode} onValueChange={setLtmLicenseNameCode}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Select short" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {AGENCIES.map((agency) => (
                        <SelectItem key={agency.value} value={agency.value}>
                          {agency.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bank Name */}
            <div className="">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                type="text"
                name="bankName"
                onChange={handleInputChange}
                value={formData.bankName}
                placeholder="Enter Bank Name"
                className="mt-2"
              />
            </div>

            {/* Equipment */}
            <div className="">
              <Label htmlFor="equipment">Equipment</Label>
              <Input
                type="text"
                name="equipment"
                onChange={handleInputChange}
                value={formData.equipment}
                placeholder="Enter Equipment"
                className="mt-2"
              />
            </div>

            {/* Manpower */}
            <div className="">
              <Label htmlFor="manpower">Manpower</Label>
              <Input
                type="text"
                name="manpower"
                onChange={handleInputChange}
                value={formData.manpower}
                placeholder="Enter Manpower"
                className="mt-2"
              />
            </div>

            {/* Activity Date 1 */}
            <div className="">
              <Label htmlFor="activityDate1">Activity Date 1</Label>
              <Input
                type="number"
                name="activityDate1"
                onChange={handleInputChange}
                value={formData.activityDate1}
                placeholder="Enter Activity Date 1"
                className="mt-2"
              />
            </div>

            {/* Activity Date 2 */}
            <div className="">
              <Label htmlFor="activityDate2">Activity Date 2</Label>
              <Input
                type="number"
                name="activityDate2"
                onChange={handleInputChange}
                value={formData.activityDate2}
                placeholder="Enter Activity Date 2"
                className="mt-2"
              />
            </div>

            <div className="col-span-full">
              <Button type="submit" className="w-full cursor-pointer">
                Add To Cart
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateJobOrder;
