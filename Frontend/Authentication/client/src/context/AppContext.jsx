
import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
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
            const { data } = await axios.post(backendUrl + '/api/auth/is-auth')
            if (data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data')
            if (data.success) {
                setUserData(data.data) // Stores user info (name, email, isVerified)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
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