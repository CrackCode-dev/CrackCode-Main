import express from 'express'
console.log("AUTH ROUTES LOADED");

import { register,login,logout, sendVerifyOtp, verifyEmail,isAuthenticated, sendResetOtp, resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);  //http://localhost:5050/api/auth/register
authRouter.post('/login', login);  //http://localhost:5050/api/auth/login
authRouter.post('/logout', logout);  //http://localhost:5050/api/auth/logout
authRouter.post('/send-verify-otp', userAuth,sendVerifyOtp);  
authRouter.post('/verify-account',userAuth, verifyEmail);
authRouter.post('/is-auth',userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;