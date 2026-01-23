import React, { useState } from 'react'
import Button from '../../components/ui/Button'
import { CircleUserIcon, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AvatarUpload from '../../components/Profiles/AvatarUpload'
import Header from '../../components/common/Header'

const GameProfile = () => {

    const navigate = useNavigate();

    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [username, setUsername] = useState('');
    const [uploadedAvatar, setUploadedAvatar] = useState('');
    const [showAvatarUpload, setShowAvatarUpload] = useState(false);

    const [errors, setErrors] = useState([]); //array to hold all the errors

    const avatars = [
        { id: 1 , src:'/avatars/avatar1.png' },
        { id: 2 , src:'/avatars/avatar2.png' },
        { id: 3 , src:'/avatars/avatar3.png'},
        { id: 4 , src:'/avatars/avatar4.png'},
        { id: 5 , src:'/avatars/avatar5.png' },
        { id: 6 , src:'/avatars/avatar6.png'},
        { id: 7 , src:'/avatars/avatar7.png'}
    ];

    const handleProceed = () => {

        const newErrors = [];

        if (!selectedAvatar && !username.trim()) {
            newErrors.push('Please select an Avatar and a Username !')
        } else {
            if (!selectedAvatar) newErrors.push('Please select an Avatar !');
            if (!username.trim()) newErrors.push('Please enter a username !');
            else if (username.length < 3) newErrors.push('Username must be at least 3 characters !');
        }
        setErrors(newErrors);

        if (newErrors.length === 0) {
            navigate('/user-profile');
        }
    };

    {/*handles avatr section */ }
    const handleAvatarSelection = (avatarData) => {
        setUploadedAvatar(avatarData);
        setSelectedAvatar('uploaded');
        setShowAvatarUpload(false);
    };

    const handleCloseUpload = () => {
        setShowAvatarUpload(false);
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

            <Header />
            {/* Main Content */}
            <div className="max-w-3xl w-full space-y-10 mt-17">
                {/* Title */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Choose your Detective Avatar
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Select the avatar that matches your vibe
                    </p>
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-4 gap-10 justify-items-center max-w-2xl mx-auto">
                    {avatars.map((avatar) => (
                        <button
                            key={avatar.id}
                            onClick={() => {
                                setSelectedAvatar(avatar.id);
                                setUploadedAvatar('');}
                            }
                            className={`w-30 h-30 rounded-full overflow-hidden bg-gray-900
                transition-all duration-300 hover:scale-110
                ${selectedAvatar === avatar.id
                                    ? 'ring-2 ring-white scale-110'
                                    : 'ring-2 ring-gray-700'

                                }`}
                        >

                        <img 
                            src = {avatar.src}
                            alt = {`Avatar ${avatar.id}`}
                            className='w-full h-full rounded-full object-cover'
                        />
                        </button>
                    ))}

                    {/* Upload Button */}
                    <button
                        onClick={() => setShowAvatarUpload(true)}
                        className={`w-30 h-30 rounded-full bg-gray-900 
                        flex flex-col items-center justify-center
                        transition-all duration-300 hover:scale-110 hover:bg-gray-700
                        ring-2 ring-gray-700
                        ${selectedAvatar === 'uploaded' ? 'ring-2 ring-white scale-110' : ''}`}
                    >
                        {uploadedAvatar ? (
                            <img src={uploadedAvatar} alt="Uploaded Avatar " className='w-full h-full rounded-full object-cover' />
                        ) : (
                            <>
                                <Upload className='w-5 h-5 text-gray-300' />
                                <span className="text-xs font-semibold text-gray-300 mt-1">Upload</span>
                            </>
                        )}



                    </button>
                </div>

                {/* Username Input */}
                <div className="max-w-md mx-auto space-y-4">
                    <p className="text-center text-gray-300">
                        Pick a cool username for the adventure ahead
                    </p>

                    <div className="relative ">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none ">
                            <CircleUserIcon className='w-7 h-7 text-gray-300' />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                setErrors([]);
                            }}
                            className={`w-full pl-15 pr-6 py-2.5 bg-gray-800 rounded-full
                                        text-white  transition-all
                                        focus:outline-none focus:ring-2 placeholder-gray-300
                                        ${errors.some(err => err.toLowerCase().includes('username'))
                                    ? 'ring-2 ring-orange-600' // error state
                                    : username.trim() !== ''
                                    ? 'ring-2 ring-orange-400' //correct user name
                                    : 'ring-1 ring-white' //empty input
                                }`}
                            placeholder="Enter an username" required />

                    </div>

                    {/*Error display section*/}
                    {errors.length > 0 && (
                        <div className='space-y-1'>
                            {errors.map((err, index) => (
                                <p key={index} className='text-orange-600 text-sm text-left ml-4'>{err}</p>
                            ))}
                        </div>
                    )}

                    {/* Proceed Button */}
                    <Button variant='outline' size='md' fullWidth type='button' className='rounded-full! h-auto py-2' onClick={handleProceed}  >Proceed</Button>

                </div>
            </div>

            {/* Avatar Upload Model*/}
            {showAvatarUpload && (
                <AvatarUpload
                    isOpen={showAvatarUpload}
                    onClose={handleCloseUpload}
                    onAvatarSelect={handleAvatarSelection}
                    shape='Circle'
                    allowUrl={true}
                    allowDragDrop={true}
                />
            )}
        </div>
    );
};

export default GameProfile;
