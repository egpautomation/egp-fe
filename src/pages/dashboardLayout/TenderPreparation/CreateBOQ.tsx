// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createData } from "@/lib/createData";
import { Send, X } from "lucide-react";
import { useRef, useState } from "react";

export default function CreateBOQ() {
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

        if (Array.isArray(json)) {
          setData(json);
        } else {
          alert("JSON is not an array of objects.");
        }
      } catch (err) {
        console.log(err);
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  const resetForm = () => {
    setData(null); // clear uploaded data
    setMessage("Tenders submitted successfully."); // show success message
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input
    }
  };
  const handleSubmit = () => {
    const url = `${config.apiBaseUrl}/BOQ/create-BOQ`;
    createData(url, data, null, resetForm);
  };
  return (
    <div className="my-16">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl border border-slate-200 p-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-slate-800 mb-4">Upload JSON File</h2>

        <p className="text-sm text-slate-500 text-center mb-6">
          Upload your BOQ data in JSON format and submit to the server
        </p>

        {/* Upload Area */}
        <div className="flex flex-col items-center gap-4">
          <label className="w-full cursor-pointer">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-primary transition">
              <p className="text-sm text-slate-600">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400 mt-1">Only JSON files are allowed</p>
            </div>

            <Input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleJsonUpload}
              className="hidden"
            />
          </label>

          {/* File Selected Indicator */}
          {data && (
            <p className="text-sm text-green-600 font-medium">✅ File loaded successfully</p>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!data}
            className="w-full flex items-center justify-center gap-2 text-base py-2"
          >
            Send <Send size={18} />
          </Button>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-6 flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            <span>{message}</span>
            <X
              size={16}
              className="cursor-pointer hover:text-red-500"
              onClick={() => setMessage("")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
