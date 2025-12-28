
import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { toast } from 'react-toastify'

function Login() {

    const navigate = useNavigate()
    const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent)

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            console.log("Attempting to connect to:", backendUrl);
            axios.defaults.withCredentials = true

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
                if (data.success) {
                    setIsLoggedIn(true)
                    getUserData()
                    
                    try {
                        const otpResponse = await axios.post(backendUrl + '/api/auth/send-verify-otp');
                        
                        if (otpResponse.data.success) {
                            toast.success("Account created! OTP sent to email.");
                           
                            navigate('/email-verify');
                        } else {
                            toast.error(otpResponse.data.message);
                            navigate('/'); 
                        }
                    } catch (error) {
                        toast.error("Failed to send OTP: " + error.message);
                        navigate('/');
                    }
                    
                    
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
                if (data.success) {
                    setIsLoggedIn(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        
        <div className='flex felx-col items-center justify-center min-h-screen bg-[#050505]'>
            <div onClick={() => navigate('/')} className="w-full absolute top-0 cursor-pointer">
                <Navbar />
            </div>

            <div className='bg-[#121212] p-10 rounded-lg shadow-lg w-f sm:w-96 text-[#018801] text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500'>
                            <img src={assets.person_icon} alt="" />
                            <input onChange={e => setName(e.target.value)}
                                value={name}
                                className='bg-transparent outline-none text-white' type="text" placeholder='Full Name' required />
                        </div>
                    )}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500'>
                        <img src={assets.mail_icon} alt="" />
                        <input
                            onChange={e => setEmail(e.target.value)}
                            value={email} className='bg-transparent outline-none text-white' type="email" placeholder='Email id' required />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500'>
                        <img src={assets.lock_icon} alt="" />
                        <input
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            className='bg-transparent outline-none text-white' type="password" placeholder='Password' required />
                    </div>

                    <p onClick={() => navigate('/reset-password')} className='mb-4 text-[#018801] cursor-pointer'>Forgot Password</p>

                    <button className='w-full py-2.5 rounded-full bg-[#018801] hover:bg-[#018801a3]
            text-white font-medium'>{state}</button>
                </form>

                {state === 'Sign Up' ? (
                    <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
                        <span onClick={() => setState('Login')} className='text-[#57de57] cursor-pointer underline'>Login here</span>
                    </p>
                )
                    : (
                        <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
                            <span onClick={() => setState('Sign Up')} className='text-[#57de57] cursor-pointer underline'>Sign Up</span>
                        </p>
                    )}

            </div>
        </div>
    )
}

export default Login