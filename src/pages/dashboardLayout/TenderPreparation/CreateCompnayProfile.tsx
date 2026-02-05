// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createData } from "@/lib/createData";
import { Send, X } from "lucide-react";
import { useRef, useState } from "react";

export default function CreateCompanyProfile() {
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

    const resetForm = () => {
        setData(null); // clear uploaded data
        setMessage("Tenders submitted successfully."); // show success message
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // reset file input
        }
    };
    // https://egp-tender-automation-server.vercel.app
    const handleSubmit = () => {
        const url = `https://egpserver.jubairahmad.com/api/v1/company-profile/create-companay-profile`;
        createData(url, data, null, resetForm);
    };
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-center">Upload JSON File</h2>
            <div className="flex gap-3 flex-wrap items-center justify-center max-w-md mx-auto">
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


        </div>
    )
}
