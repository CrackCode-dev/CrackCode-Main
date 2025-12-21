

import { useEffect, useState } from "react"
import { Button } from "./ui/button.jsx"
import DotBackground from "./ui/dot-background.jsx"
import { ChevronDown } from "lucide-react"
// Import the logo
import logo from "../assets/CrackCode-Logo.png"

export default function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle Scroll Animation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Orange Dots Animation */}
      <DotBackground color="#f97316" />

      {/* Cool Animated Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${
          isScrolled
            ? "bg-[#050505]/80 backdrop-blur-md border-white/10 py-4 shadow-lg shadow-orange-500/5"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              {/* Updated Logo Image */}
              <img 
                src={logo} 
                alt="CrackCode Logo" 
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            {/* Removed text span since logo likely contains text, or keep if needed */}
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Home", "Problem", "Solution", "Team", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                // Increased font size from text-sm to text-lg
                className="relative text-lg font-medium text-muted-foreground hover:text-orange-500 transition-colors group"
              >
                {item}
                {/* Underline Animation */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          
          <Button 
            size="lg" 
            className={`transition-all duration-300 ${
              isScrolled 
                ? "bg-orange-600 hover:bg-orange-700" 
                : "bg-orange-500 hover:bg-orange-600"
            } text-white shadow-lg shadow-orange-500/20 text-base px-6`}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight tracking-tight">
            Learn Coding Through
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"> Epic Stories</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
            Master programming by solving detective cases, catching serial killers, and exploring narratives. CrackCode
            makes learning addictive.
          </p>
          
          {/* Arrow and Button Group */}
          <div className="flex flex-col justify-center items-center gap-6 pt-8">
            <ChevronDown className="h-8 w-8 text-orange-500 animate-bounce" />
            
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-8 text-xl rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_-5px_rgba(249,115,22,0.6)]"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}