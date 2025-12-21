import React, { useEffect } from "react"
import HeroSection from "./components/hero-section.jsx"
import ProblemSection from "./components/problem-section.jsx"
import SolutionSection from "./components/solution-section.jsx"
import PreviewSection from "./components/preview-section.jsx" // <--- Import here
import TeamSection from "./components/team-section.jsx"
import ContactSection from "./components/contact-section.jsx"

export default function App() {
  useEffect(() => {
    // Cursor glow effect
    const cursorGlow = document.createElement("div")
    cursorGlow.className = "cursor-glow"
    document.body.appendChild(cursorGlow)

    const moveCursor = (e) => {
      cursorGlow.style.left = e.clientX + "px"
      cursorGlow.style.top = e.clientY + "px"
    }

    window.addEventListener("mousemove", moveCursor)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      if (document.body.contains(cursorGlow)) {
        cursorGlow.remove()
      }
    }
  }, [])

  return (
    <main className="relative overflow-hidden font-sans antialiased text-foreground bg-background">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <PreviewSection /> {/* <--- Add Component here */}
      <TeamSection />
      <ContactSection />
    </main>
  )
}