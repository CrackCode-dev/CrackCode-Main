import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/crackcode_logo.png'
import Navbar from './Navbar'
import { Bell , Search, UserCircle} from 'lucide-react';
import Avatar from './Avatar';

const Header = ({ variant = "default" }) => {
    const baseStyles = "w-full flex justify-between items-center sm:p-6 fixed top-0 left-0 z-50 ";
    const variants = {
        landing: "h-24 bg-transparent text-white px-10 sm:px-10",
        default: "h-24 bg-transparent backdrop-blur-md shadow-md px-10 sm:px-10",
    };

    const navigate = useNavigate();
    const location = useLocation();

    const hideHeaderActions = ['/', '/login','/email-verify', '/reset-password', '/gamer-profile'];
    const showHeaderActions = !hideHeaderActions.includes(location.pathname);

    const isLanding = location.pathname === '/';

    const handleLogoClick = () => {
        if (!showHeaderActions) {
            navigate('/');
        } else {
            // Navigate to home page
            navigate('/home');
        }
    };

    const handleNotificationsClick = () => {
        navigate('/gamer-profile');
    }

    const userAvatar = null; // Replace with actual user avatar URL when available
  return (
    <header className={`${baseStyles} ${variants[variant]}`}>
        <div className='flex w-full items-center justify-between relative'>

            {/* Logo */}
            <div className='cursor-pointer' onClick={handleLogoClick}>
                <img 
                    src={logo} 
                    alt="CrackCode Logo" 
                    className='w-20 transition-transform hover:scale-105 duration-300'
                />
            </div>

            {/* Navbar */}
            {showHeaderActions && (
                <div className='absolute left-1/2 transform -translate-x-1/2'>
                    <Navbar />
                </div>
            )}

            {/* Empty div for balance (optional - for future right-side content like profile icon) */}
            {showHeaderActions && (
                <div className='flex items-center'>
                    {/* Search Bar */}
                    <input type="text" placeholder='Search Cases...' className='w-30 bg-orange-950 text-white text-sm rounded-md px-2 py-1 
                    focus:outline-none focus:ring-1 focus:ring-orange-600 focus:w-40 transition-all duration-300 ease-in-out'/>

                    {/* Notifications */}
                    <Bell className='ml-6 w-6 h-6 text-white hover:text-orange-500 transition-colors duration-300' 
                    onClick={handleNotificationsClick}/>

                    {/* Gamer Profile Avatar*/}
                    <div className='ml-6' >
                        <Avatar />
                        
                    </div>
                    
                </div>
            )}

        </div>

    </header>
  )
}

export default Header