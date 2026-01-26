import User from "../auth/User.model.js";

//Update game profile with avatar and username

export const UpdateGameProfile = async (req, res) => {
    try {
        const { username, avatar, avatarType } = req.body;

        //Validation
        if (!username || username.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters'
            });
        }

        if (!avatar) {
            return res.status(400).json({
                success: false,
                message: 'Please select an avatar'
            });
        }

        //Checking if username is already taken
        const userExists = await User.findOne({
            username: username.toLowerCase(),
            _id: { $ne: req.userId }

        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken '
            });
        }

        //Update user profile
        const UserUpdate = await User.findByIdAndUpdate(
            req.userId,
            {
                username: username.toLowerCase(),
                avatar,
                avatarType: avatarType || 'present',
                lastActive: Date.now()
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated sucessfully ',
            user: UserUpdate
        });
    } catch (error) {
        console.error('Profile update error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error ',
            error: error.meassage
        });

    }

};


//Checking if username is available
export const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username || username.length < 3) {
            return res.json({ available: false });
        }

        // Check if username exists (excluding current user)
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
            _id: { $ne: req.userId }
        });

        res.json({
            available: !existingUser
        });
    } catch (error) {
        console.error('Check username error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

//Get current user data
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }
};