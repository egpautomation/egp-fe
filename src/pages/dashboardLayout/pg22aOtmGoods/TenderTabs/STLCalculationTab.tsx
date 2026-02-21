import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-hot-toast';
import { patchData } from '@/lib/updateData';

// TypeScript interfaces matching backend contract
interface Bidder {
    name: string;
    price: string;
    qualified: boolean;
}


interface CalculationResults {
    xi: string;
    x_nppi: string;
    wa: string;
    sd: string;
    slt: string;
    winner: string;
    winnerPrice: number | 'None';
    bidderStats: {
        isAbove110: boolean;
        isResponsive: boolean;
        rank: number | '-';
    }[];
}

export const STLCalculationTab = () => {
    const [xoce, setXoce] = useState('100');
    const [priceIndex, setPriceIndex] = useState('0.9168');
    const [bidders, setBidders] = useState<Bidder[]>([
        { name: 'Hassan Techno Builders Ltd.', price: '75', qualified: true },

    ]);
    const [results, setResults] = useState<CalculationResults | { error: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [storedDataId, setStoredDataId] = useState<string | null>(null);
    const [tenderId, setTenderId] = useState<string | null>(null);

    const addBidder = () => {
        setBidders([...bidders, { name: '', price: '', qualified: true }]);
    };

    const removeBidder = (index: number) => {
        if (bidders.length > 1) {
            setBidders(bidders.filter((_, i) => i !== index));
        }
    };

    const updateBidder = (index: number, field: keyof Bidder, value: any) => {
        const updated = [...bidders];
        updated[index] = { ...updated[index], [field]: value };
        setBidders(updated);
    };

    // Handle PDF file upload and extract bidder data
    const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file only');
            return;
        }

        // Validate file size (max 10MB - matches backend limit)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size should be less than 10MB');
            return;
        }

        setIsUploading(true);
        setUploadedFileName(file.name);
        setTenderId(null);

        try {
            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('pdfFilename', file.name);

            const costVal = parseFloat(xoce) || 0;
            const indexVal = parseFloat(priceIndex) || 0;

            formData.append('estimateCost', String(costVal));
            formData.append('officialCost', String(costVal));
            formData.append('xoce', String(costVal));
            formData.append('priceIndex', String(indexVal));

            const url = `/stl/parse-pdf?pdfFilename=${encodeURIComponent(file.name)}&estimateCost=${costVal}&officialCost=${costVal}&xoce=${costVal}&priceIndex=${indexVal}`;

            console.log("PDF Uploading to:", url);
            const response = await axiosInstance.post<any>(url, formData, {
                headers: { 'X-PDF-Filename': file.name },
            });

            console.log("PDF Upload Success Response:", response.data);

            if (response.data?.success) {
                const responseData = response.data.data;
                const extractedBidders = responseData?.bidders || [];

                // Broad ID extraction
                const dataId = responseData?.storedDataId || responseData?._id || responseData?.id || responseData?.data?._id;
                if (dataId) setStoredDataId(dataId);

                if (responseData?.tenderId) setTenderId(responseData.tenderId);

                if (extractedBidders.length > 0) {
                    const formattedBidders = extractedBidders.map((b: any) => ({
                        name: b.name || b.tendererName || '',
                        price: String(b.price || b.finalPrice || b.quotedAmount || b.totalAmount || ''),
                        qualified: true
                    }));
                    setBidders(formattedBidders);
                    toast.success(`Extracted ${formattedBidders.length} bidder(s)`);
                } else {
                    toast.error('No bidders found in PDF.');
                }
            } else {
                toast.error(response.data?.message || 'Failed to parse PDF');
            }
        } catch (error: any) {
            console.error('PDF Upload Error:', error);
            const serverData = error.response?.data;
            const errorMsg = serverData?.message || serverData?.error || error.message || 'Error processing PDF';
            toast.error(errorMsg);
        } finally {
            setIsUploading(false);
            if (event.target) event.target.value = '';
        }
    };

    const handleCalculate = async () => {
        const xoceValue = parseFloat(xoce) || 100;
        const priceIndexValue = parseFloat(priceIndex) || 0.9168;
        const x_nppi = xoceValue * priceIndexValue;

        const prices: number[] = [];
        bidders.forEach(bidder => {
            if (bidder.qualified) {
                const price = parseFloat(bidder.price);
                if (!isNaN(price)) {
                    prices.push(price);
                }
            }
        });

        if (prices.length === 0) {
            setResults({ error: 'No valid qualified bids entered.' });
            return;
        }

        const n = prices.length;
        const total = prices.reduce((sum, p) => sum + p, 0);
        const xi = total / n;
        const wa = (xoceValue * 0.2) + (xi * 0.5) + (x_nppi * 0.3);
        const variance = prices.reduce((sum, p) => sum + Math.pow(p - wa, 2), 0) / n;
        const sd = Math.sqrt(variance);
        const slt = wa - sd;

        const bidderStats = bidders.map((bidder) => {
            const price = parseFloat(bidder.price);
            const isAbove110 = !isNaN(price) && !isNaN(xoceValue) && price > (xoceValue * 1.1);
            const isResponsive = bidder.qualified && !isNaN(price) && price >= slt && !isAbove110;

            return {
                isAbove110,
                isResponsive,
                rank: '-' as number | '-'
            };
        });

        const responsiveBidders = bidderStats
            .map((stats, index) => ({ stats, index, price: parseFloat(bidders[index].price) }))
            .filter(item => item.stats.isResponsive)
            .sort((a, b) => a.price - b.price);

        responsiveBidders.forEach((item, i) => {
            bidderStats[item.index].rank = i + 1;
        });

        const winnerBid = responsiveBidders.length > 0 ? responsiveBidders[0] : null;
        let winnerName = 'None';
        let winnerPrice: number | 'None' = 'None';

        if (winnerBid) {
            winnerName = bidders[winnerBid.index].name;
            winnerPrice = winnerBid.price;
        }

        setResults({
            xi: xi.toFixed(4),
            x_nppi: x_nppi.toFixed(4),
            wa: wa.toFixed(4),
            sd: sd.toFixed(4),
            slt: slt.toFixed(4),
            winner: winnerName,
            winnerPrice: winnerPrice,
            bidderStats
        });

        if (storedDataId) {
            const bidderPayload = bidders.map(b => ({
                name: b.name,
                price: parseFloat(b.price) || 0,
                finalPrice: parseFloat(b.price) || 0,
                quotedAmount: parseFloat(b.price) || 0,
                qualified: b.qualified
            }));

            const payload = {
                tenderId: tenderId,
                officialCost: parseFloat(xoce) || 0,
                estimatedCost: parseFloat(xoce) || 0,
                estimateCost: parseFloat(xoce) || 0,
                xoce: parseFloat(xoce) || 0,
                priceIndex: parseFloat(priceIndex) || 0,
                bidders: bidderPayload,
                xi: parseFloat(xi.toFixed(4)),
                wa: parseFloat(wa.toFixed(4)),
                sd: parseFloat(sd.toFixed(4)),
                slt: parseFloat(slt.toFixed(4)),
                winner: winnerName,
                winnerPrice: winnerPrice === 'None' ? 0 : parseFloat(String(winnerPrice))
            };

            console.log("STL Payload being sent to:", `/stl/${storedDataId}`, payload);
            patchData(`/stl/${storedDataId}`, payload, undefined, undefined);
        }
    };

    const calculateDifference = (priceStr: string) => {
        const price = parseFloat(priceStr);
        const xoceVal = parseFloat(xoce);
        if (isNaN(price) || isNaN(xoceVal) || xoceVal === 0) return '-';
        const diff = ((price - xoceVal) / xoceVal) * 100;
        return diff.toFixed(2) + '%';
    };

    return (
        <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">
                        PPR 2025 Tender Calculation Sheet
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-3 sm:p-4 md:p-6 space-y-6">
                    {/* Input Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* XOCE Input */}
                        <div className="space-y-2">
                            <Label htmlFor="xoce" className="text-sm font-semibold text-gray-700">
                                Official Approved Cost Estimate (XOCE):
                            </Label>
                            <Input
                                id="xoce"
                                type="number"
                                step="0.01"
                                value={xoce}
                                onChange={(e) => setXoce(e.target.value)}
                                className="text-lg font-medium"
                                placeholder="Enter XOCE"
                            />
                        </div>

                        {/* Price Index Input */}
                        <div className="space-y-2">
                            <Label htmlFor="priceIndex" className="text-sm font-semibold text-gray-700">
                                Price Index (e.g., 0.9168):
                            </Label>
                            <Input
                                id="priceIndex"
                                type="number"
                                step="0.0001"
                                value={priceIndex}
                                onChange={(e) => setPriceIndex(e.target.value)}
                                className="text-lg font-medium"
                                placeholder="Enter Price Index"
                            />
                        </div>
                    </div>

                    {/* PDF Upload Section */}
                    <div className="space-y-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                                Upload PDF to Extract Bidder Data
                            </h3>
                            <p className="text-sm text-gray-600">
                                Upload a PDF file containing bidder names and prices. The system will automatically extract and populate the data.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Label
                                htmlFor="pdf-upload"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload PDF
                                    </>
                                )}
                            </Label>
                            <Input
                                id="pdf-upload"
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handlePdfUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                            {uploadedFileName && !isUploading && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                                    <FileText className="w-4 h-4 shrink-0" />
                                    <span className="truncate max-w-[180px] sm:max-w-xs">{uploadedFileName}</span>
                                </div>
                            )}
                            {tenderId && (
                                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-semibold border border-green-200 shadow-sm">
                                    Tender ID: {tenderId}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bidders Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base sm:text-xl font-bold text-gray-800">Bidders and Tender Prices</h3>
                            <Button
                                onClick={addBidder}
                                className="flex items-center gap-2 shrink-0"
                                variant="outline"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add Bidder</span>
                                <span className="sm:hidden">Add</span>
                            </Button>
                        </div>

                        {/* Bidders Table — horizontally scrollable on mobile */}
                        <div className="border rounded-lg overflow-x-auto">
                            <table className="w-full min-w-[700px] text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left p-3 font-semibold text-gray-700 text-xs w-[22%]">Name of Tenderer</th>
                                        <th className="text-left p-3 font-semibold text-gray-700 text-xs w-[15%]">Quoted Price (Xi)</th>
                                        <th className="text-center p-3 font-semibold text-gray-700 text-xs w-[9%]">Δ%</th>
                                        <th className="text-center p-3 font-semibold text-gray-700 text-xs w-[16%]">Primary Resp.</th>
                                        <th className="text-center p-3 font-semibold text-gray-700 text-xs w-[16%]">Financial Resp.</th>
                                        <th className="text-center p-3 font-semibold text-gray-700 text-xs w-[10%]">Rank</th>
                                        <th className="text-center p-3 font-semibold text-gray-700 text-xs w-[12%]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {bidders.map((bidder, index) => {
                                        const stats = results && 'bidderStats' in results ? results.bidderStats[index] : null;
                                        return (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-2">
                                                    <Input
                                                        value={bidder.name}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBidder(index, 'name', e.target.value)}
                                                        placeholder="Enter bidder name"
                                                        className="w-full"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={bidder.price}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBidder(index, 'price', e.target.value)}
                                                        placeholder="Price"
                                                        className="w-full"
                                                    />
                                                </td>
                                                <td className="p-2 text-center font-medium text-gray-600 text-xs whitespace-nowrap">
                                                    {calculateDifference(bidder.price)}
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={`q-${index}`}
                                                                checked={bidder.qualified}
                                                                onCheckedChange={(checked) => updateBidder(index, 'qualified', checked)}
                                                            />
                                                            <Label htmlFor={`q-${index}`} className="text-[10px] cursor-pointer">Technical</Label>
                                                        </div>
                                                        {stats?.isAbove110 && (
                                                            <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1 rounded whitespace-nowrap">&gt; 10% OCE</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-2 text-center">
                                                    {stats ? (
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap ${stats.isResponsive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {stats.isResponsive ? 'Responsive' : 'Non-Responsive'}
                                                        </span>
                                                    ) : <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="p-2 text-center font-bold text-blue-600">
                                                    {stats?.rank || '-'}
                                                </td>
                                                <td className="p-2 text-center">
                                                    <Button
                                                        onClick={() => removeBidder(index)}
                                                        variant="destructive"
                                                        size="icon"
                                                        disabled={bidders.length === 1}
                                                        className="h-8 w-8"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            onClick={handleCalculate}
                            size="lg"
                            className="px-12 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                        >
                            Calculate
                        </Button>
                    </div>

                    {/* Results Section */}
                    {results && (
                        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Calculation Results</h3>
                            {'error' in results ? (
                                <p className="text-red-600">{results.error}</p>
                            ) : (
                                <div className="max-w-4xl mx-auto space-y-4">
                                    {/* Input Parameters Table */}
                                    <div className="bg-white rounded-lg border border-gray-300">
                                        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-700">Input Parameters</h4>
                                        </div>
                                        <div className="p-4">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Parameter</th>
                                                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Value</th>
                                                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="py-3 px-4 font-medium text-gray-800">XOCE</td>
                                                        <td className="py-3 px-4">
                                                            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded font-medium">
                                                                {xoce}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">Official Approved Cost Estimate</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-3 px-4 font-medium text-gray-800">Price Index</td>
                                                        <td className="py-3 px-4">
                                                            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded font-medium">
                                                                {priceIndex}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">Market Price Adjustment Factor</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* WA, SD, SLT in Single Row */}
                                    <div className="bg-white rounded-lg border border-gray-300">
                                        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-700">Calculation Results</h4>
                                        </div>
                                        <div className="p-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="text-center p-4 bg-gray-50 rounded border border-gray-200">
                                                    <div className="text-xs text-gray-500 mb-2 font-medium">Weighted Average</div>
                                                    <div className="text-xl font-semibold text-gray-800">{results.wa}</div>
                                                    <div className="text-xs text-gray-400 mt-1">WA</div>
                                                </div>
                                                <div className="text-center p-4 bg-gray-50 rounded border border-gray-200">
                                                    <div className="text-xs text-gray-500 mb-2 font-medium">Standard Deviation</div>
                                                    <div className="text-xl font-semibold text-gray-800">{results.sd}</div>
                                                    <div className="text-xs text-gray-400 mt-1">SD</div>
                                                </div>
                                                <div className="text-center p-4 bg-gray-50 rounded border border-gray-200">
                                                    <div className="text-xs text-gray-500 mb-2 font-medium">Significantly Low Price</div>
                                                    <div className="text-xl font-semibold text-gray-800">{results.slt}</div>
                                                    <div className="text-xs text-gray-400 mt-1">SLT</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Winner Section */}
                                    <div className="bg-white rounded-lg border border-gray-300">
                                        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-700">Winning Bidder</h4>
                                        </div>
                                        <div className="p-4 text-center">
                                            <p className="text-lg font-semibold text-gray-800">
                                                {results.winner}
                                            </p>
                                            {results.winnerPrice !== 'None' && (
                                                <p className="text-base text-gray-600 mt-2">
                                                    Winning Price: <span className="font-medium">{results.winnerPrice}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
