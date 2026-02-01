import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import logo from "../../assets/logo/crackcode_logo.svg"
import Navbar from './Navbar'
import { Bell, Search, UserCircle } from 'lucide-react';
import Avatar from './Avatar';

const Header = ({ variant = "default" }) => {
    // Base styles with fixed positioning
    const baseStyles = "w-full flex justify-between items-center fixed top-0 left-0 z-50";
    
    // Variant styles
    const variants = {
        landing: "h-20 sm:h-24 bg-transparent text-white px-6 sm:px-10",
        default: "h-20 sm:h-20 bg-transparent backdrop-blur-md shadow-md px-6 sm:px-10 border-b border-white/10",
    };

    const navigate = useNavigate();
    const location = useLocation();

    const hideAuthHeaderActions = ['/', '/login', '/email-verify', '/reset-password', '/gamer-profile'];
    const hideCorePagesHeaderActions = ['/user-profile'];
    const showHeaderActions = !hideAuthHeaderActions.includes(location.pathname) && !hideCorePagesHeaderActions.includes(location.pathname);

    const isAuth = hideAuthHeaderActions.includes(location.pathname);

    const handleLogoClick = () => {
        if (isAuth) {
            navigate('/');
        } else {
            navigate('/home');
        }
    };

    const handleNotificationsClick = () => {
        navigate('/gamer-profile');
    }

    const userAvatar = null;

    return (
        <header className={`${baseStyles} ${variants[variant]}`}>
            <div className='flex w-full items-center justify-between relative'>
                {/* Logo */}
                <div className='cursor-pointer' onClick={handleLogoClick}>
                    <img 
                        src={logo} 
                        alt="CrackCode Logo" 
                        className='w-16 sm:w-20 transition-transform hover:scale-105 duration-300'
                    />
                </div>

                {/* Navbar */}
                {showHeaderActions && (
                    <div className='absolute left-1/2 transform -translate-x-1/2 hidden md:block'>
                        <Navbar />
                    </div>
                )}

                {/* Header Actions */}
                {showHeaderActions && (
                    <div className='flex items-center gap-4 sm:gap-6'>
                        {/* Search Bar */}
                        <input 
                            type="text" 
                            placeholder='Search Cases...' 
                            className='w-24 sm:w-32 bg-orange-950 text-white text-xs sm:text-sm rounded-md px-2 py-1 
                            focus:outline-none focus:ring-1 focus:ring-orange-600 focus:w-32 sm:focus:w-40 
                            transition-all duration-300 ease-in-out'
                        />

                        {/* Notifications */}
                        <Bell 
                            className='w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-orange-500 transition-colors duration-300 cursor-pointer' 
                            onClick={handleNotificationsClick}
                        />

                        {/* Gamer Profile Avatar */}
                        <div>
                            <Avatar />
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header