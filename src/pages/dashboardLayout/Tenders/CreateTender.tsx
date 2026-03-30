// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createData } from "@/lib/createData";
import { useState } from "react";
import MultipleTenderSender from "./MultipleTenderSender";

const CreateTender = () => {
  // const [publishDate, setPublishDate] = useState("");
  // const [lastSellingDate, setLastSellingDate] = useState("");
  // const [openingDate, setOpeningDate] = useState("");

  const [formData, setFormData] = useState({
    tenderId: "",
    procurementType: "",
    procurementNature: "",
    procurementMethod: "",
    tenderStatus: "",
    officialDesignation: "",
    ministry: "",
    organization: "",
    division: "",
    procuringEntityName: "",
    locationDistrict: "",
    projectName: "",
    sourceOfFunds: "",
    packageNo: "",
    tenderCategory: "",
    descriptionOfWorks: "",
    publicationDateTime: "",
    documentLastSelling: "",
    openingDateTime: "",
    documentPrice: "",
    tenderSecurity: "",
    estimatedCost: "",
    typesOfSimilarNature: "",
    generalExperience: "",
    jvca: "",
    similarNatureWork: "",
    turnoverAmount: "",
    liquidAssets: "",
    tenderCapacity: "",
    workingLocation: "",
    department: "",
    tds: "",
    procuringEntityCode: "",
    appId: "",
    budgetType: "",
    identificationOfLot: "",
    qualityCriteria: "",
    InvitationReferenceNo: "",
    ProjectCode: "",
    TentativeStartDate: "",
    TentativeCompletionDate: "",
    NameofOfficialInviting: "",
    Address: "",
    City: "",
    Thana: "",
    District: "",
    ActivitytotalDays: "",
    tender_subCategories: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const newFormData = {
    //   ...formData,
    //   publicationDateTime: publishDate,
    //   documentLastSelling: lastSellingDate,
    //   openingDateTime: openingDate,
    // };

    const url = `${config.apiBaseUrl}/tenders/create-tender`;
    createData(url, formData);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center my-8">Add Tender</h1>
      <div className="max-w-sm  mx-auto">
        <MultipleTenderSender />
      </div>
      {/* <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl p-5 rounded border shadow-lg mx-auto"
      >
        <div>
          <Label htmlFor="tenderId">
            Tender ID <span className="text-red-700">*</span>
          </Label>
          <Input
            type="number"
            className="mt-2"
            name="tenderId"
            value={formData.tenderId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="procurementType">Procurement Type</Label>
          <Input
            className="mt-2"
            name="procurementType"
            value={formData.procurementType}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="procurementNature">Procurement Nature</Label>
          <Input
            className="mt-2"
            name="procurementNature"
            value={formData.procurementNature}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="procurementMethod">Procurement Method</Label>
          <Input
            className="mt-2"
            name="procurementMethod"
            value={formData.procurementMethod}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="tenderStatus">Tender Status</Label>
          <Input
            className="mt-2"
            name="tenderStatus"
            value={formData.tenderStatus}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="officialDesignation">Official Designation</Label>
          <Input
            className="mt-2"
            name="officialDesignation"
            value={formData.officialDesignation}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="ministry">Ministry</Label>
          <Input
            className="mt-2"
            name="ministry"
            value={formData.ministry}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="organization">Organization</Label>
          <Input
            className="mt-2"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="division">Division</Label>
          <Input
            className="mt-2"
            name="division"
            value={formData.division}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="procuringEntityName">Procuring Entity Name</Label>
          <Input
            className="mt-2"
            name="procuringEntityName"
            value={formData.procuringEntityName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="locationDistrict">Location District</Label>
          <Input
            className="mt-2"
            name="locationDistrict"
            value={formData.locationDistrict}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            className="mt-2"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="sourceOfFunds">Source of Funds</Label>
          <Input
            className="mt-2"
            name="sourceOfFunds"
            value={formData.sourceOfFunds}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="packageNo">Package No</Label>
          <Input
            className="mt-2"
            name="packageNo"
            value={formData.packageNo}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="tenderCategory">Tender Category</Label>
          <Input
            className="mt-2"
            name="tenderCategory"
            value={formData.tenderCategory}
            onChange={handleInputChange}
          />
        </div>

        <div className="lg:col-span-3">
          <Label htmlFor="descriptionOfWorks">Description of Works</Label>
          <Textarea
            className="mt-2"
            name="descriptionOfWorks"
            value={formData.descriptionOfWorks}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label className="mb-2" htmlFor="publicationDateTime">
            Publication DateTime
          </Label>
          <Input
            className="mt-2"
            name="publicationDateTime"
            value={formData.publicationDateTime}
            onChange={handleInputChange}
          />
         
        </div>

        <div>
          <Label className="mb-2" htmlFor="documentLastSelling">
            Document Last Selling
          </Label>
          <Input
            className="mt-2"
            name="documentLastSelling"
            value={formData.documentLastSelling}
            onChange={handleInputChange}
          />
        
        </div>

        <div>
          <Label className="mb-2" htmlFor="openingDateTime">
            Opening DateTime
          </Label>
          <Input
            className="mt-2"
            name="openingDateTime"
            value={formData.openingDateTime}
            onChange={handleInputChange}
          />
         
        </div>

        <div>
          <Label htmlFor="documentPrice">Document Price</Label>
          <Input
            type="text"
            className="mt-2"
            name="documentPrice"
            value={formData.documentPrice}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="tenderSecurity">Tender Security</Label>
          <Input
            type="text"
            className="mt-2"
            name="tenderSecurity"
            value={formData.tenderSecurity}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="estimatedCost">Estimated Cost</Label>
          <Input
            type="text"
            className="mt-2"
            name="estimatedCost"
            value={formData.estimatedCost}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="typesOfSimilarNature">Types of Similar Nature</Label>
          <Input
            className="mt-2"
            name="typesOfSimilarNature"
            value={formData.typesOfSimilarNature}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="generalExperience">General Experience</Label>
          <Input
            className="mt-2"
            name="generalExperience"
            value={formData.generalExperience}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="jvca">JVCA</Label>
          <Input
            className="mt-2"
            name="jvca"
            value={formData.jvca}
            onChange={handleInputChange}
          />
        </div>

        <div className="lg:col-span-3">
          <Label htmlFor="similarNatureWork">Similar Nature Work</Label>
          <Textarea
            className="mt-2"
            name="similarNatureWork"
            value={formData.similarNatureWork}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-full">
          <Label htmlFor="typesOfSimilarNature">TDS</Label>
          <Textarea
            className="mt-2 min-h-16"
            name="tds"
            value={formData.tds}
            onChange={handleInputChange}
            
          />
        </div>

        <div>
          <Label htmlFor="turnoverAmount">Turnover Amount</Label>
          <Input
            type="text"
            className="mt-2"
            name="turnoverAmount"
            value={formData.turnoverAmount}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="liquidAssets">Liquid Assets</Label>
          <Input
            type="text"
            className="mt-2"
            name="liquidAssets"
            value={formData.liquidAssets}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="tenderCapacity">Tender Capacity</Label>
          <Input
            type="text"
            className="mt-2"
            name="tenderCapacity"
            value={formData.tenderCapacity}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="workingLocation">Working Location</Label>
          <Input
            className="mt-2"
            name="workingLocation"
            value={formData.workingLocation}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            className="mt-2"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="procuringEntityCode">Procuring Entity Code</Label>
          <Input
            type="text"
            className="mt-2"
            name="procuringEntityCode"
            value={formData.procuringEntityCode}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="procuringEntityCode">APP ID</Label>
          <Input
            className="mt-2"
            name="appId"
            value={formData.appId}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="budgetType">Budget Type</Label>
          <Input
            className="mt-2"
            name="budgetType"
            value={formData.budgetType}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">Identification Of Lot</Label>
          <Input
            className="mt-2"
            name="identificationOfLot"
            value={formData.identificationOfLot}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-full">
          <Label htmlFor="identificationOfLot">Quality Criteria</Label>
          <Textarea
            className="mt-2"
            name="qualityCriteria"
            value={formData.qualityCriteria}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-full">
          <Label htmlFor="tender_subCategories">Tender Sub-Categories</Label>
          <Textarea
            className="mt-2"
            name="tender_subCategories"
            value={formData.tender_subCategories}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">Invitation Reference No</Label>
          <Input
            className="mt-2"
            name="InvitationReferenceNo"
            value={formData.InvitationReferenceNo}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">Project Code</Label>
          <Input
            className="mt-2"
            name="ProjectCode"
            value={formData.ProjectCode}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">Tentative Start Date</Label>
          <Input
            className="mt-2"
            name="TentativeStartDate"
            value={formData.TentativeStartDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">Tentative Completion Date</Label>
          <Input
            className="mt-2"
            name="TentativeCompletionDate"
            value={formData.TentativeCompletionDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">Name Of Official Inviting</Label>
          <Input
            className="mt-2"
            name="NameofOfficialInviting"
            value={formData.NameofOfficialInviting}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">Address</Label>
          <Input
            className="mt-2"
            name="Address"
            value={formData.Address}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">City</Label>
          <Input
            className="mt-2"
            name="City"
            value={formData.City}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">Thana</Label>
          <Input
            className="mt-2"
            name="Thana"
            value={formData.Thana}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">District</Label>
          <Input
            className="mt-2"
            name="District"
            value={formData.District}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="identificationOfLot">Activity TotalDays</Label>
          <Input
            className="mt-2"
            name="ActivitytotalDays"
            value={formData.ActivitytotalDays}
            onChange={handleInputChange}
          />
        </div>

        <div className="lg:col-span-3">
          <Button className="cursor-pointer w-full">Add Tender</Button>
        </div>
      </form> */}
    </div>
  );
};

export default CreateTender;
