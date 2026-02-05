// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useAllUserEgpMail from "@/hooks/useAllUserEgpMail";
import useUsersCompanyMigration from "@/hooks/useUsersCompanyMigrations";
import { AuthContext } from "@/provider/AuthProvider";
import { uploadImageToImgBB } from "@/utils/uploadImageToImageBB";
import { MoveLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";

const CreateCompanyRegistration = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userMail } = useAllUserEgpMail(user?.email);
  const { companyMigrations } = useUsersCompanyMigration(user?.email, "");
  const [egpEmailError, setEgpEmailError] = useState("");

  const [formData, setFormData] = useState({
    egpEmail: "",
    egpLoginKey: "",
    companyName: "",
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [egpPassword, setEgpPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "egpEmail") {
      const trimmedValue = value.trim()
      const startsWithCapital = /^[A-Z]/.test(trimmedValue);
      const containsUpperCase = /[A-Z]/.test(trimmedValue);
      const missingDotCom = !/\.com$/.test(trimmedValue);

      if (startsWithCapital) {
        setEgpEmailError("Email should not start with a capital letter.");
        setIsDisabled(true);
      } else if (containsUpperCase) {
        setEgpEmailError("Email should not contain uppercase letters.");
        setIsDisabled(true);
      } else if (missingDotCom) {
        setEgpEmailError("Email must end with '.com'.");
        setIsDisabled(true);
      } else {
        // Check if this user already has a migration with this E-GP email
        const isExisted = companyMigrations?.find((item) => item.egpEmail === trimmedValue);
        if (isExisted) {
          setEgpEmailError("This Email Is Already Used");
          setIsDisabled(true);
        } else {
          setEgpEmailError("");
          setIsDisabled(false);
        }
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: name === "egpEmail" ? value.trim() : value,
    }));
  };

  const handleFileChange = async (event) => {
    const { name } = event.target;
    const imageUrl = (await uploadImageToImgBB(event.target.files[0])) || "";

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: [...(prev[name] || []), imageUrl],
      };

      if (
        name === "tinCertificateDocument" &&
        updatedData.tinCertificateDocument.length > 0
      ) {
        updatedData.companyTinCertificate = "yes";
      }
      if (
        name === "companyTradeLicenseDocument" &&
        updatedData.companyTradeLicenseDocument.length > 0
      ) {
        updatedData.companyTradeLicense = "yes";
      }

      return updatedData;
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating...");

    try {
      const response = await axiosInstance.post(
        "/companyMigration/create-companyMigration",
        {
          user: user?.email,
          egpEmail: formData.egpEmail,
          egpLoginKey: formData.egpLoginKey,
          companyName: formData.companyName,
        }
      );

      const data = response.data;

      if (data?.success) {
        toast.success("Created successfully");
        setFormData({
          egpEmail: "",
          egpLoginKey: "",
          companyName: "",
        });
        setEgpPassword("");

        // Redirect to my-registered-company page after a short delay
        setTimeout(() => {
          navigate("/dashboard/my-registered-company");
        }, 1000);
      } else {
        toast.error(data.error || "Failed to Create");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "An unexpected error occurred";
      toast.error(errorMessage);
      console.error("Error:", error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // useEffect(() => {
  //   if (
  //     (formData.companyTradeLicense === "no" &&
  //       !formData.companyTradeLicenseDocument.length) ||
  //     (formData.companyTinCertificate === "no" &&
  //       !formData.tinCertificateDocument.length) ||
  //     egpPassword !== formData?.egpLoginKey
  //   ) {
  //     setIsDisabled(true);
  //   } else {
  //     if (
  //       !formData?.egpEmail ||
  //       !formData?.companyName ||
  //       !formData?.egpLoginKey ||
  //       !formData?.ltmLicenseCount
  //     ) {
  //       setIsDisabled(true);
  //     } else {
  //       setIsDisabled(false);
  //     }
  //   }
  // }, [formData, egpPassword]);

  return (
    <section className="min-h-lvh ">
      <Link
        className="mt-5 inline-block"
        to={"/dashboard/my-registered-company"}
      >
        <Button>
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center my-5">Company Migration</h1>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl shadow-2xl p-4 md:p-6 lg:p-8 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 gap-5"
          >
            <div className="">
              <Label htmlFor="egpEmail">
                E-GP Email<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="egpEmail"
                onChange={handleInputChange}
                value={formData.egpEmail}
                placeholder="Enter E-GP Email"
                className="mt-2"
                required
              />
              {egpEmailError && (
                <p className="text-sm text-red-700 mt-2">{egpEmailError}</p>
              )}
            </div>

            <div className="">
              <Label htmlFor="egpLoginKey">
                E-GP Login Password<span className="text-red-700">*</span>
              </Label>
              <mark className="bg-yellow-400 mt-2 text-white text-[12px] px-1 rounded">
                {" "}
                পাসওয়ার্ড ভালোভাবে যাচাই করুন, পাসওয়ার্ড দিতে ভুল করলে" E-GP
                একাউন্ট লক হতে পারে।
              </mark>
              <Input
                type="text"
                name="egpLoginKey"
                onChange={handleInputChange}
                value={formData.egpLoginKey}
                placeholder="Enter E-GP Login password"
                className="mt-2"
                required
              />
            </div>

            <div className="">
              <Label htmlFor="name">
                Company Name<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="companyName"
                onChange={handleInputChange}
                value={formData.companyName}
                placeholder="Company Name"
                className="mt-2"
                required
              />
            </div>

            <div className="">
              <Label htmlFor="egpLoginKeyRetype">
                Retype E-GP Login Password<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="egpPassword"
                onChange={(e) => setEgpPassword(e.target.value)}
                value={egpPassword}
                placeholder="Enter E-GP Login password again"
                className="mt-2"
                required
              />
              {egpPassword !== formData?.egpLoginKey && (
                <p className="text-red-700 mt-1 text-sm">
                  Password does not match
                </p>
              )}
            </div>

            {/* <div className="">
              <Label htmlFor="others">Others File</Label>
              <Input
                type="file"
                name="othersFile"
                placeholder="Select Others File"
                className="mt-2"
                multiple
                onChange={handleFileChange}
              />
            </div> */}

            <div className="col-span-full">
              {isDisabled ? (
                <Button disabled className="w-full cursor-pointer">
                  Submit
                </Button>
              ) : (
                <Button type="submit" className="w-full cursor-pointer">
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateCompanyRegistration;
