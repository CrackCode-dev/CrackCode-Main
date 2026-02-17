<<<<<<< HEAD
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

import { BrowserRouter, Routes, Route } from "react-router-dom";
=======
import { Routes, Route } from 'react-router-dom'
>>>>>>> Shenori
import './App.css'

import Home from './pages/home/Home'
import Landing from './pages/landing/Landing'
import EmailVerify from './pages/userauth/EmailVerify'
import Login from './pages/userauth/Login'
import ResetPassword from './pages/userauth/ResetPassword'
import CareermapMain from './pages/careermap/CareermapMain'
import GameProfile from './pages/gameprofile/GameProfile'
import UserProfile from './pages/userprofile/UserProfile'
import CodeEditorPage from './pages/codeEditor/CodeEditorPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import CaseLogMainPage from './pages/caselog/CaseLogMainPage'
import CaseLogPage from './pages/caselog/CaseLogPage'
import Leaderboard from './pages/leaderboard/leaderboardPage'
import LearnMainPage from './pages/learn/LearnMainPage'
import WeeklyChallenges from "./pages/weeklychallenges/weeklyChallenges.jsx";

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
<<<<<<< HEAD
        <Route path='/careermaps-Main'element={<CareermapMain/>}/>
        
        {/* Protected routes - require login + verified email */}
        <Route path='/home' element={
          // <ProtectedRoute>   //temp unwrapped to bypass auth when navigating to home(dev stage)
            <Home />
          // </ProtectedRoute>
        } />
        <Route path='/gamer-profile' element={
          <ProtectedRoute>
            <GameProfile />
          </ProtectedRoute>
        } />
        <Route path='/user-profile' element={
          // <ProtectedRoute>
            <UserProfile />
          // </ProtectedRoute>
        } />
        <Route path='/learn' element={
          // <ProtectedRoute>
            <LearnMainPage />
          // </ProtectedRoute>
        } />
        <Route path="/weeklychallenges" element={
          <WeeklyChallenges />
        } />
=======

        <Route path='/caselog' element={<CaseLogMainPage />} />
        <Route path='/caselog/details' element={<CaseLogPage />} />
        <Route path='/careermaps-Main' element={<CareermapMain />} />
        <Route path='/leaderboard' element={<Leaderboard />} />

        {/* Protected routes */}
        <Route
          path='/home'
          element={
            // <ProtectedRoute>
              <Home />
            // </ProtectedRoute>
          }
        />

        <Route
          path='/gamer-profile'
          element={
            <ProtectedRoute>
              <GameProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/user-profile'
          element={
            // <ProtectedRoute>
              <UserProfile />
            // </ProtectedRoute>
          }
        />

        <Route
          path='/solve/:problemId'
          element={
            <ProtectedRoute>
              <CodeEditorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/learn'
          element={
            // <ProtectedRoute>
              <LearnMainPage />
            // </ProtectedRoute>
          }
        />
>>>>>>> Shenori

      </Routes>
    </div>
  )
}

export default App;


