// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { patchData } from "@/lib/updateData";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useState } from "react";

const OTMCancelRequest = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [tenderId, setTenderId] = useState("");
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setInvoiceNo("");
    setTenderId("");
    setMessage("Cancel request submitted successfully.");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/otm-bypass-report/update-status-by-query`;
    const payload = {
      invoice_no: invoiceNo,
      tender_id: tenderId,
      status: "canceled",
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
          OTM Cancel Request
        </h1>
      </div>
      <form
        onSubmit={handleCancel}
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

        <Button variant="destructive" className="w-full mt-5" type="submit">
          Cancel Request
        </Button>
      </form>
    </div>
  );
};

export default OTMCancelRequest;
