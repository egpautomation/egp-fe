// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createData } from "@/lib/createData";
import { Send } from "lucide-react";
import { useState } from "react";

const JsonFileUploader = ({ setReload }) => {
  const [data, setData] = useState(null);

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) {
          const uniqueTenders = json.filter(
            (tender, index, self) =>
              self.findIndex((t) => t.tenderId === tender.tenderId) === index
          );
          setData(uniqueTenders);
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

  const handleSubmit = () => {
    const url = `${config.apiBaseUrl}/tenderIds/create-tenderIds`;
    createData(url, data, setReload);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Upload JSON File</h2>
      <div className="flex gap-3 flex-wrap items-center ">
        <Input type="file" accept=".json" onChange={handleJsonUpload} />
        {data ? (
          <Button className="" onClick={handleSubmit}>
            Send <Send />
          </Button>
        ) : (
          <Button disabled>
            Send <Send />
          </Button>
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

export default JsonFileUploader;
