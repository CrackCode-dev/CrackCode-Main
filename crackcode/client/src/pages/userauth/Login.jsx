import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../../context/userauth/authenticationContext'
import Button from '../../components/common/Button'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UserRound, Mail, LockKeyhole } from 'lucide-react'
import Footer from '../../components/common/Footer'


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

        <div className='flex flex-col items-center justify-center min-h-screen overflow-hidden'>
           

            {/*Background video*/}
            <video autoPlay loop muted playsInline className='absolute inset-0 w-full h-full object-cover z-0'>
                <source src="/auth-bg.mp4" type="video/mp4" />
            </video>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            
            <div onClick={() => navigate('/')} className="w-full absolute top-0 cursor-pointer">

            </div>

            <div className='bg-[#121212] z-20 p-10 rounded-lg shadow-lg w-full sm:w-96 text-orange-400 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 focus-within:ring-1 focus-within:ring-white transition-all duration-300 ease-in-out">
                            <UserRound className='w-5 h-5 text-gray-400' />
                            <input onChange={e => setName(e.target.value)}
                                value={name}
                                className='bg-transparent outline-none text-white w-full' type="text" placeholder='Full Name' required />
                        </div>
                    )}

                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 focus-within:ring-1 focus-within:ring-white transition-all duration-300 ease-in-out">
                        <Mail className='w-5 h-5 text-gray-400' />
                        <input
                            onChange={e => setEmail(e.target.value)}
                            value={email} className='bg-transparent outline-none text-white w-full' type="email" placeholder='Email id' required />
                    </div>

                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 focus-within:ring-1 focus-within:ring-white transition-all duration-300 ease-in-out">
                        <LockKeyhole className='w-5 h-5 text-gray-400' />
                        <input
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            className='bg-transparent outline-none text-white w-full 'type="password" placeholder='Password' required />
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
            
            </div><br></br><br></br>
            <Footer />
        </div>
        
    )
}

export default Login