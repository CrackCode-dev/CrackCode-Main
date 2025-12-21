

import { useEffect, useRef } from "react"
import DotBackground from "./ui/dot-background.jsx"
import { AlertCircle, Brain, BookOpen, Zap } from "lucide-react"

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
      description: "Students lose interest in dry textbooks and repetitive coding exercises that lack context and engagement.",
    },
    {
      icon: Brain,
      title: "No Real-World Context",
      description: "Learning syntax without understanding how it's applied in actual scenarios makes retention difficult.",
    },
    {
      icon: BookOpen,
      title: "Lack of Motivation",
      description: "Without gamification and clear progress tracking, students struggle to stay consistent with their learning journey.",
    },
    {
      icon: Zap,
      title: "Career Path Confusion",
      description: "Students often feel lost about which development path to choose and how to build relevant skills.",
    },
  ]

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative py-32 bg-[#050505] overflow-hidden"
    >
      {/* Red Dots Animation */}
      <DotBackground color="#ef4444" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 fade-in-section">
          <div className="text-red-500 inline-block px-4 py-2 bg-destructive/10 border border-red-500 rounded-full text-destructive text-sm font-medium mb-6">
            The Challenge
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Traditional Coding Education is <span className="text-destructive text-red-500">Broken</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance leading-relaxed">
            Students face multiple barriers that prevent them from becoming successful developers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="fade-in-section"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="group relative p-8 bg-card border border-border rounded-xl hover:border-destructive/100 transition-all duration-300 hover:shadow-lg hover:shadow-destructive/10 h-full">
                <div className="mb-4">
                  <problem.icon className="h-12 w-12 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-card-foreground group-hover:text-red-500 transition-colors">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:bg-destructive/10 opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-destructive/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}