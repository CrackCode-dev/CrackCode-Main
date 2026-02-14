import React, { useState, useEffect, useContext } from 'react'
import Button from '../../components/ui/Button'
import { CircleUserIcon, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AvatarUpload from '../../components/Profiles/AvatarUpload'
import Header from '../../components/common/Header'
import { AppContent } from '../../context/userauth/authenticationContext'
import { gameprofileService } from '../../services/api/gameprofileService'
import { toast } from 'react-toastify'

//Importing the avatars
import avatar1 from '../../assets/avatars/avatar1.png'
import avatar2 from  '../../assets/avatars/avatar2.png'
import avatar3 from '../../assets/avatars/avatar3.png'
import avatar4 from '../../assets/avatars/avatar4.png'
import avatar5 from '../../assets/avatars/avatar5.png'
import avatar6 from '../../assets/avatars/avatar6.png'
import avatar7 from '../../assets/avatars/avatar7.png'

const GameProfile = () => {

    const navigate = useNavigate();
    const { backendUrl, getUserData } = useContext(AppContent)

    //UI states
    const [selectedAvatar, setSelectedAvatar] = useState('')
    const [username, setUsername] = useState('')
    const [uploadedAvatar, setUploadedAvatar] = useState('')
    const [showAvatarUpload, setShowAvatarUpload] = useState(false)

    const [errors, setErrors] = useState([]) //array to hold all the errors

    //loading and availability states
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [usernameAvailable, setusernameAvailable] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    //avatar usage array
    const avatars = [
        { id: 1, src: avatar1 }, { id: 2, src: avatar2 }, { id: 3, src: avatar3 },
        { id: 4, src:avatar4}, { id: 5, src: avatar5}, { id: 6, src:avatar6 }, { id: 7, src: avatar7}
    ];

    //Check username availability
    useEffect(() => {
        if (!username.trim()) {
            setusernameAvailable(null);
            return;
        }

        let isActive = true;

        const timer = setTimeout(async () => {
            setCheckingUsername(true);
            const available = await gameprofileService.checkUsername(backendUrl, username);

            if (isActive) {
                setusernameAvailable(available);
                setCheckingUsername(false);
            }
        }, 500);

        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [username, backendUrl]);

    // Validates input and updates the user's game profile via API, showing success/error messages
    const handleProceed = async () => {

        const newErrors = [];

        if (!selectedAvatar && !username.trim()) {
            newErrors.push('Please select an Avatar and a Username !')
        } else {
            if (!selectedAvatar) newErrors.push('Please select an Avatar !');
            if (!username.trim()) newErrors.push('Please enter a username !');
            else if (username.length < 3) newErrors.push('Username must be at least 3 characters !');
        }

        if (usernameAvailable === false) newErrors.push('Username is already taken,choose another!');
        setErrors(newErrors);

        //Stop submissions if errors exists
        if (newErrors.length > 0) return;

        setIsLoading(true);


        try {
            const avatarData = selectedAvatar === 'uploaded' ? uploadedAvatar : selectedAvatar;
            const avatarType = selectedAvatar === 'uploaded' ? 'uploaded' : 'default';

            await gameprofileService.updateGameprofile(backendUrl, getUserData, username, avatarData, avatarType);

            toast.success('Profile Created successfully!');
            navigate('/home');
        } catch (err) {
            toast.error('Failed to create profile. Try again.');
        } finally {
            setIsLoading(false);
        }
    }

    //handles avatar section 
    const handleAvatarSelection = (avatarData) => {
        setUploadedAvatar(avatarData);
        setSelectedAvatar('uploaded');
        setShowAvatarUpload(false);
    };

    //handles upload section
    const handleCloseUpload = () => {
        setShowAvatarUpload(false);
    }



    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

            <Header />
            {/* Main Content*/}
            <div className="max-w-3xl w-full space-y-10 mt-17">
                {/* Title*/}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Choose your Detective Avatar
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Select the avatar that matches your vibe
                    </p>
                </div>

                {/*Avatar Grid*/}
                <div className="grid grid-cols-4 gap-10 justify-items-center max-w-2xl mx-auto">
                    {avatars.map((avatar) => (
                        <button
                            key={avatar.id}
                            onClick={() => {
                                setSelectedAvatar(avatar.id);
                                setUploadedAvatar('');
                            }
                            }
                            className={`w-30 h-30 rounded-full overflow-hidden bg-gray-900
                transition-all duration-300 hover:scale-110
                ${selectedAvatar === avatar.id
                                    ? 'ring-2 ring-white scale-110'
                                    : 'ring-2 ring-gray-700'

                                }`}
                        >

                            <img
                                src={avatar.src}
                                alt={`Avatar ${avatar.id}`}
                                className='w-full h-full rounded-full object-cover'
                            />
                        </button>
                    ))}

                    {/*Upload Button*/}
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

                {/*Username Input*/}
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

                    {/*Username availability messages*/}
                    <p className={`text-sm mt-1 ${checkingUsername ? 'text-white' :
                        usernameAvailable === false ? 'text-orange-600' :
                            usernameAvailable === true ? 'text-green-600' : ''
                        }`}>
                        {checkingUsername
                            ? 'Checking username...'
                            : usernameAvailable === false
                                ? 'Username already taken!'
                                : usernameAvailable === true
                                    ? 'Username is available!'
                                    : ''
                        }
                    </p>

                    {/*Error display section*/}
                    {errors.length > 0 && (
                        <div className='space-y-1'>
                            {errors.map((err, index) => (
                                <p key={index} className='text-orange-600 text-sm text-left ml-4'>{err}</p>
                            ))}
                        </div>
                    )}

                    {/*Proceed Button*/}
                    <Button variant='outline' size='md' fullWidth type='button' className='rounded-full! h-auto py-2' onClick={handleProceed} disabled={checkingUsername || isLoading} >Proceed</Button>

                </div>
            </div>

            {/*Avatar Upload Model*/}
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
