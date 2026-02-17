// @ts-nocheck
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateData } from "@/lib/updateData";
import { Send, X } from "lucide-react";
import { useRef, useState } from "react";

const UpdateJsonTender = () => {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
       setData(json);
       console.log(json)
      } catch (err) {
        console.log(err);
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  const resetForm = () => {
    setData(null); // clear uploaded data
    setMessage("Tender Updated successfully."); // show success message
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input
    }
  };
  const handleSubmit = () => {
    const url = `${config.apiBaseUrl}/tenders/tenderId/${data?.tenderId}`;
    updateData(url, data, null, resetForm);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2 text-center">Upload JSON File</h2>
      <div className="flex gap-3 flex-wrap items-center justify-center">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleJsonUpload}
        />
        {data ? (
          <Button className="mx-auto" onClick={handleSubmit}>
            Send <Send />
          </Button>
        ) : (
          <Button disabled>
            Send <Send />
          </Button>
        )}
      </div>

      <div
        id="tender_submission-message"
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

      {/* {data && (
        <pre className="bg-gray-100 p-4 mt-4 rounded text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )} */}
    </div>
  );
};

export default UpdateJsonTender;
