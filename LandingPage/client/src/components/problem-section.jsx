import { useEffect, useRef } from "react"
import DotBackground from "./ui/dot-background.jsx"
import { AlertCircle, Brain, BookOpen, Zap, Clock, TrendingDown } from "lucide-react"

export default function ProblemSection() {
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

  const problems = [
    {
      icon: AlertCircle,
      title: "Boring Traditional Learning",
      description: "Students lose interest in dry textbooks and repetitive coding exercises that lack context and real-world engagement.",
    },
    {
      icon: Brain,
      title: "No Real-World Context",
      description: "Learning syntax in isolation without understanding practical applications makes knowledge hard to retain and apply.",
    },
    {
      icon: BookOpen,
      title: "Lack of Motivation",
      description: "Without gamification, progress tracking, and rewards, students struggle to maintain consistency in their learning journey.",
    },
    {
      icon: Zap,
      title: "Career Path Confusion",
      description: "Beginners feel overwhelmed choosing between frontend, backend, ML, and other paths without proper guidance or roadmaps.",
    },
    {
      icon: Clock,
      title: "Time-Wasting Resources",
      description: "Jumping between YouTube tutorials, documentation, and random courses leads to scattered learning with no clear progression.",
    },
    {
      icon: TrendingDown,
      title: "Imposter Syndrome",
      description: "Without measurable achievements and community support, many learners doubt their progress and give up prematurely.",
    },
  ]

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#050505] overflow-hidden"
    >
      <DotBackground color="#ef4444" />

      {/* Dramatic gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 text-sm font-medium mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>The Challenge</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Traditional Coding Education is <span className="text-red-500">Broken</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-2xl mx-auto">
            Students face multiple barriers that prevent them from becoming successful developers. Here's what's holding them back.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="fade-in-section opacity-0 transition-all duration-700 translate-y-10"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="group relative h-full p-6 md:p-8 bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl hover:border-red-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 overflow-hidden">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                {/* Icon */}
                <div className="relative z-10 mb-5">
                  <div className="p-3 bg-red-500/10 rounded-xl w-fit group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300">
                    <problem.icon className="h-6 w-6 text-red-500" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-card-foreground group-hover:text-red-400 transition-colors duration-300">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {problem.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 fade-in-section opacity-0 transition-all duration-1000 translate-y-10" style={{ transitionDelay: '600ms' }}>
          <p className="text-lg text-muted-foreground mb-4">Sound familiar? There's a better way.</p>
          <a 
            href="#solution" 
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            See Our Solution
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />

      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  )
}