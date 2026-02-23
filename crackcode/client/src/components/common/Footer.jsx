import React from 'react'
// import logo from "../../assets/logo/crackcode_logo.svg"
import logo_light from "../../assets/logo/logo_light.png";
import logo_dark from  "../../assets/logo/logo_dark.png";
import { useTheme } from '../../context/theme/ThemeContext'
import logo from "../../assets/logo/crackcode_logo.svg"
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const Footer = ({ variant = "default" }) => {
    const { theme } = useTheme()
    const baseStyles = "w-full flex justify-between items-center flex-shrink-0"

    const variants = {
        landing: "h-16 transparent px-10",
        default: "h-20 backdrop-blur-md shadow-md px-10 sm:px-10 border-t"
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
    <footer className={`${baseStyles} ${variants[variant]}`} style={{
        background: variant === 'landing' ? 'transparent' : 'var(--surface)',
        color: 'var(--text)',
        borderColor: 'var(--border)'
    }}>
        {/* Logo */}
        <div className='cursor-pointer'>
            <img 
                src={logo_light} 
                alt="CrackCode Logo" 
                onClick={handleLogoClick}
                className='w-15 transition-transform hover:scale-105 duration-300'
            />
        </div>

        {/* Copyright */}
        <div className='absolute left-1/2 transform -translate-x-1/2'>
            <p className='text-sm' style={{ color: 'var(--textSec)' }}>&copy; {new Date().getFullYear()} CrackCode. All rights reserved.</p>
        </div>

        {/* Footer links */}
        <div className='flex space-x-6 font-medium'>
            <a href="/privacy" className='transition-colors duration-300 text-sm' style={{ color: 'var(--text)' }} onMouseEnter={(e) => e.target.style.color = 'var(--brand)'} onMouseLeave={(e) => e.target.style.color = 'var(--text)'}>Privacy Policy</a>
            <a href="/terms" className='transition-colors duration-300 text-sm' style={{ color: 'var(--text)' }} onMouseEnter={(e) => e.target.style.color = 'var(--brand)'} onMouseLeave={(e) => e.target.style.color = 'var(--text)'}>Terms of Service</a>
            <a href="/contact" className='transition-colors duration-300 text-sm' style={{ color: 'var(--text)' }} onMouseEnter={(e) => e.target.style.color = 'var(--brand)'} onMouseLeave={(e) => e.target.style.color = 'var(--text)'}>Contact Us</a>
        </div>

    </footer>
    )
}


    

  

export default Footer
