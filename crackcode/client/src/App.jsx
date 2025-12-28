import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import Landing from './pages/landing/Landing'
import GameProfile from './pages/gameprofile/gameprofile'
import UserProfile from './pages/userprofile/userprofile'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/home' element={<Home />} />
      <Route path='/gameprofile' element={<GameProfile />} />
      <Route path='/userprofile' element={<UserProfile/>} />
    </Routes>
  )
}

export default App
