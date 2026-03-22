import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContent } from "../../context/userauth/authenticationContext";
import axios from "axios";
import api from "../../api/axios";
import LetterGlitch from "../../components/bgEffect/LetterGlitch";
import { toast } from "react-toastify";
import { Mail, LockKeyhole, UserRound } from "lucide-react";
import logo_dark from "../../assets/logo/logo_dark.png";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTC, setAcceptedTC] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPassword("");
    setConfirmPassword("");
    setAcceptedTC(false);
  }, [state]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (state === "Sign Up") {
        if (password !== confirmPassword) {
          return toast.error("Passwords do not match!");
        }
        if (!acceptedTC) {
          return toast.error("You must accept the Terms and Conditions.");
        }

        const { data } = await api.post(`/auth/register`, {
          name,
          email,
          password,
        });

        if (data?.success) {
          // Registration created a pending account and OTP was sent.
          toast.success("OTP sent to your email.");
          // Navigate to verify page and pass email so verify endpoint can complete registration
          navigate("/verify-account", { state: { email } });
        } else {
          toast.error(data?.message || "Registration failed.");
        }
      } else {
        const { data } = await api.post(`/auth/login`, {
          email,
          password,
        });

        if (data?.success) {
          // Store the access token if returned from backend
          if (data.accessToken) {
            try {
              localStorage.setItem('accessToken', data.accessToken);
              api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            } catch (e) {}
          }
          
          setIsLoggedIn(true);
          await getUserData();  // Wait for user data to load before navigating
          console.log("✅ User logged in and data loaded");

          // If the returned user isn't verified, prompt verification flow
          if (data.user && !data.user.isAccountVerified) {
            try {
              await api.post(`/auth/send-verify-otp`);
              toast.info("Please verify your email. OTP sent to your email.");
            } catch (err) {
              console.log("OTP send error on login:", err);
              toast.info("Please verify your email.");
            }
            navigate("/verify-account");
          } else {
            toast.success("Welcome back!");
            navigate("/home");  // Navigate AFTER auth state + user data are fully loaded
          }
        } else {
          toast.error(data?.message || "Login failed.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    // Letter glitch background effect
    <div className="min-h-screen relative overflow-hidden">
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

      {/* Center card */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        {/* MAIN CARD (Fixed h-[650px] so it won't resize) */}
        <div className="flex w-full max-w-5xl bg-[#FFFDF1] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden h-[650px]">
          
          {/* ================= LEFT PANEL ================= */}
          <div className="hidden md:flex w-1/2 relative overflow-hidden">
            {/* Left panel background (gradient within palette) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#562F00] to-[#3B1F00]" />
            <div className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,206,153,0.8) 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />

            {/* Left content (as per your latest request) */}
            <div className="relative z-10 flex flex-col justify-center h-full p-12 text-[#FFFDF1]">
              <h1 className="text-4xl font-extrabold leading-tight">
                Code. Compete. Conquer.
              </h1>

              <p className="mt-4 text-base leading-relaxed text-[#FFCE99]/90 max-w-md">
                A platform designed to help you master coding skills,
                build careers in a more engaging way.
              </p>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="w-full md:w-1/2 flex flex-col p-8 sm:p-12 relative bg-[#FFFDF1]">
            {/* TOP HEADER */}
            <div className="flex items-center justify-between w-full mb-4 z-10">
              <div className="flex items-center gap-3">
                <img src={logo_dark} alt="CrackCode Logo" className="h-10 drop-shadow-sm" />
              </div>

              <div className="flex bg-[#FFCE99]/30 rounded-full p-1 shadow-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setState("Login")}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    state === "Login"
                      ? "bg-[#FF9644] text-[#FFFDF1] shadow-md"
                      : "text-[#562F00] hover:bg-[#FFCE99]/50"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setState("Sign Up")}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    state === "Sign Up"
                      ? "bg-[#FF9644] text-[#FFFDF1] shadow-md"
                      : "text-[#562F00] hover:bg-[#FFCE99]/50"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* FORM WRAPPER */}
            <div className="flex-grow flex flex-col justify-center max-w-sm w-full mx-auto relative z-10">
              <div className="mb-8 text-center md:text-left">
                <h3 className="text-3xl font-extrabold text-[#562F00]">
                  {state === "Login" ? "Login to Account" : "Create Account"}
                </h3>
                <p className="text-sm text-[#562F00]/70 mt-2 font-medium">
                  {state === "Login" ? "Welcome back." : "Create your account to begin."}
                </p>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-4">
                {state === "Sign Up" && (
                  <div className="relative flex items-center bg-[#FFCE99]/20 rounded-xl px-4 py-3 border border-[#FFCE99] focus-within:border-[#FF9644] transition-colors shadow-sm">
                    <UserRound className="text-[#FF9644] w-5 h-5 mr-3" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50 font-medium"
                    />
                  </div>
                )}

                <div className="relative flex items-center bg-[#FFCE99]/20 rounded-xl px-4 py-3 border border-[#FFCE99] focus-within:border-[#FF9644] transition-colors shadow-sm">
                  <Mail className="text-[#FF9644] w-5 h-5 mr-3" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50 font-medium"
                  />
                </div>

                <div className="relative flex items-center bg-[#FFCE99]/20 rounded-xl px-4 py-3 border border-[#FFCE99] focus-within:border-[#FF9644] transition-colors shadow-sm">
                  <LockKeyhole className="text-[#FF9644] w-5 h-5 mr-3" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50 font-medium"
                  />
                </div>

                {state === "Sign Up" && (
                  <div className="relative flex items-center bg-[#FFCE99]/20 rounded-xl px-4 py-3 border border-[#FFCE99] focus-within:border-[#FF9644] transition-colors shadow-sm">
                    <LockKeyhole className="text-[#FF9644] w-5 h-5 mr-3" />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-transparent outline-none flex-1 text-[#562F00] placeholder:text-[#562F00]/50 font-medium"
                    />
                  </div>
                )}

                {state === "Login" && (
                  <div className="flex justify-end mt-2">
                    <Link
                      to="/reset-password"
                      className="text-sm font-bold text-[#FF9644] hover:text-[#562F00] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {state === "Sign Up" && (
                  <div className="flex items-start mt-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={acceptedTC}
                      onChange={(e) => setAcceptedTC(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#FF9644] cursor-pointer"
                    />
                    <label htmlFor="terms" className="ml-2 text-xs text-[#562F00] font-medium leading-relaxed">
                      I agree to the{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#FF9644] font-bold hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FF9644] font-bold hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || (state === "Sign Up" && !acceptedTC)}
                  className="w-full mt-6 py-4 rounded-xl bg-[#FF9644] text-[#FFFDF1] font-bold text-lg hover:bg-[#562F00] transition-all duration-300 shadow-xl shadow-[#FF9644]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF9644]"
                >
                  {isSubmitting ? "Please wait..." : state === "Login" ? "Sign In" : "Create Account"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
