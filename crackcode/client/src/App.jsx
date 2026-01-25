// import { Routes, Route } from 'react-router-dom'
// import './App.css'
// import Home from './pages/home/Home'
// import Landing from './pages/landing/Landing'
// import EmailVerify from './pages/userauth/EmailVerify'
// import Login from './pages/userauth/Login'
// import ResetPassword from './pages/userauth/ResetPassword'
// import GameProfile from './pages/gameprofile/gameprofile'
// import UserProfile from './pages/userprofile/userprofile'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   return (
//     <div>
//       <ToastContainer />
//       <Routes>
//         <Route path='/' element={<Landing />} />
//         <Route path='/home' element={<Home />} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/email-verify' element={<EmailVerify />} />
//         <Route path='/reset-password' element={<ResetPassword />} />
//         <Route path='/game-profile' element={<GameProfile />} />
//         <Route path='/user-profile' element={<UserProfile />} />
//       </Routes>
//     </div>
//   )
// }

// export default App

import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import Landing from './pages/landing/Landing'
import EmailVerify from './pages/userauth/EmailVerify'
import Login from './pages/userauth/Login'
import ResetPassword from './pages/userauth/ResetPassword'
import GameProfile from './pages/gameprofile/gameprofile'
import UserProfile from './pages/userprofile/userprofile'
import CodeEditorPage from './pages/codeEditor/CodeEditorPage' // Import the editor page
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-account' element={<EmailVerify />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/gamer-profile' element={<GameProfile />} />
        <Route path='/user-profile' element={<UserProfile />} />
       
        {/* ✅ Temporary testing route for the Code Editor */}
        <Route path='/solve/:problemId' element={<CodeEditorPage />} />
      </Routes>
    </div>
  )
}

export default App
