import React from 'react'

function Title() {
  return (
    <div className='relative flex items-center justify-center'>

        {/* Title Section */}
        <section id="title-section" className=''>
            <div className='text-center space-y-6 px-4 md:px-0 py-20 md:py-32'>
                <h1 className='text-5xl md:text-7xl font-bold leading-tight tracking-tight'>
                    Solve Mysteries <br />Through <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600'>Code</span>
                </h1>
                <p className="text-xl md:text-xl text-[#FFFFFF80] text-balance max-w-3xl mx-auto leading-relaxed">
                Join the detective force and solve real-world coding challenges wrapped in thrilling mystery narratives. 
                Every case brings you close to <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600'>mastery</span>.
                </p>
            </div>
        </section>

        

    </div>
  )
}

export default Title
