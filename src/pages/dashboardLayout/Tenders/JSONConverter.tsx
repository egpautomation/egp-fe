// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createData } from "@/lib/createData";
import { Send } from "lucide-react";
import { useState } from "react";

const JsonFileUploader = ({ setReload }) => {
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState("");

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error("CSV file must contain at least a header row and one data row.");
    }

    const headers = lines[0].split(',').map(header => header.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return rows;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let parsedData = [];
        const content = e.target.result;

        if (file.name.endsWith('.json')) {
          parsedData = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          parsedData = parseCSV(content);
        } else {
          throw new Error("Unsupported file format. Please upload .csv or .json");
        }

        if (Array.isArray(parsedData)) {
          const uniqueTenders = parsedData.filter(
            (tender, index, self) =>
              self.findIndex((t) => String(t.tenderId) === String(tender.tenderId)) === index
          );
          setData(uniqueTenders);
        } else {
          alert("Invalid data format. Expected an array of tenders.");
        }
      } catch (err) {
        console.error(err);
        alert("Error processing file: " + err.message);
      }
    };

    reader.readAsText(file);
  };

  const handleSubmit = () => {
    const url = `${config.apiBaseUrl}/tenderIds/create-tenderIds`;
    createData(url, data, setReload);
    setData(null);
    setFileName("");
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Upload CSV or JSON File</h2>
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!data}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {data ? `Upload ${data.length} Tenders` : 'Upload'} <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
      {data && (
        <p className="mt-2 text-sm text-green-600 font-medium">
          ✓ Ready to upload: {fileName}
        </p>
      )}
    </div>
  );
};

export default JsonFileUploader;
