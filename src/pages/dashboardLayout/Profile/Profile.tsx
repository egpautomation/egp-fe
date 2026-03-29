import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/provider/AuthProvider";
import axiosInstance from "@/lib/axiosInstance";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
  MapPin,
  MessageCircle,
  Wallet,
  Edit,
  Save,
  Camera,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formateDate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown } from "lucide-react";
import districts from "@/utils/districts";
import { cn } from "@/lib/utils";
import { setUserData } from "@/lib/authService";
import toast from "react-hot-toast";

const Profile = () => {
  const authContext = useContext(AuthContext) as any;
  const user = authContext?.user;
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDistrictPopoverOpen, setIsDistrictPopoverOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userId: null as number | null,
    phone: "",
    whatsApp: "",
    address: "",
    district: "",
    profile: "", // Image URL
  });

  const fetchProfile = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/user/get-single-user`, {
        params: { email: user.email },
      });
      if (res?.data?.success) {
        const data = res.data.data;
        setProfileData(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          userId: data.userId || null,
          phone: data.phone || data.phoneNumber || "",
          whatsApp: data.whatsApp || "",
          address: data.address || "",
          district: data.district || "",
          profile: data.profile || "",
        });
      } else {
        setError("Failed to load profile data");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);

      // Exclude userId because the live server's strict validation rejects it
      const { userId, ...rest } = formData as any;

      // Exclude any strictly empty strings to bypass strict validation on current live server
      // (Joi rejects "" by default for optional string fields)
      const payload = Object.fromEntries(Object.entries(rest).filter(([_, value]) => value !== ""));

      const res = await axiosInstance.put(`/user/update-user`, payload);
      if (res.data?.success) {
        toast.success("Profile updated successfully!");
        setIsEditModalOpen(false);
        fetchProfile(); // Refresh local data

        // Update global state and localStorage
        const updatedUser = { ...authContext.user, ...payload };
        if (authContext.setUser) {
          authContext.setUser(updatedUser);
        }
        setUserData(updatedUser);
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

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
      <div className="flex justify-center items-center min-h-[50vh]">No profile data found.</div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-3xl font-bold text-slate-800">User Profile</h1>
        <Button
          onClick={() => setIsEditModalOpen(true)}
          variant="outline"
          className="flex items-center gap-2 border-primary text-primary hover:bg-primary/5"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-t-4 border-t-primary shadow-md">
          <CardContent className="pt-8 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary relative shadow-sm overflow-hidden border-2 border-primary/20">
              {profileData.profile ? (
                <img
                  src={profileData.profile}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">
                  {profileData.name?.[0]?.toUpperCase() || profileData.email?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-center text-slate-800">
              {profileData.name || "N/A"}
            </h2>
            <p className="text-slate-500 text-sm">{profileData.role || "User"}</p>
            <div className="mt-6 w-full pt-4 border-t border-slate-100 flex justify-center">
              <span className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-xs">
                Active Account
              </span>
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
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Email Address
                </p>
                <p className="font-medium text-slate-800">{profileData.email}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary/5 p-2 rounded-full mt-1">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Contact Number
                </p>
                <p className="font-medium text-slate-800">
                  {profileData.phone || profileData.phoneNumber || "Not Provided"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary/5 p-2 rounded-full mt-1">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  WhatsApp
                </p>
                <p className="font-medium text-slate-800">
                  {profileData.whatsApp || "Not Provided"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary/5 p-2 rounded-full mt-1">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Address
                </p>
                <p className="font-medium text-slate-800 break-words">
                  {profileData.address || "Not Provided"}
                </p>
                {profileData.district && (
                  <p className="text-sm text-slate-600 mt-1 font-medium">
                    District: <span className="text-slate-800">{profileData.district}</span>
                  </p>
                )}
              </div>
            </div>

            {profileData.wallet && (
              <div className="flex gap-4 items-start">
                <div className="bg-primary/5 p-2 rounded-full mt-1">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Wallet Balance
                  </p>
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
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Member Since
                </p>
                <p className="font-medium text-slate-800">
                  {profileData.createdAt
                    ? formatDate(profileData.createdAt, "dd MMM, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-6 text-white text-left">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit className="h-6 w-6" />
              Edit Your Profile
            </DialogTitle>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Update your personal details below. Your email and role cannot be changed.
            </p>
          </DialogHeader>

          <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="border-slate-200 focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district" className="text-slate-700 font-semibold">
                  District
                </Label>
                <Popover open={isDistrictPopoverOpen} onOpenChange={setIsDistrictPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isDistrictPopoverOpen}
                      className="w-full justify-between border-slate-200 hover:bg-slate-50 text-slate-700 font-normal"
                    >
                      {formData.district
                        ? districts.find((d) => d === formData.district)
                        : "Select District..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search district..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No district found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {districts.map((district) => (
                            <CommandItem
                              key={district}
                              value={district}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  district: district === formData.district ? "" : district,
                                }));
                                setIsDistrictPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.district === district ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {district}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-semibold">
                  Contact Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 01700000000"
                  className="border-slate-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsApp" className="text-slate-700 font-semibold">
                  WhatsApp Number
                </Label>
                <Input
                  id="whatsApp"
                  name="whatsApp"
                  value={formData.whatsApp}
                  onChange={handleInputChange}
                  placeholder="e.g. 01700000000"
                  className="border-slate-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="profile"
                className="text-slate-700 font-semibold flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Profile Image URL
              </Label>
              <Input
                id="profile"
                name="profile"
                value={formData.profile}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="border-slate-200 focus:border-primary focus:ring-primary/20"
              />
              <p className="text-[10px] text-slate-500 italic">
                Provide a direct link to your profile picture.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-700 font-semibold">
                Full Address
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your full address"
                className="min-h-[80px] border-slate-200 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateLoading}
                className="bg-primary hover:bg-primary/90 text-white min-w-[120px] shadow-lg shadow-primary/20"
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
