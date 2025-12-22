import React from 'react'

function Title() {
  return (
    <div className='relative flex items-center justify-center bg-[#050505]'>
        <section className=''>
            <div>
                <h1 className='text-5xl md:text-7xl font-bold leading-tight tracking-tight'>
                    Solve Mysteries Through <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600'>Code</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
                Join the detective force and solve real-world coding challenges wrapped in thrilling mystery narratives. 
                Every case brings you close to mastery.
                </p>
            </div>
        </section>

    </div>
  )
}

export default Title
