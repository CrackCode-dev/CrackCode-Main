// import React, { useContext, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { AppContent } from '../../context/userauth/authenticationContext'
// import Button from '../../components/ui/Button'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { UserRound, Mail, LockKeyhole } from 'lucide-react'
// import Header from '../../components/common/Header'

// function Login() {

//     const navigate = useNavigate()
//     const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent)

//     const [state, setState] = useState('Sign Up')
//     const [name, setName] = useState('')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')

//     const onSubmitHandler = async (e) => {
//         e.preventDefault();
//         axios.defaults.withCredentials = true

//         try {
//             if (state === 'Sign Up') {
//                 const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
//                 if (data.success) {
//                     setIsLoggedIn(true)

//                     try {
//                         const otpResponse = await axios.post(backendUrl + '/api/auth/send-verify-otp');

//                         if (otpResponse.data.success) {
//                             toast.success("Account created! OTP sent to email.");
//                             navigate('/verify-account');
//                         } else {
//                             // OTP send failed but account created - still go to verify
//                             toast.warning(otpResponse.data.message || "Could not send OTP. Please try again.");
//                             navigate('/verify-account');
//                         }
//                     } catch (otpError) {
//                         // OTP request failed but account was created - still go to verify
//                         console.log('OTP send error:', otpError);
//                         toast.success("Account created! Please request OTP on verify page.");
//                         navigate('/verify-account');
//                     }
//                 } else {
//                     toast.error(data.message || "Registration failed")
//                 }
//             } else {
//                 const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
//                 if (data.success) {
//                     setIsLoggedIn(true)
                    
//                     // Check if user is verified before redirecting to home
//                     if (data.user && !data.user.isAccountVerified) {
//                         // Send OTP and redirect to verify page
//                         try {
//                             await axios.post(backendUrl + '/api/auth/send-verify-otp');
//                             toast.info("Please verify your email first. OTP sent!");
//                         } catch (err) {
//                             console.log('OTP send error on login:', err);
//                             toast.info("Please verify your email.");
//                         }
//                         navigate('/verify-account');
//                     } else {
//                         getUserData()
//                         toast.success("Login successful!")
//                         navigate('/home')
//                     }
//                 } else {
//                     toast.error(data.message || "Login failed")
//                 }
//             }
//         } catch (error) {
//             // Extract proper error message from axios error
//             const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
//             toast.error(errorMessage);
//         }
//     }

//     return (

//         <div className='flex flex-col items-center justify-center min-h-screen overflow-hidden'>
//            <Header variant='landing'/>

//             {/*Background video*/}
//             <video autoPlay loop muted playsInline className='absolute inset-0 w-full h-full object-cover z-0'>
//                 <source src='/auth-bg.mp4' type='video/mp4' />
//             </video>

//             {/* Dark overlay */}
//             <div className='absolute inset-0 bg-black/60 z-10'></div>

            
//             <div onClick={() => navigate('/')} className='w-full absolute top-0 cursor-pointer'>

//             </div>

//             <div className='bg-[#121212] z-20 p-10 rounded-lg shadow-lg w-full sm:w-96 text-orange-400 text-sm'>
//                 <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
//                 <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

//                 <form onSubmit={onSubmitHandler}>
//                     {state === 'Sign Up' && (
//                         <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 focus-within:ring-1 focus-within:ring-white transition-all duration-300 ease-in-out'>
//                             <UserRound className='w-5 h-5 text-gray-400' />
//                             <input onChange={e => setName(e.target.value)}
//                                 value={name}
//                                 className='bg-transparent outline-none text-white w-full' type="text" placeholder='Full Name' required />
//                         </div>
//                     )}

//                     <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 focus-within:ring-1 focus-within:ring-white transition-all duration-300 ease-in-out'>
//                         <Mail className='w-5 h-5 text-gray-400' />
//                         <input
//                             onChange={e => setEmail(e.target.value)}
//                             value={email} className='bg-transparent outline-none text-white w-full' type="email" placeholder='Email id' required />
//                     </div>

