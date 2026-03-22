import React, { useContext, useRef } from "react";
import { AppContent } from "../../context/userauth/authenticationContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import LetterGlitch from "../../components/bgEffect/LetterGlitch";

function EmailVerify() {
  const { backendUrl, getUserData, setIsLoggedIn } = useContext(AppContent);
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location?.state?.email || null;
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char;
    });
    const last = Math.min(pasteArray.length, 6) - 1;
    if (last >= 0) inputRefs.current[last]?.focus();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    const otp = inputRefs.current.map((el) => el?.value || "").join("");

    try {
      // Include email when verifying a pending registration
      const payload = emailFromState ? { email: emailFromState, otp } : { otp };
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, payload);

      if (data?.success) {
        // store access token if returned
        if (data.accessToken) {
          try {
            localStorage.setItem('accessToken', data.accessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          // eslint-disable-next-line no-unused-vars
          } catch (e) { /* empty */ }
        }
        toast.success(data.message || "Email verified successfully!");
        // User is now authenticated by the backend
        setIsLoggedIn(true);
        await getUserData();
        navigate("/gamer-profile");
      } else {
        toast.error(data?.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header variant="landing" />

      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchColors={['#ff6b35', '#f7c244', '#61b3dc', '#61dca3', '#e63946']}
          glitchSpeed={60}
          smooth={true}
          outerVignette={false}
          centerVignette={false}
          backgroundColor="#FFFDF1"
        />
      </div>

      {/* Card */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-md bg-[#FFFDF1] p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] border border-[#FFCE99]/60"
        >
          <h1 className="text-[#562F00] text-2xl font-extrabold text-center">
            Email Verify OTP
          </h1>

          <p className="text-center mt-2 text-sm text-[#562F00]/75 font-medium">
            Enter the 6-digit code sent to your email.
          </p>

          <div className="flex justify-between gap-2 mt-8 mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  required
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-center text-xl font-extrabold
                             bg-[#FFCE99]/20 text-[#562F00]
                             border border-[#FFCE99] shadow-sm
                             outline-none focus:border-[#FF9644] focus:ring-2 focus:ring-[#FF9644]/25
                             transition"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <Button
            variant="primary"
            size="md"
            fullWidth
            type="submit"
            className="!rounded-full h-auto py-3 !bg-[#FF9644] hover:!bg-[#562F00] !text-[#FFFDF1] font-bold shadow-lg shadow-[#FF9644]/35"
          >
            Submit
          </Button>

          <div className="mt-5 text-center text-xs text-[#562F00]/70">
            Didn’t get the code? <span className="font-bold text-[#FF9644]">Check spam/junk</span>.
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailVerify;
