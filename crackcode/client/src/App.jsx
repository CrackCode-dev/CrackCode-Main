import {Routes,Route} from 'react-router-dom'
import UserProfile from './pages/userprofile/userprofile'
import './App.css'

function App() {

  return (
    <Routes>
        <Route path ="/userprofile" element={<UserProfile/>} />
    </Routes>
    
  )
}

export default App
