import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  return (
    <div className='relative w-full'>
        {/* Section 1 */}
        <div className='relative flex flex-col items-center justify-center text-center bg-none h-[800px] pt-32'>
          
          {/* <video src={assets.BgVideo} autoPlay loop muted playsInline className='absolute top-0 left-0 w-full h-full object-cover -z-10' /> */}

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

        {/* Section 2 */}
        <div className='relative flex flex-col items-center justify-center text-center bg-none h-[800px] mt-20'>
          <div className='flex flex-row items-center justify-center gap-10'>
            
            {/* Info Card 1 */}
            <div className='bg-[#44404080] border-[#444040] rounded-2xl mt-10 px-5 py-8 text-left'>
              <img src={assets.script} alt="" className='w-15 mb-5'/>
              <h1 className='text-white text-2xl font-bold mb-5'>Narrative Driven</h1>
              <p className='text-[#FFFFFF80] font-light'>Every challenge is wrapped <br /> in an engaging detective <br /> story that makes learning <br /> fun. </p>
            </div>

            {/* Info Card 2 */}
            <div className='bg-[#44404080] border-[#444040] rounded-2xl mt-10 px-5 py-8 text-left'>
              <img src={assets.script} alt="" className='w-15 mb-5'/>
              <h1 className='text-white text-2xl font-bold mb-5'>Narrative Driven</h1>
              <p className='text-[#FFFFFF80] font-light'>Every challenge is wrapped <br /> in an engaging detective <br /> story that makes learning <br /> fun. </p>
            </div>

            {/* Info Card 3 */}
            <div className='bg-[#44404080] border-[#444040] rounded-2xl mt-10 px-5 py-8 text-left'>
              <img src={assets.script} alt="" className='w-15 mb-5'/>
              <h1 className='text-white text-2xl font-bold mb-5'>Narrative Driven</h1>
              <p className='text-[#FFFFFF80] font-light'>Every challenge is wrapped <br /> in an engaging detective <br /> story that makes learning <br /> fun. </p>
            </div> 

          </div>
        </div>

    </div>
  )
}

export default Header
