
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// REGISTER 
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: "User registered successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//  LOGIN 
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Using user.email for consistency and safety
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'WELCOME TO CODEDETECTIVE',
            text: `WELCOME TO CODEDETECTIVE. YOUR ACCOUNT HAS BEEN CREATED WITH EMAIL ID: ${user.email}.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Login successful. Welcome email sent!" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ==================== LOGOUT ====================
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ==================== SEND VERIFY OTP ====================
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId; // Retrieved from the session cookie

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // FIX: 'verifyOtp' (Capital O) to match Schema
        user.verifyOtp = otp; 
        user.verifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000; 
        
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Verification OTP sent on Email.' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// VERIFY EMAIL 
export const verifyEmail = async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        return res.json({ success: false, message: "Missing OTP" });
    }

    try {
        const userId = req.userId; 

        // FIX: 'verifyOtp' (Capital O) to match Schema
        const user = await userModel.findOne({ _id: userId, verifyOtp: otp }); 

        if (!user) {
            return res.json({ success: false, message: "Invalid OTP or User ID" });
        }

        if (user.verifyOtpExpiryAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        user.isAccountVerified = true;
        // FIX: 'verifyOtp' (Capital O)
        user.verifyOtp = ''; 
        user.verifyOtpExpiryAt = 0;
        
        await user.save();

        return res.json({ success: true, message: 'Email verified successfully.' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Check if user is authenticated
export const isAuthenticated = async (req,res)=>{
    try{
        return res.json({success: true});
    } catch (error){
        res.json({success: false, message: error.message});
    }
};

// Send Password Reset OTP
export const sendResetOtp = async (req,res)=>{
    const {email} = req.body;

    if(!email){
        return res.json({success: false, message: 'Email is required.'})
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // FIX: 'resetOtp' (Capital O) and 'ExpiryAt' (with y) to match Schema
        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now() + 15 * 60 * 1000; 

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: 'OTP sent to your email'});

    } catch (error){
        return res.json({success: false, message: error.message});
    }
};

// Reset user password
export const resetPassword = async (req,res)=> {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false,message: 'Email, OTP, and new password are required.'});
    }

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        // FIX: 'resetOtp' (Capital O)
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: 'Invalid OTP'});
        }

        // FIX: 'resetOtpExpiryAt' (Capital O and with y)
        if(user.resetOtpExpiryAt < Date.now()){ 
            return res.json({success: false, message: 'OTP Expired.'});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiryAt = 0; 

        await user.save();

        return res.json({success: true, message: 'Password has been reset successfully'});

    } catch (error){
        return res.json({success: false, message: error.message});
    }
};