import React, { useState } from 'react'
import Button from '../../components/common/Button'
import logo from '../../assets/logo/crackcode_logo.png'
import { CircleUserIcon,Upload} from 'lucide-react'



const GameProfile = () => {

    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [username, setUsername] = useState('');

    const avatars = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 }
    ];

    const handleProceed = () => {
        if (!selectedAvatar) {
            alert('Please select an avatar ');
            return;
        }
        if (!username.trim()){
            alert('Please enter a username');
            return;
        }
    };


    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

            {/*CrackCode logo*/}
            <div className="absolute top-4 left-4">
                <img src={logo} alt="logo" className="w-40 h-16" />
            </div>
            {/* Main Content */}
            <div className="max-w-3xl w-full space-y-12">
                {/* Title */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Choose your Detective Avatar
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Select the avatar that matches your vibe
                    </p>
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-4 gap-6 justify-items-center max-w-2xl mx-auto">
                    {avatars.map((avatar) => (
                        <button
                            key={avatar.id}
                            onClick={() => setSelectedAvatar(avatar.id)}
                            className={`w-24 h-24 rounded-full bg-gray-900
                transition-all duration-300 hover:scale-110
                ${selectedAvatar === avatar.id
                                    ? 'ring-4 ring-orange-400 scale-110'
                                    : 'ring-2 ring-gray-700'
                                }`}
                        >
                        </button>
                    ))}

                    {/* Upload Button */}
                    <button
                        className="w-24 h-24 rounded-full bg-gray-800 
              flex flex-col items-center justify-center
              transition-all duration-300 hover:scale-110 hover:bg-gray-700
              ring-2 ring-gray-700"
                    >
                         <Upload className='w-5 h-5 text-gray-400' />
                        <span className="text-xs text-gray-400 mt-1">Upload</span>
                    </button>
                </div>

                {/* Username Input */}
                <div className="max-w-md mx-auto space-y-4">
                    <p className="text-center text-gray-300">
                        Pick a cool username for the adventure ahead
                    </p>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none ">
                             <CircleUserIcon className='w-7 h-7 text-gray-400' />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-15 pr-6 py-4 bg-gray-800 rounded-full
                                        text-white
                                        focus:outline-none focus:ring-2 focus:ring-orange-400
                                        transition-all" placeholder="Enter an username" required/>

                    </div>

                    {/* Proceed Button */}
                    <Button variant='primary' size='lg' fullWidth type='submit' className='!rounded-full h-auto py-2' onClick={handleProceed}  >Proceed</Button>
                </div>
            </div>
        </div>
    );
};

export default GameProfile;
