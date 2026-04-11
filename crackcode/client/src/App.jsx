import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/theme/ThemeContext";
import { UserProgressProvider } from "./context/userauth/UserProgressContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Pages
import Home from "./pages/home/Home";
import Landing from "./pages/landing/Landing";
import EmailVerify from "./pages/userauth/EmailVerify";
import Login from "./pages/userauth/Login";
import ResetPassword from "./pages/userauth/ResetPassword";
import CareermapMain from "./pages/careermap/CareermapMain";
import GameProfile from "./pages/gameprofile/gameprofile";
import UserProfile from "./pages/userprofile/userprofile";
import CodeEditorPage from "./pages/codeEditor/CodeEditorPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import CaseLogMainPage from "./pages/caselog/CaseLogMainPage";
import Leaderboard from "./pages/leaderboard/leaderboardPage";
import LearnMainPage from "./pages/learn/LearnMainPage";
import WeeklyChallenges from "./pages/weeklychallenges/weeklyChallenges.jsx";
import ChapterSelectionPage from "./pages/learn/ChapterSelection";
import QuestionListPage from "./pages/learn/SubChapterSelection";
import DetectiveStore from "./pages/shop/DetectiveStore";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/legal/TermsAndConditionsPage";
import ContactUsPage from "./pages/legal/ContactUsPage";

import CareerChapterSelectionPage from "./pages/careermap/CareerChapterSelection.jsx";
import CareerQuizPage from "./pages/careermap/CareerQuizPage.jsx";

function App() {
  return (
    <ThemeProvider>
      <UserProgressProvider>
        <ToastContainer />

        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-account" element={<EmailVerify />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />

          <Route path='/careermap' element={<CareermapMain />} />
          <Route path='/careermap/:careerId/quiz/:chapterId' element={<CareerQuizPage />} />

          <Route path="/caselog" element={<CaseLogMainPage />} />

          <Route path="/weeklychallenges" element={<WeeklyChallenges />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route path="/learn" element={<LearnMainPage />} />
          <Route path="/learn/:trackId" element={<ChapterSelectionPage />} />
          <Route path="/learn/:trackId/:difficultyId" element={<QuestionListPage />} />

          <Route path="/store" element={<DetectiveStore />} />

          {/* Protected routes */}
          <Route path="/home" element={<Home />} />

          <Route path="/user-profile" element={<UserProfile />} />

          <Route
            path="/gamer-profile"
            element={
              <ProtectedRoute>
                <GameProfile />
              </ProtectedRoute>
            }
          />

          <Route path="/careermap/:careerId" element={
            // <ProtectedRoute>
            <CareerChapterSelectionPage />
            // </ProtectedRoute>
          } />
          <Route
            path="/solve/:problemId"
            element={
              <ProtectedRoute>
                <CodeEditorPage />
              </ProtectedRoute>
            }
          />

          <Route path="/code-editor/:problemId" element={<CodeEditorPage />} />
          <Route path="/code-editor" element={<CodeEditorPage />} />

        </Routes>
      </UserProgressProvider>
    </ThemeProvider>
  );
}

export default App;

