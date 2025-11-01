import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * A wrapper component to protect routes based on login status and host status.
 * @param {boolean} isHostRoute - If true, checks if the user has properties (is a Host).
 * @param {React.ReactNode} children - The component to render if authorized.
 */
const ProtectedRoute = ({ children, isHostRoute = false }) => {
    // Get authentication state from Redux
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    
    // 1. LOGIN CHECK
    // If no token or user data, redirect to the login page (applies to all protected routes)
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. HOST AUTHORIZATION CHECK
    if (isHostRoute) {
        // Check if user has properties listed (i.e., is a host)
        const isHost = user.propertyList && user.propertyList.length > 0;
        
        if (!isHost) {
            // If they are not a host, redirect them to the home page.
            // I use the home page instead of /create-listing to be less aggressive.
            return <Navigate to="/" replace />; 
        }
    }

    // If all checks pass (Logged in, and Host status meets requirement), render the page
    return children;
};

export default ProtectedRoute;