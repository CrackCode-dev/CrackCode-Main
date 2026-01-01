import { useEffect, useRef } from "react"
import DotBackground from "./ui/dot-background.jsx"
import { UserPlus, Map, Code2, Trophy, Rocket } from "lucide-react"

export default function HowItWorksSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll(".fade-in-section")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Create Your Detective Profile",
      description: "Sign up and customize your detective avatar. Choose your code name and set up your virtual office.",
      color: "orange"
    },
    {
      icon: Map,
      step: "02", 
      title: "Choose Your Path",
      description: "Select your career track: Frontend Forensics, Backend Investigations, Data Detective, or Full-Stack Specialist.",
      color: "cyan"
    },
    {
      icon: Code2,
      step: "03",
      title: "Solve Cases With Code",
      description: "Dive into immersive mystery stories where every coding challenge brings you closer to cracking the case.",
      color: "emerald"
    },
    {
      icon: Trophy,
      step: "04",
      title: "Earn & Compete",
      description: "Collect badges, climb leaderboards, and unlock rewards as you master new programming concepts.",
      color: "purple"
    },
    {
      icon: Rocket,
      step: "05",
      title: "Launch Your Career",
      description: "Build a portfolio of solved cases, earn certifications, and showcase your skills to potential employers.",
      color: "pink"
    }
  ]

  const colorMap = {
    orange: { 
      bg: "bg-orange-500/10", 
      border: "border-orange-500/30", 
      borderHover: "group-hover:border-orange-500/60",
      text: "text-orange-500", 
      textHover: "group-hover:text-orange-400",
      glow: "group-hover:shadow-orange-500/20", 
      dot: "bg-orange-500"
    },
    cyan: { 
      bg: "bg-cyan-500/10", 
      border: "border-cyan-500/30", 
      borderHover: "group-hover:border-cyan-500/60",
      text: "text-cyan-500", 
      textHover: "group-hover:text-cyan-400",
      glow: "group-hover:shadow-cyan-500/20",
      dot: "bg-cyan-500" 
    },
    emerald: { 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/30", 
      borderHover: "group-hover:border-emerald-500/60",
      text: "text-emerald-500", 
      textHover: "group-hover:text-emerald-400",
      glow: "group-hover:shadow-emerald-500/20", 
      dot: "bg-emerald-500"
    },
    purple: { 
      bg: "bg-purple-500/10", 
      border: "border-purple-500/30", 
      borderHover: "group-hover:border-purple-500/60",
      text: "text-purple-500", 
      textHover: "group-hover:text-purple-400",
      glow: "group-hover:shadow-purple-500/20",
      dot: "bg-purple-500" 
    },
    pink: { 
      bg: "bg-pink-500/10", 
      border: "border-pink-500/30", 
      borderHover: "group-hover:border-pink-500/60",
      text: "text-pink-500", 
      textHover: "group-hover:text-pink-400",
      glow: "group-hover:shadow-pink-500/20",
      dot: "bg-pink-500" 
    }
  }

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef} 
      className="relative py-24 md:py-32 bg-[#050505] overflow-hidden"
    >
      <DotBackground color="#8b5cf6" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-500 text-sm font-medium mb-6">
            <Map className="w-4 h-4" />
            <span>Your Journey</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            How <span className="text-purple-500">CrackCode</span> Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-2xl mx-auto">
            From rookie to senior detective in 5 simple steps. Your coding journey starts here.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="max-w-5xl mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-emerald-500 to-pink-500 opacity-30 hidden md:block" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, index) => {
              const colors = colorMap[step.color]
              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className={`fade-in-section opacity-0 transition-all duration-700 ${
                    isEven ? 'md:translate-x-[-50px]' : 'md:translate-x-[50px]'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`flex flex-col md:flex-row items-start md:items-center gap-6 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Content Card */}
                    <div className={`flex-1 ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12 '}`}>
                      <div className={`inline-block p-6 md:p-8 bg-card border ${colors.border} ${colors.borderHover} rounded-2xl hover:shadow-xl ${colors.glow} transition-all duration-500 
                      group hover:-translate-y-3 hover:shadow-2xl hover:shadow-${step.color}-500/20 hover:bg-white/[0.02] hover:bg-[color]/20`}>
                        <div className={`flex items-center gap-4 mb-4 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`p-3 ${colors.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                            <step.icon className={`h-6 w-6 ${colors.text} ${colors.textHover}`} />
                          </div>
                          <span className={`text-4xl font-bold ${colors.text} ${colors.textHover} opacity-50 group-hover:opacity-100 transition-all duration-300`}>{step.step}</span>
                        </div>
                        <h3 className={`text-xl md:text-2xl font-bold ${colors.textHover} mb-3 transition-all duration-300`}>{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>

                    {/* Center Dot */}
                    <div className="hidden md:flex items-center justify-center w-4 h-4 relative z-10">
                      <div className={`w-4 h-4 rounded-full ${colors.bg} border-2 ${colors.border}`}>
                        <div className={`w-2 h-2 rounded-full ${colors.dot} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />
                      </div>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 fade-in-section opacity-0 transition-all duration-1000 translate-y-10" style={{ transitionDelay: '800ms' }}>
          <p className="text-muted-foreground mb-6">Ready to start your detective training?</p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25">
            <Rocket className="w-5 h-5" />
            Begin Your Journey
          </button>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[200px] pointer-events-none" />

      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }
      `}</style>
    </section>
  )
}