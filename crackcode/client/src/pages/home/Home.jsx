import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Header variant="default" />
    </>
  )
}

export default Home
