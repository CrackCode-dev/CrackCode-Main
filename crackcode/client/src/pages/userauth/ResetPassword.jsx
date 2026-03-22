import React, { useContext, useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Mail, RectangleEllipsis } from "lucide-react";
import { AppContent } from "../../context/userauth/authenticationContext";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../components/common/Header";
import LetterGlitch from "../../components/bgEffect/LetterGlitch";

function ResetPassword() {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef([]);

  // ===== OTP Handling =====
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < 5) {
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
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // ===== 1. Send Email =====
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );

      if (data?.success) {
        toast.success(data.message || "OTP sent successfully");
        setIsEmailSent(true);
      } else {
        toast.error(data?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== 2. Submit OTP =====
  const onSubmitOTP = (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current
      .map((el) => el?.value || "")
      .join("");

    if (otpValue.length !== 6) {
      return toast.error("Please enter full 6-digit OTP");
    }

    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };

  // ===== 3. Reset Password =====
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword }
      );

      if (data?.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data?.message || "Reset failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header variant="landing" />

      {/* Letter Glitch Background Effect */}
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

      {/* Center Wrapper */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md mx-auto bg-[#FFFDF1] p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#FFCE99]/50">

          {/* STEP 1: EMAIL */}
          {!isEmailSent && (
            <>
              <h1 className="text-[#562F00] text-2xl font-extrabold text-center">
                Reset Password
              </h1>

              <p className="text-center mt-2 text-sm text-[#562F00]/75">
                Enter your registered email address.
              </p>

              <form onSubmit={onSubmitEmail} className="mt-6 space-y-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#FFCE99]/20 border border-[#FFCE99] focus-within:border-[#FF9644] transition">
                  <Mail className="w-5 h-5 text-[#FF9644]" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50"
                  />
                </div>

                <Button
                  fullWidth
                  type="submit"
                  className="!rounded-full py-3 !bg-[#FF9644] hover:!bg-[#562F00] !text-[#FFFDF1] font-bold shadow-lg"
                >
                  {isSubmitting ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            </>
          )}

          {/* STEP 2: OTP */}
          {!isOtpSubmitted && isEmailSent && (
            <>
              <h1 className="text-[#562F00] text-2xl font-extrabold text-center">
                Enter OTP
              </h1>

              <p className="text-center mt-2 text-sm text-[#562F00]/75">
                Enter the 6-digit code sent to your email.
              </p>

              <form onSubmit={onSubmitOTP} className="mt-6">
                <div className="flex justify-between mb-6 gap-2" onPaste={handlePaste}>
                  {Array(6).fill(0).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      required
                      className="w-12 h-12 rounded-xl text-center text-lg font-bold bg-[#FFCE99]/20 border border-[#FFCE99] focus:border-[#FF9644] outline-none"
                      ref={(el) => (inputRefs.current[index] = el)}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>

                <Button
                  fullWidth
                  type="submit"
                  className="!rounded-full py-3 !bg-[#FF9644] hover:!bg-[#562F00] !text-[#FFFDF1] font-bold shadow-lg"
                >
                  Verify OTP
                </Button>
              </form>
            </>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {isOtpSubmitted && isEmailSent && (
            <>
              <h1 className="text-[#562F00] text-2xl font-extrabold text-center">
                Set New Password
              </h1>

              <p className="text-center mt-2 text-sm text-[#562F00]/75">
                Enter your new password below.
              </p>

              <form onSubmit={onSubmitNewPassword} className="mt-6 space-y-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#FFCE99]/20 border border-[#FFCE99] focus-within:border-[#FF9644] transition">
                  <RectangleEllipsis className="w-5 h-5 text-[#FF9644]" />
                  <input
                    type="password"
                    placeholder="New password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50"
                  />
                </div>

                <Button
                  fullWidth
                  type="submit"
                  className="!rounded-full py-3 !bg-[#FF9644] hover:!bg-[#562F00] !text-[#FFFDF1] font-bold shadow-lg"
                >
                  {isSubmitting ? "Updating..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => navigate("/login")}
              className="text-[#FF9644] font-bold hover:text-[#562F00]"
            >
              Back to Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
