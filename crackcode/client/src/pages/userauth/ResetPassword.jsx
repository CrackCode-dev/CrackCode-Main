// import React, { useContext, useState } from 'react'
// import Button from '../../components/ui/Button'
// import { useNavigate } from 'react-router-dom'
// import { Mail, RectangleEllipsis } from 'lucide-react'
// import { AppContent } from '../../context/userauth/authenticationContext'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import Header from '../../components/common/Header'

// function ResetPassword() {
//   const { backendUrl } = useContext(AppContent)
//   axios.defaults.withCredentials = true

//   const navigate = useNavigate()
//   const [email, setEmail] = useState('')
//   const [newPassword, setNewPassword] = useState('')
//   const [isEmailSent, setIsEmailSent] = useState(false)
//   const [otp, setOtp] = useState('')
//   const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

//   const inputRefs = React.useRef([])

//   const handleInput = (e, index) => {
//     if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   }

//   const handleKeyDown = (e, index) => {
//     if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   }

//   const handlePaste = (e) => {
//     const paste = e.clipboardData.getData('text')
//     const pasteArray = paste.split('');
//     pasteArray.forEach((char, index) => {
//       if (inputRefs.current[index]) {
//         inputRefs.current[index].value = char;
//       }
//     });
//   }

//   const onSubmitEmail = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
//       if (data.success) {
//         toast.success(data.message || "OTP sent to your email")
//         setIsEmailSent(true)
//       } else {
//         toast.error(data.message || "Failed to send OTP")
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || "Failed to send OTP";
//       toast.error(errorMessage);
//     }
//   }

//   const onSubmitOTP = async (e) => {
//     e.preventDefault();
//     const otpArray = inputRefs.current.map(e => e.value)
//     setOtp(otpArray.join(''))
//     setIsOtpSubmitted(true)
//   }

//   const onSubmitNewPassword = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
//       if (data.success) {
//         toast.success(data.message || "Password reset successfully!")
//         navigate('/login')
//       } else {
//         toast.error(data.message || "Password reset failed")
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || "Password reset failed";
//       toast.error(errorMessage);
//     }
//   }

//   return (
//     <div className='flex felx-col items-center justify-center min-h-screen bg-[#050505]'>
//       <Header variant='landing'/>

//       {/*Background video*/}
//       <video autoPlay loop muted playsInline className='absolute inset-0 w-full h-full object-cover z-0'>
//         <source src='/auth-bg.mp4' type='video/mp4' />
//       </video>

//       {/* Dark overlay */}
//       <div className='absolute inset-0 bg-black/60 z-10'></div>

//       <div onClick={() => navigate('/')} className='w-full absolute top-0 cursor-pointer'>

//       </div>

//       {/* 1. Enter Email Form */}
//       {!isEmailSent &&
//         <form onSubmit={onSubmitEmail} className='bg-[#121212] z-20 p-8 rounded-lg shadow-lg w-96 text-sm'>
//           <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
//           <p className='text-center mb-6 text-orange-400'>Enter your registered email address.</p>
//           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 focus-within:ring-1 focus-within:ring-white transition-all duration-300 ease-in-out'>
//             <Mail className='w-5 h-5 text-gray-400' />
//             <input className='bg-transparent outline-none text-white ' type='email' placeholder='Email id' value={email}
//               onChange={e => setEmail(e.target.value)} required />
//           </div>
//           <Button variant='primary' size='md' fullWidth type='submit' className='!rounded-full h-auto py-2'  >Submit</Button>
//         </form>
//       }

//       {/* 2. Enter OTP Form */}
//       {!isOtpSubmitted && isEmailSent &&
//         <form onSubmit={onSubmitOTP} className='bg-[#121212] z-20 p-8 rounded-lg shadow-lg w-96 text-sm'>
//           <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
//           <p className='text-center mb-6 text-orange-400'>Enter this 6-digit code sent to your email id.</p>

//           <div className='flex justify-between mb-8 gap-1.5' onPaste={handlePaste}>
//             {Array(6).fill(0).map((_, index) => (
//               <input type="text" maxLength='1' key={index} required
//                 className='w-12 h-12 bg-gray-700 text-white text-center text-xl rounded-md'
//                 ref={e => inputRefs.current[index] = e}
//                 onInput={(e) => handleInput(e, index)}
//                 onKeyDown={(e) => handleKeyDown(e, index)}
//               />
//             ))}
//           </div>
//           <Button variant='primary' size='md' fullWidth type='submit' className='!rounded-full h-auto py-2' >Submit</Button>
//         </form>
//       }

