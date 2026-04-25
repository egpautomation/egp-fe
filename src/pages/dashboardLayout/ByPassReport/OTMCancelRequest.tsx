// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { patchData } from "@/lib/updateData";
import { CheckCircle, X } from "lucide-react";
import { useState } from "react";

const OTMFulfillRequest = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [tenderId, setTenderId] = useState("");
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setInvoiceNo("");
    setTenderId("");
    setMessage("Request fulfilled successfully.");
  };

  const handleFulfill = (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/otm-bypass-report/update-status-by-query`;
    const payload = {
      invoice_no: invoiceNo,
      tender_id: tenderId,
      status: "fulfilled",
    };
    patchData(url, payload, null, resetForm);
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-lg shadow-md">
          <CheckCircle size={18} />
          <span className="font-medium">{message}</span>
          <X
            size={16}
            className="ml-2 cursor-pointer hover:text-green-900"
            onClick={() => setMessage("")}
          />
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
        OTM Fulfill Request
      </h1>

      <form
        onSubmit={handleFulfill}
        className="w-full max-w-md rounded-xl border bg-white shadow-lg p-6 space-y-5"
      >
        <div>
          <Label className="mb-1.5">Invoice No</Label>
          <Input
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            name="invoice_no"
            placeholder="Enter Invoice No"
            required
          />
        </div>
        <div>
          <Label className="mb-1.5">Tender ID</Label>
          <Input
            value={tenderId}
            onChange={(e) => setTenderId(e.target.value)}
            name="tender_id"
            placeholder="Enter Tender ID"
            required
          />
        </div>
        <Button className="w-full mt-2" type="submit">
          Fulfill Request
        </Button>
      </form>
    </div>
  );
};

export default OTMFulfillRequest;
