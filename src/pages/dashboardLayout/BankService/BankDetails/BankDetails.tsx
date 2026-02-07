// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createData } from "@/lib/createData";
import { AuthContext } from "@/provider/AuthProvider";
import { useContext, useState } from "react";

const BankDetails = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    user: user?.email,
    bankName: "",
    branchName: "",
    branchAddress1: "",
    branchAddress2: "",
    branchAddress3: "",
    branchAddress4: "",
    creditCommitmentNo: "",
    officerName1: "",
    officerDeg1: "",
    officerName2: "",
    officerDeg2: "",
    officerName3: "",
    officerDeg3: "",
    
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      bankName: "",
      branchName: "",
      branchAddress1: "",
      branchAddress2: "",
      branchAddress3: "",
      branchAddress4: "",
      creditCommitmentNo: "",
      officerName1: "",
      officerDeg1: "",
      officerName2: "",
      officerDeg2: "",
      officerName3: "",
      officerDeg3: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const url = `${config.apiBaseUrl}/banks/create-bank-details`;
    createData(url, formData, null, resetForm);
  };

  return (
    <div className="min-h-lvh">
      <h1 className="text-3xl font-semibold text-center my-8">
        Add Bank Details
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl p-5 rounded border shadow-lg mx-auto"
      >
        {/* Bank Name */}
        <div>
          <Label>
            Bank Name<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            placeholder="Enter Bank Name"
            className="mt-2"
            required
          />
        </div>

        {/* Branch Name */}
        <div>
          <Label>
            Branch Name<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="branchName"
            value={formData.branchName}
            onChange={handleInputChange}
            placeholder="Enter Branch Name"
            className="mt-2"
            required
          />
        </div>

        {/* Branch Address 1 */}
        <div>
          <Label>Branch Address 1</Label>
          <Input
            type="text"
            name="branchAddress1"
            value={formData.branchAddress1}
            onChange={handleInputChange}
            placeholder="Enter Branch Address 1"
            className="mt-2"
          />
        </div>

        {/* Branch Address 2 */}
        <div>
          <Label>Branch Address 2</Label>
          <Input
            type="text"
            name="branchAddress2"
            value={formData.branchAddress2}
            onChange={handleInputChange}
            placeholder="Enter Branch Address 2"
            className="mt-2"
          />
        </div>

        {/* Branch Address 3 */}
        <div>
          <Label>Branch Address 3</Label>
          <Input
            type="text"
            name="branchAddress3"
            value={formData.branchAddress3}
            onChange={handleInputChange}
            placeholder="Enter Branch Address 3"
            className="mt-2"
          />
        </div>

        {/* Branch Address 4 */}
        <div>
          <Label>Branch Address 4</Label>
          <Input
            type="text"
            name="branchAddress4"
            value={formData.branchAddress4}
            onChange={handleInputChange}
            placeholder="Enter Branch Address 4"
            className="mt-2"
          />
        </div>

        {/* Credit Commitment No */}
        <div>
          <Label>
            Credit Commitment No:<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="creditCommitmentNo"
            value={formData.creditCommitmentNo}
            onChange={handleInputChange}
            placeholder="Enter Credit Commitment No"
            className="mt-2"
            required
          />
        </div>

        {/* Officer 1 */}
        <div>
          <Label>Officer Name 1</Label>
          <Input
            type="text"
            name="officerName1"
            value={formData.officerName1}
            onChange={handleInputChange}
            placeholder="Enter Officer Name 1"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Officer Designation 1</Label>
          <Input
            type="text"
            name="officerDeg1"
            value={formData.officerDeg1}
            onChange={handleInputChange}
            placeholder="Enter Officer Designation 1"
            className="mt-2"
          />
        </div>

        {/* Officer 2 */}
        <div>
          <Label>Officer Name 2</Label>
          <Input
            type="text"
            name="officerName2"
            value={formData.officerName2}
            onChange={handleInputChange}
            placeholder="Enter Officer Name 2"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Officer Designation 2</Label>
          <Input
            type="text"
            name="officerDeg2"
            value={formData.officerDeg2}
            onChange={handleInputChange}
            placeholder="Enter Officer Designation 2"
            className="mt-2"
          />
        </div>

        {/* Officer 3 */}
        <div>
          <Label>Officer Name 3</Label>
          <Input
            type="text"
            name="officerName3"
            value={formData.officerName3}
            onChange={handleInputChange}
            placeholder="Enter Officer Name 3"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Officer Designation 3</Label>
          <Input
            type="text"
            name="officerDeg3"
            value={formData.officerDeg3}
            onChange={handleInputChange}
            placeholder="Enter Officer Designation 3"
            className="mt-2"
          />
        </div>

     

        {/* Submit Button */}
        <div className="col-span-full">
          <Button className="cursor-pointer w-full">Add</Button>
        </div>
      </form>
    </div>
  );
};

export default BankDetails;
