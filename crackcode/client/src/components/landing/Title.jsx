import React from 'react'

function Title() {
  return (
    <section id='intro' className='relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]'>
        <div className='relative z-10 container mx-auto px-4 text-center mt-16'>
            <div className='max-w-5xl mx-auto space-y-8'>
                <h1 className='text-5xl md:text-7xl font-bold text-balance leading-tight tracking-tight'>
                    Solve Mysteries Through <span className='text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600'>Code</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
                Join the detective force and solve real-world coding challenges wrapped in thrilling mystery narratives. 
                Every case brings you close to mastery.
                </p>
            </div>
        </div>     
    </section>
  )
}

export default Title
