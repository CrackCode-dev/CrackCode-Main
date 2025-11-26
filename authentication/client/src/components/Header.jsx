import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-white'>
        
      <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6 '/>
      
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Detective
            <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
        </h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our platform</h2>

      <p className='mb-8 max-w-md'>Let the journey of programming begins!</p>

      <button onClick={() => navigate('/login')} className='border border-none rounded-2xl px-8 py-2.5 bg-[#018801] hover:bg-[#018801a3] transition-all'>Get Started</button>
    </div>
  )
}

export default Header
