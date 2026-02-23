// @ts-nocheck
import { config } from "@/lib/config";
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
import { createData } from "@/lib/createData";
import { updateData } from "@/lib/updateData";
import { AuthContext } from "@/provider/AuthProvider";
import { CartContext } from "@/provider/CartContext";
import useAllDepartments from "@/hooks/useAllDepartments";
import { X } from "lucide-react";
import { useContext, useState } from "react";

export default function CreateBulpJobOrder() {
  const { user } = useContext(AuthContext);
  const { setReload } = useContext(CartContext);
  const { transformedDepartments: AGENCIES } = useAllDepartments();
  const [ltmLicenseNameCode, setLtmLicenseNameCode] = useState("");
  const [formData, setFormData] = useState({
    userMail: user?.email,
    egpMail: "",
    tenderId: "",
  });

  const [orders, setOrders] = useState([]);

  // Temporary single order form
  const [currentOrder, setCurrentOrder] = useState({
    userMail: user?.email,
    serviceId: 1003,
    egpMail: "",
    tenderId: "",
    liquidAssetsTenderAmount: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrder = () => {
    if (!currentOrder.egpMail || !currentOrder.tenderId) {
      alert("Please fill all required fields");
      return;
    }

    setOrders((prev) => [...prev, currentOrder]);

    // Reset egpMail & tenderId but keep userMail
    // setCurrentOrder({
    //     userMail: user?.email,
    //     egpMail: "",
    //     tenderId: "",

    // });
  };

  const handleRemoveOrder = (index) => {
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  const setReset = () => {
    setOrders([]);
  };

  // Final submit to backend
  const handleFinalSubmit = async () => {
    if (orders.length === 0) {
      alert("No orders to submit");
      return;
    }

    if (!ltmLicenseNameCode) {
      alert("Please select Short Name (LtmLicenseNameCode)");
      return;
    }

    const url1 = `${config.apiBaseUrl}/jobOrder-cart/create-multiple-jobOrderCart`;
    
    // Call first API - Bulk Job Order
    const result = await createData(url1, orders, null, null);
    
    // If first API succeeds, call second API for each tenderId
    if (result?.success) {
      // Collect unique tenderIds from orders
      const uniqueTenderIds = [...new Set(orders.map(order => order.tenderId))];
      
      // Data to update for each tender
      const tenderUpdateData = {
        LtmLicenseNameCode: ltmLicenseNameCode,
      };
      
      // Call PUT API for each unique tenderId
      for (const tenderId of uniqueTenderIds) {
        const url2 = `${config.apiBaseUrl}/tenders/tenderId/${tenderId}`;
        await updateData(url2, tenderUpdateData, null, null);
      }
      
      // Reset after both APIs complete
      setReset();
      setReload((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-lvh p-5">
      <div className="flex gap-5 max-sm:gap-3 flex-wrap max-w-2xl shadow mx-auto p-5 rounded-lg">
        <div className="max-sm:w-full">
          <Label htmlFor="egpEmail">
            E-GP Email<span className="text-red-700">*</span>
          </Label>
          <UserEgpMail
            setFormData={setCurrentOrder}
            value={currentOrder.egpMail}
          />
        </div>

        {/* Tender Id */}
        <div className="max-sm:w-full">
          <Label htmlFor="tenderId">
            Tender Id<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="tenderId"
            onChange={handleInputChange}
            value={currentOrder.tenderId}
            placeholder="Enter Tender Id"
            className="mt-2"
            required
          />
        </div>

        {/* Liquid Assets Tender Amount */}
        <div className="max-sm:w-full">
          <Label htmlFor="liquidAssetsTenderAmount">
            Liquid Assets Tender Amount
          </Label>
          <Input
            type="number"
            name="liquidAssetsTenderAmount"
            onChange={handleInputChange}
            value={currentOrder.liquidAssetsTenderAmount}
            placeholder="Enter Liquid Assets Amount"
            className="mt-2"
          />
        </div>

        <div className="max-sm:w-full sm:w-[220px]">
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

        <div className="max-sm:w-full">
          <Label className="invisible" htmlFor="addOrder">
            Add
          </Label>
          <Button type="button" className="mt-2 max-sm:w-full" onClick={handleAddOrder}>
            Add Order
          </Button>
        </div>
      </div>

      {/* Show added orders */}
      {orders.length > 0 && (
        <div className="max-w-xl mx-auto mt-5 p-4 border rounded max-sm:w-full">
          <h3 className="font-semibold mb-2">Added Orders:</h3>
          <div className="list-disc pl-5">
            {orders.map((order, idx) => (
              <div
                key={idx}
                className="mb-3 shadow-sm p-2 rounded bg-gray-50 flex justify-between"
              >
                <div>
                  <strong>{order.egpMail}</strong> - {order.tenderId}
                  {order.liquidAssetsTenderAmount && (
                    <span className="text-sm text-gray-600"> (Amount: {order.liquidAssetsTenderAmount})</span>
                  )}
                </div>
                <X
                  onClick={() => handleRemoveOrder(idx)}
                  className="cursor-pointer"
                  size={16}
                />
              </div>
            ))}
          </div>

          {/* Final Submit button */}
          <Button
            type="button"
            className="mt-4 max-sm:w-full"
            onClick={handleFinalSubmit}
          >
            Submit All Orders
          </Button>
        </div>
      )}
    </div>
  );
}
