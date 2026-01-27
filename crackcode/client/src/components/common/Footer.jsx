import React from 'react'
import logo from "../../assets/logo/crackcode_logo.svg"
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const Footer = ({ variant = "default" }) => {
    const baseStyles = "w-full flex justify-between items-center "

    const variants = {
        landing: "fixed bottom-0 left-0 z-50 bg-transparent h-18 px-10",
        default: "h-18 bg-black backdrop-blur-md shadow-md px-10 sm:px-10 border-t border-white/10"
    }

    const navigate = useNavigate();
    const location = useLocation();

    const footerAtBottom = ['/', '/login', 'email-verify', 'reset-password', '/gamer-profile']
    const footerAtEase = !footerAtBottom.includes(location.pathname);
    
    const isLanding = location.pathname === '/';
    const handleLogoClick = () => {
        if(!footerAtEase) {
            navigate('/');
        } else {
            navigate('/home');
        }
    }

    return (
    <footer className={`${baseStyles} ${variants[variant]}`}>
        {/* Logo */}
        <div className='cursor-pointer'>
            <img 
                src={logo} 
                alt="CrackCode Logo" 
                onClick={handleLogoClick}
                className='w-15 transition-transform hover:scale-105 duration-300'
            />
        </div>

        {/* Copyright */}
        <div className='absolute left-1/2 transform -translate-x-1/2'>
            <p className='text-white text-sm'>&copy; {new Date().getFullYear()} CrackCode. All rights reserved.</p>
        </div>

        {/* Footer links */}
        <div className='flex space-x-6 font-medium'>
            <a href="/privacy" className='text-white hover:text-orange-500 transition-colors duration-300 text-sm'>Privacy Policy</a>
            <a href="/terms" className='text-white hover:text-orange-500 transition-colors duration-300 text-sm'>Terms of Service</a>
            <a href="/contact" className='text-white hover:text-orange-500 transition-colors duration-300 text-sm'>Contact Us</a>
        </div>

    </footer>
    )
}


    

  

export default Footer
