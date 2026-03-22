// import React, { Children } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
// import logo from "../../assets/logo/crackcode_logo.svg"
import logo_light from "../../assets/logo/logo_light.png";
import logo_dark from  "../../assets/logo/logo_dark.png";
import { useTheme } from '../../context/theme/ThemeContext'
import logo from "../../assets/logo/crackcode_logo.svg"
import Navbar from './Navbar'
import { Bell, Gamepad2 } from 'lucide-react';
import Avatar from './Avatar';
import HQBtn from './HQBtn';
import BackBtn from './BackBtn';
import Button from '../ui/Button';
import SettingsDropdown from './SettingsDropdown';
import { useState, useEffect } from 'react';

const Header = ({ variant = "default", showBackBtn = true, showHQ = true }) => {
    const { theme } = useTheme()
    const darkThemes = ["dark", "country", "midnight"];
    const activeLogo = darkThemes.includes(theme) ? logo_light : logo_dark;

    const [showGameProfileModal, setShowGameProfileModal] = useState(false);
    const [modalTimer, setModalTimer] = useState(null);
    const baseStyles = "fixed top-0 left-0 w-full flex justify-between items-center z-50";
    
    const variants = {
        landing: "h-20 sm:h-20 bg-transparent px-6 sm:px-10 border-b border-transparent",
        default: "h-20 sm:h-20 backdrop-blur-md shadow-md px-6 sm:px-10 border-b",
        empty: "h-20 sm:h-20 bg-transparent backdrop-blur-md shadow-md px-6 sm:px-10 border-b border-transparent"
    };

    const navigate = useNavigate();
    const location = useLocation();

    const hideAuthHeaderActions = ['/', '/login', '/email-verify', '/reset-password', '/gamer-profile'];
    const hideCorePagesHeaderActions = ['/user-profile'];
    const showHeaderActions = !hideAuthHeaderActions.includes(location.pathname) && !hideCorePagesHeaderActions.includes(location.pathname)
                            && variant !== 'empty'  && variant !== 'landing';

    const isAuth = hideAuthHeaderActions.includes(location.pathname);

    const handleLogoClick = () => {
        if (isAuth) {
            navigate('/');
        } else {
            navigate('/home');
        }
    };

    const handleNotificationsClick = () => {
        // Show the modal
        setShowGameProfileModal(true);
        
        // Clear any existing timer
        if (modalTimer) {
            clearTimeout(modalTimer);
        }
        
        // Auto-close after 1 second
        const timer = setTimeout(() => {
            setShowGameProfileModal(false);
        }, 1000);
        
        setModalTimer(timer);
    }

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (modalTimer) {
                clearTimeout(modalTimer);
            }
        };
    }, [modalTimer]);

    const headerStyle = variant === 'landing' 
        ? {} 
        : {
            background: 'var(--surface)',
            color: 'var(--text)',
            borderColor: 'var(--border)'
          };

    if(variant === 'empty') {
        return (
        <header className={`${baseStyles} ${variants[variant]}`} style={headerStyle}>
            <div className='flex w-full items-center gap-4'>
                {showHQ && <HQBtn />}
                {showBackBtn && <BackBtn />}
            </div>
        </header> 
    )}

    return (
        <>
        <header className={`${baseStyles} ${variants[variant] || variants.default}`} style={headerStyle}>
            <div className='flex w-full items-center justify-between relative'>

                {/* Logo */}
                <div className='cursor-pointer' onClick={handleLogoClick}>
                    <img 
                        src={activeLogo} 
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

                {showHeaderActions && (
                    <div className='flex items-center gap-4'>

                        {/* Games Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                navigate('/home#brain-breaker');
                                setTimeout(() => {
                                    const element = document.getElementById('brain-breaker');
                                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 100);
                            }}
                            className='flex items-center gap-2 text-xs sm:text-sm font-semibold hover:bg-opacity-80'
                            title="Brain Breaker Games"
                        >
                            <Gamepad2 className='w-4 h-4 sm:w-5 sm:h-5' />
                            Games
                        </Button>

                            {/* Settings Dropdown */}
                            <SettingsDropdown />
                            
                            {/* Notification Bell */}
                            <Button variant="ghost" size="icon" onClick={handleNotificationsClick}>
                            <Bell 
                                className='w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 cursor-pointer'
                                style={{ color: 'var(--text)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text)'}
                                onClick={handleNotificationsClick}
                            />
                            </Button>



                    </div>
                )}

            </div>
        </header>

        {/* GameProfile Modal Popup */}
        {showGameProfileModal && (
            <div
                className='fixed inset-0 z-50 flex items-center justify-center'
                style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    animation: 'fadeIn 0.3s ease-in-out'
                }}
            >
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes fadeOut {
                        from { opacity: 1; transform: scale(1); }
                        to { opacity: 0; transform: scale(0.95); }
                    }
                `}</style>
                <div
                    className='rounded-lg shadow-2xl p-8 w-96 max-h-96 overflow-y-auto'
                    style={{
                        background: 'var(--surface)',
                        border: '2px solid var(--brand)',
                        color: 'var(--text)',
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}
                >
                    <div className='text-center'>
                        <h2 className='text-2xl font-bold mb-2'>Complete Your Profile</h2>
                        <p style={{ color: 'var(--textSec)' }} className='text-sm mb-6'>
                            Set up your avatar and username to get started!
                        </p>
                        
                        <div className='flex justify-center mb-6'>
                            <Avatar showClick={false} className='w-20 h-20 rounded-full border-4' style={{ borderColor: 'var(--brand)' }} />
                        </div>
                        
                        <p className='text-sm font-semibold mb-4'>
                            🎮 Ready to complete your profile?
                        </p>
                        
                        <button
                            onClick={() => {
                                navigate('/gamer-profile');
                                setShowGameProfileModal(false);
                            }}
                            className='w-full py-3 rounded-lg font-bold transition-all'
                            style={{
                                background: 'var(--brand)',
                                color: 'white'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                            Go to Profile Setup
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
};

export default Header