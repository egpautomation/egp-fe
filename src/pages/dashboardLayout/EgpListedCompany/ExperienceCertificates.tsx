// @ts-nocheck

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { config } from "@/lib/config";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

const ExperienceCertificates = () => {
  const { email } = useParams();
  const [searchEmail, setSearchEmail] = useState(email || "");
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCompany = async (egpEmail) => {
    if (!egpEmail.trim()) {
      toast.error("Please enter an EGP email");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${config.apiBaseUrl}/egp-listed-company/get-by-mail?mail=${encodeURIComponent(egpEmail.trim())}`
      );
      const data = response.data?.data;
      if (!data) {
        toast.error("No company found with this email");
        setCompany(null);
      } else {
        setCompany(data);
      }
    } catch {
      toast.error("Failed to fetch company data");
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchCompany(email);
    }
  }, [email]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompany(searchEmail);
  };

  const certificates = company?.experienceCertificates
    ? Object.entries(company.experienceCertificates).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Experience Certificates</h2>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
        <div className="flex-1">
          <Label className="text-sm font-medium text-gray-700">EGP Email</Label>
          <Input
            placeholder="Enter EGP email (e.g. msmayshabuilders@yahoo.com)"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </Button>
        </div>
      </form>

      {/* Company Info */}
      {company && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Company Name</p>
            <p className="font-medium">{company.companyName || "N/A"}</p>
          </div>
          <div className="rounded-lg border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">EGP Email</p>
            <p className="font-medium">{company.egpEmail || "N/A"}</p>
          </div>
        </div>
      )}

      {/* Certificates Table */}
      {company && (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a1a] text-white text-left uppercase text-xs font-bold tracking-wider">
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">SL</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Certificate Name</th>
                <th className="whitespace-nowrap px-4 py-3">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {certificates.length > 0 ? (
                certificates.map((cert, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 border-r border-gray-100 font-medium text-gray-700">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-600">
                      {cert.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cert.value}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-gray-500">
                    <p className="text-lg font-medium">No experience certificates found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExperienceCertificates;
