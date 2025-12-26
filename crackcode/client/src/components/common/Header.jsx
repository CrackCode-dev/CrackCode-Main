import React from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/crackcode_logo.png'
import Navbar from './Navbar'
import { Bell , Search, UserCircle} from 'lucide-react';

const Header = ({ variant = "default" }) => {
    const baseStyles = "w-full flex justify-between items-center sm:p-6 fixed top-0 left-0 z-50 ";
    const variants = {
        landing: "h-24 bg-transparent text-white px-10 sm:px-10",
        default: "h-24 bg-transparent backdrop-blur-md shadow-md px-10 sm:px-10",
    };

    const navigate = useNavigate();

    const handleLogoClick = () => {
        if (variant === "landing") {
            // Scroll to top of landing page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Navigate to home page
            navigate('/home');
        }
    };

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
            {variant !== "landing" && (
                <div className='absolute left-1/2 transform -translate-x-1/2'>
                    <Navbar />
                </div>
            )}

            {/* Empty div for balance (optional - for future right-side content like profile icon) */}
            {variant !== "landing" && (
                <div className='flex items-center'>
                    {/* Search Bar */}
                    <input type="text" placeholder='Search Cases...' className='w-30 bg-orange-950 text-white text-sm rounded-md px-2 py-1 
                    focus:outline-none focus:ring-1 focus:ring-orange-600 focus:w-40 transition-all duration-300 ease-in-out'/>

                    {/* Notifications */}
                    <Bell className='ml-6 w-6 h-6 text-white hover:text-orange-500 transition-colors duration-300' />

                    {/* Gamer Profile Avatar*/}
                    <div className='ml-6' >
                        {userAvatar ? (
                            <img src={userAvatar} alt="User Profile" className='w-10 rounded-full border-2 border-white/30 hover:border-orange-500 transition-colors object-cover ' />
                        ) : (
                            <UserCircle size={25} className='text-white hover:text-orange-500 transition-colors'/>
                        )}
                        
                    </div>
                    
                </div>
            )}

        </div>

    </header>
  )
}

export default Header