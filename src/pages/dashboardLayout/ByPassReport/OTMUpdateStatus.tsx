// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { patchData } from "@/lib/updateData";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useState } from "react";

const STATUS_OPTIONS = ["pending", "waiting", "processing", "fulfilled", "canceled"];

const OTMUpdateStatus = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [tenderId, setTenderId] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setInvoiceNo("");
    setTenderId("");
    setStatus("");
    setMessage("Status Updated Successfully.");
  };

  const handleStatusChange = (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/otm-bypass-report/update-status-by-query`;
    const payload = {
      invoice_no: invoiceNo,
      tender_id: tenderId,
      status,
    };
    patchData(url, payload, null, resetForm);
  };

  return (
    <div>
      <div className="text-green-600 text-center mt-4 font-medium">
        {message && (
          <>
            {message}{" "}
            <X
              size={16}
              className="inline-block cursor-pointer"
              onClick={() => setMessage("")}
            />
          </>
        )}
      </div>
      <div className="my-10">
        <h1 className="text-xl md:text-3xl font-semibold text-center">
          OTM Update Status
        </h1>
      </div>
      <form
        onSubmit={handleStatusChange}
        className="max-w-lg rounded border shadow-xl mx-auto p-5"
      >
        <div>
          <Label className="font-medium">Invoice No</Label>
          <Input
            onChange={(e) => setInvoiceNo(e.target.value)}
            type="text"
            className="mt-2"
            value={invoiceNo}
            name="invoice_no"
            placeholder="Enter Invoice No"
          />
        </div>
        <div className="mt-3">
          <Label className="font-medium">Tender ID</Label>
          <Input
            onChange={(e) => setTenderId(e.target.value)}
            name="tender_id"
            type="text"
            className="mt-2"
            value={tenderId}
            placeholder="Enter Tender ID"
          />
        </div>
        <div className="mt-3">
          <Label className="font-medium">Status</Label>
          <select
            onChange={(e) => setStatus(e.target.value)}
            required
            name="status"
            value={status}
            className="mt-2 w-full h-9 rounded-md border border-gray-300 px-3 text-sm focus:border-[#4874c7] focus:outline-none focus:ring-1 focus:ring-[#4874c7]"
          >
            <option value="">Select Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <Button className="w-full mt-5" type="submit">
          Update Status
        </Button>
      </form>
    </div>
  );
};

export default OTMUpdateStatus;
