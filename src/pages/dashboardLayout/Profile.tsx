// @ts-nocheck
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/provider/AuthProvider";
import { motion } from "framer-motion";
import { Mail, User, Lock, Shield } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [changingPassword, setChangingPassword] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        // Validation
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            setChangingPassword(true);
            const response = await fetch(
                `${config.apiBaseUrl}/user/change-password`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user?.email,
                        oldPassword: passwordData.oldPassword,
                        newPassword: passwordData.newPassword,
                    }),
                }
            );

            const result = await response.json();

            if (result?.success) {
                toast.success("Password changed successfully!");
                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(result?.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("An error occurred while changing password");
        } finally {
            setChangingPassword(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <motion.div
                className="max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Profile
                    </h1>
                    <p className="text-gray-600">Manage your account information and settings</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Header Card */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-none shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-t-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 backdrop-blur-sm h-16 w-16 rounded-full flex items-center justify-center">
                                            <span className="text-3xl font-bold">
                                                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl text-white">
                                                {user?.name || "User"}
                                            </CardTitle>
                                            <CardDescription className="text-violet-100 flex items-center gap-2 mt-1">
                                                <Mail size={16} />
                                                {user?.email}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </motion.div>

                        {/* Password Change Section */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-none shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="text-violet-600" size={20} />
                                        Change Password
                                    </CardTitle>
                                    <CardDescription>Update your password to keep your account secure</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="oldPassword">Current Password</Label>
                                            <Input
                                                id="oldPassword"
                                                type="password"
                                                placeholder="Enter current password"
                                                value={passwordData.oldPassword}
                                                onChange={(e) =>
                                                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                                                }
                                                className="border-gray-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                placeholder="Enter new password"
                                                value={passwordData.newPassword}
                                                onChange={(e) =>
                                                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                                                }
                                                className="border-gray-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) =>
                                                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                                }
                                                className="border-gray-300"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                                            disabled={changingPassword}
                                        >
                                            {changingPassword ? "Changing Password..." : "Change Password"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column - Account Details */}
                    <div className="space-y-6">
                        {/* Account Info Card */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-none shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="text-violet-600" size={20} />
                                        Account Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-gray-600 text-sm">User ID</Label>
                                        <p className="font-mono font-semibold text-gray-800">
                                            #{user?.userId || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-600 text-sm">Role</Label>
                                        <p className="font-semibold text-gray-800 capitalize">
                                            {user?.role || "User"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
