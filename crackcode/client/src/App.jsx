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
import CodeEditorPage from './pages/codeEditor/CodeEditorPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CaseLogMainPage from "./pages/caselog/CaseLogMainPage";
import CaseLogPage from "./pages/caselog/CaseLogPage";



function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-account' element={<EmailVerify />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/caselog" element={<CaseLogMainPage />} />
        <Route path="/caselog" element={<CaseLogPage />} />
        
        
        {/* Protected routes - require login + verified email */}
        <Route path='/home' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/gamer-profile' element={
          <ProtectedRoute>
            <GameProfile />
          </ProtectedRoute>
        } />
        <Route path='/user-profile' element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path='/solve/:problemId' element={
          <ProtectedRoute>
            <CodeEditorPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
