import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#050505]'>
      <Navbar/>
      <Header/>
      <Footer/>
    </div>
  )
}

export default LandingPage
