
import React, { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function EmailVerify() {

  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContent)
  const navigate = useNavigate()
  const inputRefs = React.useRef([])

  const handleInput = (e, index) => { 
    if(e.target.value.length > 0 && index < inputRefs.current.length -  1){
      inputRefs.current[index + 1].focus();
    }
  } 

  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    });
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp})

      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // Effect to protect the route
  useEffect(()=>{
    if(isLoggedIn && userData && userData.isAccountVerified){
        navigate('/')
    }
  },[isLoggedIn, userData])

  return (
   
    <div className='flex felx-col items-center justify-center min-h-screen bg-[#050505]'>
      <Navbar/>

      <form onSubmit={onSubmitHandler} className='bg-[#121212] p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-[#018801]'>Enter this 6-digit code sent to your email id.</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index} required
            className='w-12 h-12 bg-gray-500 text-white text-center text-xl rounded-md'
            ref={e => inputRefs.current[index] = e}
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button className='w-full py-3 bg-[#018801] hover:bg-[#018801a3] rounded-full text-white font-medium'>Verify Email</button>
      </form>
    </div>
  )
}

export default EmailVerify