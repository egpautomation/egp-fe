// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createData } from "@/lib/createData";
import { Send } from "lucide-react";
import { useState } from "react";

const JsonFileUploader = ({ setReload }) => {
  const [data, setData] = useState(null);
  
  
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

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvData = parseCSV(e.target.result);
        if (Array.isArray(csvData)) {
          const uniqueTenders = csvData.filter(
            (tender, index, self) =>
              self.findIndex((t) => t.tenderId === tender.tenderId) === index
          );
          setData(uniqueTenders);
        } else {
          alert("Invalid CSV data format.");
        }
      } catch (err) {
        console.log(err);
        alert("Invalid CSV file: " + err.message);
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
      <h2 className="text-xl font-bold mb-2">Upload CSV File</h2>
      <div className="flex gap-3 flex-wrap items-center ">
        <Input type="file" accept=".csv" onChange={handleCsvUpload} />
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

      
    </div>
  );
};

export default JsonFileUploader;
