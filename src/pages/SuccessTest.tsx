// @ts-nocheck
import { useContext } from "react";
import { AuthContext } from "@/provider/AuthProvider";

const SuccessTest = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <h1 className="text-3xl font-bold text-red-600">Not Logged In</h1>
            </div>
        );
    }

    return (
        <div className="h-screen flex items-center justify-center bg-green-50">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold text-green-600 mb-4">Success</h1>
                <p className="text-gray-600">You are securely logged in as: <span className="font-semibold">{user.email || user.username}</span></p>
            </div>
        </div>
    );
};

export default SuccessTest;
