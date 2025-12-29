import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../../context/userauth/authenticationContext'
import Button from '../../components/common/Button'
import axios from 'axios'
import { toast } from 'react-toastify'
import {UserRound, Mail,LockKeyhole } from 'lucide-react'


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
               
            </div>

            <div className='bg-[#121212] p-10 rounded-lg shadow-lg w-f sm:w-96 text-orange-400 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500'>
                            <UserRound className='w-5 h-5 text-gray-400'/>
                            <input onChange={e => setName(e.target.value)}
                                value={name}
                                className='bg-transparent outline-none text-white' type="text" placeholder='Full Name' required />
                        </div>
                    )}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500'>
                        <Mail className='w-5 h-5 text-gray-400'/>
                        <input
                            onChange={e => setEmail(e.target.value)}
                            value={email} className='bg-transparent outline-none text-white' type="email" placeholder='Email id' required />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500'>
                       <LockKeyhole className='w-5 h-5 text-gray-400'/>
                        <input
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            className='bg-transparent outline-none text-white' type="password" placeholder='Password' required />
                    </div>

                    <p onClick={() => navigate('/resetpassword')} className='mb-4 text-orange-400 cursor-pointer'>Forgot Password</p>

                    <Button variant='primary' size='md' fullWidth type='submit' className="!rounded-full h-auto py-2"  >{state}</Button>
                </form>

                {state === 'Sign Up' ? (
                    <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
                        <span onClick={() => setState('Login')} className='text-orange-400 cursor-pointer underline'>Login here</span>
                    </p>
                )
                    : (
                        <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
                            <span onClick={() => setState('Sign Up')} className='text-orange-400  cursor-pointer underline'>Sign Up</span>
                        </p>
                    )}

            </div>
        </div>
    )
}

export default Login