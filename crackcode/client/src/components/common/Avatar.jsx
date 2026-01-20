import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';


const userAvatar = null; // Replace with actual user avatar URL when available

function Avatar() {
    const navigate = useNavigate();

    const handleAvatarClick = () => {
        navigate('/user-profile');
    };

  return (
    <div onClick={handleAvatarClick} className='cursor-pointer'>
      {userAvatar ? (
            <img src={userAvatar} alt="User Profile" className='w-10 rounded-full border-2 border-white/30 
            hover:border-orange-500 transition-colors object-cover ' />
        ) : (
            <UserCircle size={25} className='text-white hover:text-orange-500 transition-colors'/>
        )}
    </div>
  )
}

export default Avatar