//                     <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 focus-within:ring-1 focus-within:ring-white transition-all duration-300 ease-in-out">
//                         <LockKeyhole className='w-5 h-5 text-gray-400' />
//                         <input
//                             onChange={e => setPassword(e.target.value)}
//                             value={password}
//                             className='bg-transparent outline-none text-white w-full 'type="password" placeholder='Password' required />
//                     </div>

//                     {/* <p onClick={() => navigate('/reset-password')} className='cursor-pointer'>Forgot Password</p> */}
//                     <Button variant='text' onClick={() => navigate('/reset-password')}>Forgot Password</Button>

//                     <Button variant='primary' size='md' fullWidth type='submit' className='!rounded-full h-auto py-2'  >{state}</Button>
//                 </form>

//                 {state === 'Sign Up' ? (
//                     <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
//                         <Button variant='text' onClick={() => setState('Login')} className='text-xs font-extralight'>Login here</Button>
//                     </p>
//                 )
//                     : (
//                         <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
//                             <Button variant='text' onClick={() => setState('Sign Up')} className='text-xs font-extralight'>Sign Up</Button>
//                         </p>
//                     )}
            
//             </div><br></br><br></br>
//         </div>
        
//     )
// }

// export default Login













import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContent } from "../../context/userauth/authenticationContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, LockKeyhole, UserRound } from "lucide-react";
import Logo from "../../assets/logo/crackcode_logo.svg";
import logo_light from "../../assets/logo/logo_light.png";
import logo_dark from "../../assets/logo/logo_dark.png";
import { useTheme } from "../../context/theme/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTC, setAcceptedTC] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPassword("");
    setConfirmPassword("");
    setAcceptedTC(false);
  }, [state]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (state === "Sign Up") {
        if (password !== confirmPassword) {
          return toast.error("Passwords do not match!");
        }
        if (!acceptedTC) {
          return toast.error("You must accept the Terms and Conditions.");
        }

        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data?.success) {
          // Registration created a pending account and OTP was sent.
          toast.success("OTP sent to your email.");
          // Navigate to verify page and pass email so verify endpoint can complete registration
          navigate("/verify-account", { state: { email } });
        } else {
          toast.error(data?.message || "Registration failed.");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data?.success) {
          // Store the access token if returned from backend
          if (data.accessToken) {
            try {
              localStorage.setItem('accessToken', data.accessToken);
              axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            } catch (e) {}
          }
          
          setIsLoggedIn(true);
          await getUserData();

          // If the returned user isn't verified, prompt verification flow
          if (data.user && !data.user.isAccountVerified) {
            try {
              await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
              toast.info("Please verify your email. OTP sent to your email.");
            } catch (err) {
              console.log("OTP send error on login:", err);
              toast.info("Please verify your email.");
            }
            navigate("/verify-account");
          } else {
            toast.success("Welcome back!");
            navigate("/home");
          }
        } else {
          toast.error(data?.message || "Login failed.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { theme } = useTheme();
  const darkThemes = ["dark", "country", "midnight"];
  const activeLogo = darkThemes.includes(theme) ? logo_light : logo_dark;

  return (
    // ✅ Video background wrapper
    <div className="min-h-screen relative overflow-hidden">
      {/* Background video */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/auth-bg.mp4" type="video/mp4" />
      </video>

      {/* Palette overlay (brown tint) */}
      <div className="absolute inset-0 bg-[#562F00]/65 z-10" />

      {/* Center card */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        {/* MAIN CARD (Fixed h-[650px] so it won't resize) */}
        <div className="flex w-full max-w-5xl bg-[#FFFDF1] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden h-[650px]">
          
          {/* ================= LEFT PANEL ================= */}
          <div className="hidden md:flex w-1/2 relative overflow-hidden">
            {/* Left panel background (gradient within palette) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#562F00] to-[#3B1F00]" />
            <div className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,206,153,0.8) 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />

            {/* Left content (as per your latest request) */}
            <div className="relative z-10 flex flex-col justify-center h-full p-12 text-[#FFFDF1]">
              <h1 className="text-4xl font-extrabold leading-tight">
                Code. Compete. Conquer.
              </h1>

              <p className="mt-4 text-base leading-relaxed text-[#FFCE99]/90 max-w-md">
                A platform designed to help you master coding skills,
                build careers in a more engaging way.
              </p>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="w-full md:w-1/2 flex flex-col p-8 sm:p-12 relative bg-[#FFFDF1]">
            {/* TOP HEADER */}
            <div className="flex items-center justify-between w-full mb-4 z-10">
              <div className="flex items-center gap-3">
                <img src={activeLogo} alt="CrackCode Logo" className="h-10 drop-shadow-sm" />
              </div>

              <div className="flex bg-[#FFCE99]/30 rounded-full p-1 shadow-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setState("Login")}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    state === "Login"
                      ? "bg-[#FF9644] text-[#FFFDF1] shadow-md"
                      : "text-[#562F00] hover:bg-[#FFCE99]/50"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setState("Sign Up")}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    state === "Sign Up"
                      ? "bg-[#FF9644] text-[#FFFDF1] shadow-md"
                      : "text-[#562F00] hover:bg-[#FFCE99]/50"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* FORM WRAPPER */}
            <div className="flex-grow flex flex-col justify-center max-w-sm w-full mx-auto relative z-10">
              <div className="mb-8 text-center md:text-left">
                <h3 className="text-3xl font-extrabold text-[#562F00]">
                  {state === "Login" ? "Login to Account" : "Create Account"}
                </h3>
                <p className="text-sm text-[#562F00]/70 mt-2 font-medium">
                  {state === "Login" ? "Welcome back." : "Create your account to begin."}
                </p>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-4">
                {state === "Sign Up" && (
                  <div className="relative flex items-center bg-[#FFCE99]/20 rounded-xl px-4 py-3 border border-[#FFCE99] focus-within:border-[#FF9644] transition-colors shadow-sm">
                    <UserRound className="text-[#FF9644] w-5 h-5 mr-3" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50 font-medium"
                    />
                  </div>
                )}

                <div className="relative flex items-center bg-[#FFCE99]/20 rounded-xl px-4 py-3 border border-[#FFCE99] focus-within:border-[#FF9644] transition-colors shadow-sm">
                  <Mail className="text-[#FF9644] w-5 h-5 mr-3" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50 font-medium"
                  />
                </div>

                <div className="relative flex items-center bg-[#FFCE99]/20 rounded-xl px-4 py-3 border border-[#FFCE99] focus-within:border-[#FF9644] transition-colors shadow-sm">
                  <LockKeyhole className="text-[#FF9644] w-5 h-5 mr-3" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50 font-medium"
                  />
                </div>

                {state === "Sign Up" && (
                  <div className="relative flex items-center bg-[#FFCE99]/20 rounded-xl px-4 py-3 border border-[#FFCE99] focus-within:border-[#FF9644] transition-colors shadow-sm">
                    <LockKeyhole className="text-[#FF9644] w-5 h-5 mr-3" />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50 font-medium"
                    />
                  </div>
                )}

                {state === "Login" && (
                  <div className="flex justify-end mt-2">
                    <Link
                      to="/reset-password"
                      className="text-sm font-bold text-[#FF9644] hover:text-[#562F00] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {state === "Sign Up" && (
                  <div className="flex items-start mt-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={acceptedTC}
                      onChange={(e) => setAcceptedTC(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#FF9644] cursor-pointer"
                    />
                    <label htmlFor="terms" className="ml-2 text-xs text-[#562F00] font-medium leading-relaxed">
                      I agree to the{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#FF9644] font-bold hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FF9644] font-bold hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || (state === "Sign Up" && !acceptedTC)}
                  className="w-full mt-6 py-4 rounded-xl bg-[#FF9644] text-[#FFFDF1] font-bold text-lg hover:bg-[#562F00] transition-all duration-300 shadow-xl shadow-[#FF9644]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF9644]"
                >
                  {isSubmitting ? "Please wait..." : state === "Login" ? "Sign In" : "Create Account"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
