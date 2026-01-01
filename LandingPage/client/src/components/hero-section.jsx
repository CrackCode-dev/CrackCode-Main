import { useEffect, useState } from "react"
import { Button } from "./ui/button.jsx"
import DotBackground from "./ui/dot-background.jsx"
import { ChevronDown, Code2, Sparkles, BookOpen, Trophy } from "lucide-react"
import logo from "../assets/CrackCode-Logo.png"

export default function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      <DotBackground color="#f97316" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-b ${
          isScrolled
            ? "bg-[#050505]/90 backdrop-blur-xl border-white/10 py-3 shadow-2xl shadow-orange-500/5"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <img 
                src={logo} 
                alt="CrackCode Logo" 
                className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </a>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {["Home", "Problem", "Solution", "Preview", "Team", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-sm lg:text-base font-medium text-muted-foreground hover:text-orange-500 transition-all duration-300 group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          
          <Button 
            size="lg" 
            className={`transition-all duration-500 ${
              isScrolled 
                ? "bg-orange-600 hover:bg-orange-700 scale-95" 
                : "bg-orange-500 hover:bg-orange-600"
            } text-white shadow-lg shadow-orange-500/25 text-sm lg:text-base px-4 lg:px-6`}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-20">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-sm font-medium animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>The Future of Coding Education</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-balance leading-[1.1] tracking-tight animate-fade-in-up delay-100">
            Learn Coding Through
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 
            animate-gradient"> Epic Stories</span>
          </h1>
          
          <p className="text-xl sm:text-xl md:text-xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Master programming by solving detective cases, catching serial killers, and exploring immersive narratives. CrackCode makes learning <span className="text-orange-400 font-medium">addictive</span>.
          </p>

          {/* Animated Feature Icons - Replacing Numbers */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-6 animate-fade-in-up delay-300">
            <div className="flex flex-col items-center gap-3 group">
              <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all duration-300">
                <BookOpen className="w-8 h-8 text-orange-500 animate-float" />
              </div>
              <span className="text-sm text-muted-foreground font-bold">Story-Driven</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all duration-300">
                <Code2 className="w-8 h-8 text-orange-500 animate-float delay-200" />
              </div>
              <span className="text-sm text-muted-foreground">Real Code</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all duration-300">
                <Trophy className="w-8 h-8 text-orange-500 animate-float delay-400" />
              </div>
              <span className="text-sm text-muted-foreground">Gamified</span>
            </div>
          </div>
          
          {/* CTA - Single Button Only */}
          <div className="flex flex-col items-center gap-6 pt-8 animate-fade-in-up delay-400">
            <ChevronDown className="h-8 w-8 text-orange-500 animate-bounce" />
            
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-7 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .delay-1000 { animation-delay: 1s; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </section>
  )
}