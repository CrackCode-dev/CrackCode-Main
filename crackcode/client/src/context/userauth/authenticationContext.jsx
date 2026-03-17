import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AppContent = createContext()

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true; // IMPORTANT: Allows cookies to be sent

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false) // Fixed typo from userDate

    // Helper function to set authorization header from stored token
    const setAuthHeader = () => {
        const storedToken = typeof window !== 'undefined' && localStorage.getItem('accessToken');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            return true;
        }
        delete axios.defaults.headers.common['Authorization'];
        return false;
    };

    // Function to check auth status and get user data
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`,{
                withCredentials: true,
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
            const { data } = await axios.get(`${backendUrl}/api/user/data`,{
                withCredentials: true,
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
    }, [])

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