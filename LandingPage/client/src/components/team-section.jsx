

import { useEffect, useRef } from "react"
import DotBackground from "./ui/dot-background.jsx"

export default function TeamSection() {
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

  const team = [
    { name: "Vidun Shanuka", role: "Full stack / ML Developer" },
    { name: "Nadeesha Hasaranga", role: "Full Stack Developer" },
    { name: "Chris Corteling", role: "Back End / ML Developer" },
    { name: "Sasni Lasadi", role: "Back End Developer" },
    { name: "Shenori Perera", role: "BacK End Developer" },
    { name: "Ama Dombawela", role: "Front End Developer" },
  ]

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-32 bg-[#050505] overflow-hidden"
    >
      {/* Blue/Purple Dots */}
      <DotBackground color="#a855f7" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-24 fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
          <h2 className="text-6xl md:text-8xl font-bold mb-4 text-balance tracking-tight">THE BUILDERS</h2>
        </div>

        <div className="max-w-6xl mx-auto space-y-1">
          {team.map((member, index) => (
            <div
              key={index}
              className={`fade-in-section opacity-0 transition-all duration-1000 ${
                index % 2 === 0 ? "translate-x-[-100px]" : "translate-x-[100px]"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`group relative py-8 border-b border-border hover:border-secondary/50 hover:bg-muted/10 transition-all duration-300 ${
                  index % 2 === 0 ? "text-left pl-0 pr-[30%]" : "text-right pr-0 pl-[30%]"
                }`}
              >
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold mb-2 text-foreground tracking-tight">{member.name}</h3>
                  <p className="text-muted-foreground font-mono text-sm md:text-base tracking-wider uppercase">
                    {member.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </section>
  )
}