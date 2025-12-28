import {Routes,Route} from 'react-
import './App.css'
import Home from './pages/home/Home'
import Landing from './pages/landing/Landing'
import UserProfile from './pages/userprofile/userprofile'
import GameProfile from './pages/gameprofile/gameprofile'

function App() {

  return (
    <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path ="/gameprofile" element={<GameProfile/>} />
        <Route path ="/userprofile" element={<UserProfile/>} />
    </Routes>
    
  )
}

export default App
