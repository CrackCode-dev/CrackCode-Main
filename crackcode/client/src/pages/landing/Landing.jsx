// import React from 'react'
import LetterGlitch from '../../components/bgEffect/LetterGlitch';
import Header from '../../components/common/Header'
import Title from '../../components/landing/Title'
import Footer from '../../components/common/Footer'

function Landing() {

  return (
    <div className='relative w-full h-screen'>

      <div className='fixed inset-0 -z-10'>
        <LetterGlitch glitchSpeed={100} smooth={true} outerVignette={true} centerVignette={true} />
      </div>
      
      <div className='relative z-10'>
        <Header variant="landing" />
        <Title />
        <Footer variant='landing' />  
      </div>
      
    </div>
  )
}

export default Landing