//       {/* 3. Enter New Password Form */}
//       {isOtpSubmitted && isEmailSent &&
//         <form onSubmit={onSubmitNewPassword} className='bg-[#121212] z-20 p-8 rounded-lg shadow-lg w-96 text-sm'>
//           <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
//           <p className='text-center mb-6 text-orange-400'>Enter the new password below.</p>
//           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 focus-within:ring-1 focus-within:ring-white transition-all duration-300 ease-in-out'>
//             <RectangleEllipsis className='w-4 h-4 text-gray-400' />
//             <input className='bg-transparent outline-none text-white' type="password" placeholder='Password' value={newPassword}
//               onChange={e => setNewPassword(e.target.value)} required />
//           </div>
//           <Button variant='primary' size='md' fullWidth type='submit' className="!rounded-full h-auto py-2"  >Submit</Button>
//         </form>
//       }
//     </div>
//   )
// }

// export default ResetPassword






import React, { useContext, useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Mail, RectangleEllipsis } from "lucide-react";
import { AppContent } from "../../context/userauth/authenticationContext";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../components/common/Header";

function ResetPassword() {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef([]);

  // ===== OTP Handling =====
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // ===== 1. Send Email =====
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );

      if (data?.success) {
        toast.success(data.message || "OTP sent successfully");
        setIsEmailSent(true);
      } else {
        toast.error(data?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== 2. Submit OTP =====
  const onSubmitOTP = (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current
      .map((el) => el?.value || "")
      .join("");

    if (otpValue.length !== 6) {
      return toast.error("Please enter full 6-digit OTP");
    }

    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };

  // ===== 3. Reset Password =====
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword }
      );

      if (data?.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data?.message || "Reset failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header variant="landing" />

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/auth-bg.mp4" type="video/mp4" />
      </video>

      {/* Brown Overlay */}
      <div className="absolute inset-0 bg-[#562F00]/70 z-10"></div>

      {/* Center Wrapper */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md mx-auto bg-[#FFFDF1] p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#FFCE99]/50">

          {/* STEP 1: EMAIL */}
          {!isEmailSent && (
            <>
              <h1 className="text-[#562F00] text-2xl font-extrabold text-center">
                Reset Password
              </h1>

              <p className="text-center mt-2 text-sm text-[#562F00]/75">
                Enter your registered email address.
              </p>

              <form onSubmit={onSubmitEmail} className="mt-6 space-y-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#FFCE99]/20 border border-[#FFCE99] focus-within:border-[#FF9644] transition">
                  <Mail className="w-5 h-5 text-[#FF9644]" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50"
                  />
                </div>

                <Button
                  fullWidth
                  type="submit"
                  className="!rounded-full py-3 !bg-[#FF9644] hover:!bg-[#562F00] !text-[#FFFDF1] font-bold shadow-lg"
                >
                  {isSubmitting ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            </>
          )}

          {/* STEP 2: OTP */}
          {!isOtpSubmitted && isEmailSent && (
            <>
              <h1 className="text-[#562F00] text-2xl font-extrabold text-center">
                Enter OTP
              </h1>

              <p className="text-center mt-2 text-sm text-[#562F00]/75">
                Enter the 6-digit code sent to your email.
              </p>

              <form onSubmit={onSubmitOTP} className="mt-6">
                <div className="flex justify-between mb-6 gap-2" onPaste={handlePaste}>
                  {Array(6).fill(0).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      required
                      className="w-12 h-12 rounded-xl text-center text-lg font-bold bg-[#FFCE99]/20 border border-[#FFCE99] focus:border-[#FF9644] outline-none"
                      ref={(el) => (inputRefs.current[index] = el)}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>

                <Button
                  fullWidth
                  type="submit"
                  className="!rounded-full py-3 !bg-[#FF9644] hover:!bg-[#562F00] !text-[#FFFDF1] font-bold shadow-lg"
                >
                  Verify OTP
                </Button>
              </form>
            </>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {isOtpSubmitted && isEmailSent && (
            <>
              <h1 className="text-[#562F00] text-2xl font-extrabold text-center">
                Set New Password
              </h1>

              <p className="text-center mt-2 text-sm text-[#562F00]/75">
                Enter your new password below.
              </p>

              <form onSubmit={onSubmitNewPassword} className="mt-6 space-y-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#FFCE99]/20 border border-[#FFCE99] focus-within:border-[#FF9644] transition">
                  <RectangleEllipsis className="w-5 h-5 text-[#FF9644]" />
                  <input
                    type="password"
                    placeholder="New password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50"
                  />
                </div>

                <Button
                  fullWidth
                  type="submit"
                  className="!rounded-full py-3 !bg-[#FF9644] hover:!bg-[#562F00] !text-[#FFFDF1] font-bold shadow-lg"
                >
                  {isSubmitting ? "Updating..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => navigate("/login")}
              className="text-[#FF9644] font-bold hover:text-[#562F00]"
            >
              Back to Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
