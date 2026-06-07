// @ts-nocheck
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createData } from "@/lib/createData";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Wallet,
  Hash,
  ArrowUpDown,
  DollarSign,
  FileText,
  ChevronLeft,
  X,
  CreditCard,
  PlusCircle,
} from "lucide-react";

const CreatePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract pre-filled details from navigation state
  const stateReference = location.state?.userId || "";
  const stateWallet = location.state?.walletBalance !== undefined ? String(location.state?.walletBalance) : "";

  const [formData, setFormData] = useState({
    wallet: stateWallet,
    transactionId: "",
    transactionType: "deposit",
    transactionAmount: "",
    transactionReference: stateReference,
    others: "",
  });

  const [isPrefilled, setIsPrefilled] = useState(!!stateReference);

  // Sync state if navigation changes
  useEffect(() => {
    if (stateReference) {
      setFormData((prev) => ({
        ...prev,
        wallet: stateWallet,
        transactionReference: stateReference,
      }));
      setIsPrefilled(true);
    }
  }, [stateReference, stateWallet]);

  const resetForm = () => {
    setFormData({
      wallet: isPrefilled ? stateWallet : "",
      transactionId: "",
      transactionType: "deposit",
      transactionAmount: "",
      transactionReference: isPrefilled ? stateReference : "",
      others: "",
    });
  };

  const handleClearPrefill = () => {
    setIsPrefilled(false);
    setFormData({
      wallet: "",
      transactionId: "",
      transactionType: "deposit",
      transactionAmount: "",
      transactionReference: "",
      others: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/payments/create-payment`;
    const res = await createData(
      url,
      {
        ...formData,
        wallet: Number(formData.wallet),
        transactionAmount: Number(formData.transactionAmount),
      },
      null,
      resetForm
    );

    if (res?.success) {
      navigate("/dashboard/users");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <Button
          onClick={() => navigate("/dashboard/users")}
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-800 gap-1.5 rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Users
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto border-slate-200/60 shadow-xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Add Payment</CardTitle>
              <CardDescription className="text-blue-100/90 text-sm mt-0.5">
                Process wallet top-ups and assign payments to user accounts.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Pre-fill Alert Banner */}
          {isPrefilled && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Shortcut Active</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Adding payment for User ID: <span className="font-bold">#{formData.transactionReference}</span> (Current Balance: ৳{Number(formData.wallet).toLocaleString()})
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearPrefill}
                className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/50 p-1.5 h-8 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transaction Reference */}
              <div className="space-y-2">
                <Label htmlFor="transactionReference" className="text-slate-700 font-semibold">
                  Transaction Reference (User ID) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    name="transactionReference"
                    onChange={handleInputChange}
                    value={formData.transactionReference}
                    placeholder="e.g. 1001"
                    className="pl-10 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                    required
                    disabled={isPrefilled}
                  />
                </div>
                {isPrefilled && <p className="text-[10px] text-slate-400 italic">Locked from shortcut selection.</p>}
              </div>

              {/* Current Wallet Balance */}
              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-slate-700 font-semibold">
                  Current Wallet Balance <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    name="wallet"
                    onChange={handleInputChange}
                    value={formData.wallet}
                    placeholder="Current Balance before credit"
                    className="pl-10 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                    required
                    disabled={isPrefilled}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transaction ID */}
              <div className="space-y-2">
                <Label htmlFor="transactionId" className="text-slate-700 font-semibold">
                  Transaction ID <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    name="transactionId"
                    onChange={handleInputChange}
                    value={formData.transactionId}
                    placeholder="Enter Unique Txn ID"
                    className="pl-10 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Transaction Type */}
              <div className="space-y-2">
                <Label htmlFor="transactionType" className="text-slate-700 font-semibold">
                  Transaction Type <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    name="transactionType"
                    onChange={handleInputChange}
                    value={formData.transactionType}
                    placeholder="e.g. deposit"
                    className="pl-10 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transaction Amount */}
              <div className="space-y-2">
                <Label htmlFor="transactionAmount" className="text-slate-700 font-semibold">
                  Transaction Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    name="transactionAmount"
                    onChange={handleInputChange}
                    value={formData.transactionAmount}
                    placeholder="Amount to Credit"
                    className="pl-10 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Other (Service charges / Adjustments) */}
              <div className="space-y-2">
                <Label htmlFor="others" className="text-slate-700 font-semibold">
                  Other / Notes <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    name="others"
                    onChange={handleInputChange}
                    value={formData.others}
                    placeholder="e.g. Wallet top-up via bKash"
                    className="pl-10 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
                className="text-slate-500 hover:text-slate-700"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 px-8 rounded-xl font-medium transition-all"
              >
                Add Payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePayment;
