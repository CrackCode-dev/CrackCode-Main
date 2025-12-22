import {Routes,Route} from 'react-router-dom'
import UserProfile from './pages/userprofile/userprofile'
import GameProfile from './pages/gameprofile/gameprofile'
import './App.css'

function App() {

  return (
    <Routes>
        <Route path ="/gameprofile" element={<GameProfile/>} />
        <Route path ="/userprofile" element={<UserProfile/>} />
    </Routes>
    
  )
}

export default App
