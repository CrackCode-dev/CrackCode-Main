// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import Header from '../../components/common/Header'
// import Footer from '../../components/common/Footer'

// function Home() {
//   const navigate = useNavigate()

//   return (
//     <div className='min-h-screen flex flex-col justify-between'>
//       <Header variant="default" />
//       <main></main>
//       <Footer />
//     </div>
//   )
// }

// export default Home



import React from 'react'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'

function Home() {
  return (
    <div className='min-h-screen flex flex-col justify-between bg-[#050505] text-white'>
      <Header variant="default" />
      
      <main className="flex-grow flex flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400">Welcome, Detective</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          Ready to review your case files and crack the code? 
          Access your active investigations via the <span className="text-cyan-400 font-semibold">Learn</span> tab above.
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default Home