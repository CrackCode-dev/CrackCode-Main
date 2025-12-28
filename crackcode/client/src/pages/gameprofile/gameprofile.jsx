import { useState } from 'react'


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
        if (!selectedAvatar && !username.trim()) {
            alert('Please select an avatar and enter a username');
        }
    };


    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

            {/*CrackCode logo*/}
            <div className="absolute top-4 left-4">
                <img src="/src/assets/logo.png" alt="logo" className="w-40 h-16" />
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
                                    ? 'ring-4 ring-green-500 scale-110'
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
                            <img src="/src/assets/userprofileicon.png" alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter an username"
                            className="w-full pl-20 pr-6 py-4 bg-gray-800 rounded-full
                                        text-white placeholder-gray-500
                                        focus:outline-none focus:ring-2 focus:ring-green-500
                                        transition-all"
                        />
                    </div>

                    {/* Proceed Button */}
                    <button
                        onClick={handleProceed}
                        className="w-full py-4 bg-green-600 hover:bg-green-700
                                text-white font-semibold rounded-full
                                transition-all duration-300 hover:scale-105
                                active:scale-95"
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameProfile;
