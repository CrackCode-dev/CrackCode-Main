import { useNavigate, useLocation } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { useContext } from 'react';
import { AppContent } from '../../context/userauth/authenticationContext';

function Avatar({ avatarUrl = null, showClick = true, className = '' }) {
    const navigate = useNavigate();
    const { userData } = useContext(AppContent);
    const location = useLocation();
    
    // Use provided avatarUrl, userData.avatar, or fallback to null
    const userAvatar = avatarUrl || userData?.avatar || null;
    
    // Debug logging
    if (userData) {
        console.log('Avatar - userData:', userData);
        console.log('Avatar - userAvatar:', userAvatar);
    }

    const handleAvatarClick = () => {
        // Only navigate if not already on user-profile page
        if (showClick && location.pathname !== '/user-profile') {
            navigate('/user-profile');
        }
    };

    return (
        <div 
            onClick={handleAvatarClick} 
            className={`cursor-pointer flex items-center justify-center ${showClick ? 'hover:opacity-80 transition-opacity' : ''} ${className}`}
        >
            {userAvatar ? (
                <img 
                    src={userAvatar} 
                    alt="User Profile" 
                    className='w-full h-full rounded-full border-2 border-white/30 hover:border-orange-500 transition-colors object-cover' 
                />
            ) : (
                <UserCircle size={25} className='text-white hover:text-orange-500 transition-colors' />
            )}
        </div>
    );
}

export default Avatar;
