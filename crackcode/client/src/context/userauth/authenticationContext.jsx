import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AppContent = createContext()

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true; // IMPORTANT: Allows cookies to be sent

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false) // Fixed typo from userDate

    // Function to check auth status and get user data
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`,{
                withCredentials: true
            });

            if (data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            // Silent fail - user is simply not logged in
            console.log('Not authenticated');
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`,{
                withCredentials: true
            });
            
            if (data.success) {
                setUserData(data.data) // Stores user info (name, email, isVerified)
            }
        } catch (error) {
            // Silent fail - expected when not logged in
            console.log('Could not fetch user data');
        }
    }

    // Run whenever the app loads
    useEffect(() => {
        getAuthState();
    }, [])

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}