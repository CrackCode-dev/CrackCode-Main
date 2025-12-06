import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  return (
    <div className='relative w-full h-full'>

        <div className='relative top-0 left-0 flex flex-col items-center text-center mt-50'>
          <h1 className='flex items-center gap-2 text-8xl sm:text-8xl text-white font-semibold mb-10'>
            Solve Mysteries <br /> Through Code</h1>

            <h2 className='text-2xl sm:text-2xl text-[#FFFFFF80] font-light mb-10'>
              Join the detective force and solve real-world coding challenges <br />
              wrapped in thrilling mystery narratives. Every case brings you <br />
              close to mastery. 
            </h2>

            <div className='flex flex-row items-center gap-5'>
              <button onClick={() => navigate('/login')} className='group flex items-center gap-2 justify-center border 
              border-none rounded-xl px-8 py-4 bg-[#018801] hover:bg-[#004C00] transition-all text-white font-medium text-2xl w-sm'>
                Start Your Investigation
                <img src={assets.right_arrow} alt="right-arrow" className='w-5 sm:w-5 transition-transform duration-200 group-hover:translate-x-[5px]'/>
              </button>

              <button className='flex items-center gap-2 justify-center border border-[#444040] rounded-xl px-8 py-4 bg-none hover:bg-[#444040] 
              transition-all text-white font-medium text-2xl'>Learn More</button>
            </div>
        </div>
    </div>
  )
}

export default Header
