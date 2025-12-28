import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'

function Home() {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <Header variant="default" />
      <main></main>
      <Footer />
    </div>
  )
}

export default Home
