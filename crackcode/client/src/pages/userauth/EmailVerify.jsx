import React, { useContext, useEffect } from 'react'
import { AppContent } from '../../context/userauth/authenticationContext';
import axios from 'axios';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer'

function EmailVerify() {

  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContent)
  const navigate = useNavigate()
  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })

      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // Effect to protect the route
  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate('/')
    }
  }, [isLoggedIn, userData, navigate])

  return (

    <div className='flex flex-col items-center justify-center min-h-screen bg-[#050505]'>
      <Header/>

      {/*Background video*/}
      <video autoPlay loop muted playsInline className='absolute inset-0 w-full h-full object-cover z-0'>
        <source src="/auth-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>



      <form onSubmit={onSubmitHandler} className='bg-[#121212] z-20 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-orange-400'>Enter this 6-digit code sent to your email id.</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index} required
              className='w-12 h-12 bg-gray-700 text-white text-center text-xl rounded-md'
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <Button variant='primary' size='md' fullWidth type='submit' className="!rounded-full h-auto py-2"  >Submit</Button>
      </form>
      <Footer/>
    </div>
  )
}

export default EmailVerify