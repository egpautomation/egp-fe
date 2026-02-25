import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/provider/AuthProvider";
import axiosInstance from "@/lib/axiosInstance";
import { User, Mail, Phone, Calendar, Loader2, MapPin, MessageCircle, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formateDate";

const Profile = () => {
    const authContext = useContext(AuthContext) as any;
    const user = authContext?.user;
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Using `phone` and `whatsApp` depending on the object shape we saw
    // in the JSON provided (e.g. `profileData.phone`, `profileData.whatsApp`, `profileData.address`, `profileData.district`)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.email) return;
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/user/get-single-user`, {
                    params: { email: user.email },
                });
                if (res?.data?.success) {
                    setProfileData(res.data.data);
                } else {
                    setError("Failed to load profile data");
                }
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
                <span className="ml-2 text-lg">Loading Profile...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-red-500 font-semibold bg-red-50 p-4 rounded-md border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                No profile data found.
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">User Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 border-t-4 border-t-primary shadow-md">
                    <CardContent className="pt-8 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary relative shadow-sm">
                            <span className="text-4xl font-bold">{profileData.name?.[0]?.toUpperCase() || profileData.email?.[0]?.toUpperCase()}</span>
                        </div>
                        <h2 className="text-xl font-bold text-center text-slate-800">{profileData.name || "N/A"}</h2>
                        <p className="text-slate-500 text-sm">{profileData.role || "User"}</p>
                        <div className="mt-6 w-full pt-4 border-t border-slate-100 flex justify-center">
                            <span className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-xs">Active Account</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2 shadow-md">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
                        <CardTitle className="text-lg font-medium text-slate-700 flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="bg-primary/5 p-2 rounded-full mt-1">
                                <Mail className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email Address</p>
                                <p className="font-medium text-slate-800">{profileData.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="bg-primary/5 p-2 rounded-full mt-1">
                                <Phone className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Contact Number</p>
                                <p className="font-medium text-slate-800">{profileData.phone || profileData.phoneNumber || "Not Provided"}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="bg-primary/5 p-2 rounded-full mt-1">
                                <MessageCircle className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">WhatsApp</p>
                                <p className="font-medium text-slate-800">{profileData.whatsApp || "Not Provided"}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="bg-primary/5 p-2 rounded-full mt-1">
                                <MapPin className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Address</p>
                                <p className="font-medium text-slate-800 break-words">{profileData.address || "Not Provided"}</p>
                                {profileData.district && (
                                    <p className="text-sm text-slate-600 mt-1">District: {profileData.district}</p>
                                )}
                            </div>
                        </div>

                        {profileData.wallet && (
                            <div className="flex gap-4 items-start">
                                <div className="bg-primary/5 p-2 rounded-full mt-1">
                                    <Wallet className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Wallet Balance</p>
                                    <p className="font-medium text-slate-800">
                                        ৳ {profileData.wallet.balance?.toLocaleString() ?? "0"}
                                        {profileData.wallet.coins !== undefined && (
                                            <span className="ml-2 text-sm text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
                                                {profileData.wallet.coins} Coins
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 items-start">
                            <div className="bg-primary/5 p-2 rounded-full mt-1">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Member Since</p>
                                <p className="font-medium text-slate-800">
                                    {profileData.createdAt ? formatDate(profileData.createdAt, "dd MMM, yyyy") : "N/A"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
