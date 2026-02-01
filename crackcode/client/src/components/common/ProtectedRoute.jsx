import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContent } from '../../context/userauth/authenticationContext';

/**
 * ProtectedRoute - Wraps routes that require authentication
 * 
 * @param {boolean} requireVerified - If true, also requires email verification
 */
function ProtectedRoute({ children, requireVerified = true }) {
    const { isLoggedIn, userData, isLoading } = useContext(AppContent);

    // Still checking auth status - show loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but not verified (and verification is required)
    if (requireVerified && userData && !userData.isAccountVerified) {
        return <Navigate to="/verify-account" replace />;
    }

    // All checks passed - render the protected content
    return children;
}

export default ProtectedRoute;