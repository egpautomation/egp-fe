// @ts-nocheck
import { AuthContext } from "@/provider/AuthProvider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (user) {
        if (user.isProfileComplete === false) {
            return <Navigate to="/onboarding" replace />;
        }
        
        // Check if the user's role is in the allowedRoles array
        if (allowedRoles.includes(user.role)) {
            return children; // User has access
        } else {
            // Authenticated but not authorized
            return <Navigate to="/dashboard" replace />;
        }
    } else {
        // Not authenticated
        return <Navigate to="/" replace />;
    }
};

export default RoleRoute;
