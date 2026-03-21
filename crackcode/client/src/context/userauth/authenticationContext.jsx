import { createContext, useEffect, useState } from "react";
import api from "../../api/axios";

export const AppContent = createContext()

export const AppContextProvider = (props) => {

    api.defaults.withCredentials = true; // IMPORTANT: Allows cookies to be sent

    // Prefer explicit Vite backend URL, fall back to legacy VITE_API_URL or the axios instance baseURL
    const envBackend = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
    // Derive fallback from central axios instance if available (removes trailing /api)
    const axiosBase = api?.defaults?.baseURL || '';
    const inferredBackend = axiosBase ? axiosBase.replace(/\/api$/, '') : '';
    const backendUrl = envBackend || inferredBackend || '';
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false) // Fixed typo from userDate

    // Helper function to set authorization header from stored token
    const setAuthHeader = () => {
        const storedToken = typeof window !== 'undefined' && localStorage.getItem('accessToken');
        if (storedToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            return true;
        }
        delete api.defaults.headers.common['Authorization'];
        return false;
    };

    // Function to check auth status and get user data
    const getAuthState = async () => {
        try {
            const { data } = await api.get('/auth/is-auth',{
                timeout: 5000 // 5 second timeout
            });

            if (data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            // Silent fail - user is simply not logged in or backend unavailable
            // This allows the app to render even if backend is down
            setIsLoggedIn(false)
            setUserData(false)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await api.get('/user/data',{
                timeout: 5000 // 5 second timeout
            });
            
            if (data.success) {
                setUserData(data.data) // Stores user info (name, email, isVerified)
            }
        } catch (error) {
            // Silent fail - expected when not logged in or backend unavailable
            setUserData(false)
        }
    }

    // Run whenever the app loads - ensure auth state is restored from localStorage
    useEffect(() => {
        setAuthHeader();  // First, restore auth header from localStorage
        getAuthState();   // Then check auth status
    }, []);

    // Listen for token changes in localStorage (e.g., login happens somewhere)
    // This ensures all components immediately sync when login occurs
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleStorageChange = (e) => {
            if (e.key === "accessToken") {
                console.log("🔄 Token changed, syncing auth state...");
                setAuthHeader();  // Update axios header
                getAuthState();   // Re-check auth status (will call getUserData if logged in)
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Listen for solution submissions to refresh user data globally
    useEffect(() => {
        if (!isLoggedIn || !backendUrl) return;

        const handleSolutionSubmitted = async (event) => {
            console.log('👤 Solution submitted - refreshing global user data...', event.detail);
            try {
                await getUserData();
                console.log('✅ User data refreshed');
            } catch (err) {
                console.error('❌ Error refreshing user data:', err);
            }
        };

        // Add event listener using standard event name (lowercase, no 'on' prefix)
        window.addEventListener('solutionSubmitted', handleSolutionSubmitted);

        // Cleanup: remove event listener when component unmounts
        return () => {
            window.removeEventListener('solutionSubmitted', handleSolutionSubmitted);
        };
    }, [isLoggedIn, backendUrl]);

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        setAuthHeader
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}