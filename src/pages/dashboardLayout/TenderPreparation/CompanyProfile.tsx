// @ts-nocheck

import { config } from "@/lib/config";
import useSingleData from "@/hooks/useSingleData"
import { useParams } from "react-router-dom"

export default function CompanyProfile() {
    const {id} = useParams()
    const url = `${config.apiBaseUrl}/company-profile/single-profile-information?email=${id}`
    const {data} = useSingleData(url)
    console.log(data)

  return (
   <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Company Profile
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      eGP e-mail ID:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                     {data?.egpEmail}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Registration Approval Date:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                     {data?.registrationApprovalDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Company Unique Identification No:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                     {data?.companyUniqueId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Company Name:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {data?.companyName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Company Name in Bangla:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {data?.companyNameBangla}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Company's Legal Status:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {data?.legalStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Trade License Number:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {data?.tradeLicenseNumber}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Tax Identification Number:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                     {data?.taxIdentificationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      VAT Registration Number:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                     {data?.vatRegistrationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      State / District:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {data?.stateOrDistrict}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      City / Town:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                    {data?.cityOrTown}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Thana / Upazila:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {data?.thanaOrUpazila}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Phone No:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                    {data?.phoneNo}
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Corporate / Head office Address:
                    </span>
                    <span className="text-sm font-semibold text-gray-800 text-right">
                    {data?.corporateAddress}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Company's website:
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      www.techsolutions.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}
