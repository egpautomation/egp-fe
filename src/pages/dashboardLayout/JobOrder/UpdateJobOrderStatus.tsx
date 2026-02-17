// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateData } from "@/lib/updateData";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useState } from "react";

const UpdateJobOrderStatus = () => {
  //   const { id } = useParams();
  //   const { data, setReload } = useSingleData(
  //     `https://egpserver.jubairahmad.com/api/v1/jobOrder/${id}`
  //   );
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setOrderId("")
    setJobId("")
    setStatus("")
    setMessage("Status Update Successfully.");
  }

  const handleStatusChange = (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/jobOrder/update-status`;
    const updatedData = {
      orderId: orderId,
      jobId: jobId,
      status,
    };
    updateData(url, updatedData, null, resetForm);
  };

  return (
    <div>
      <div
        id="job_order_update_message"
        className="text-green-600 text-center mt-4 font-medium"
      >
        {message && message}{" "}
        {message && (
          <X
            size={16}
            className="inline-block cursor-pointer"
            onClick={() => setMessage("")}
          />
        )}
      </div>
      <div className="my-10">
        <h1 className="text-xl md:text-3xl font-semibold text-center">
          Update Status
        </h1>
      </div>
      <form
        onSubmit={handleStatusChange}
        className="max-w-lg rounded border shadow-xl mx-auto p-5 "
      >
        <div>
          <Label className="font-medium">Status</Label>
          <Input
            onChange={(e) => setStatus(e.target.value)}
            required
            type="text"
            className="mt-2"
            value={status}
            name="status"
            placeholder="Update Status"
          />
        </div>
        <div className="mt-3">
          <Label className="font-medium">Order Id</Label>
          <Input
            onChange={(e) => setOrderId(e.target.value)}
            required
            name="orderId"
            type="text"
            className="mt-2"
            value={orderId}
            placeholder="Enter JobId"
          />
        </div>
        <div className="mt-3">
          <Label className="font-medium">JobId</Label>
          <Input
            onChange={(e) => setJobId(e.target.value)}
            required
            name="jobId"
            type="text"
            className="mt-2"
            value={jobId}
            placeholder="Enter JobId"
          />
        </div>

        <Button
          name="updateJobOrderStatus"
          className="w-full mt-5"
          type="submit"
        >
          Update Status
        </Button>
      </form>
    </div>
  );
};

export default UpdateJobOrderStatus;
