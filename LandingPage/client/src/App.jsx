import React, { useEffect } from "react"
import HeroSection from "./components/hero-section.jsx"
import ProblemSection from "./components/problem-section.jsx"
import SolutionSection from "./components/solution-section.jsx"
import HowItWorksSection from "./components/how-it-works-section.jsx"
import PreviewSection from "./components/preview-section.jsx"
import TeamSection from "./components/team-section.jsx"
import ContactSection from "./components/contact-section.jsx"

export default function App() {
  useEffect(() => {
    // Enhanced cursor glow effect
    const cursorGlow = document.createElement("div")
    cursorGlow.className = "cursor-glow"
    document.body.appendChild(cursorGlow)

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const moveCursor = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Smooth cursor animation
    const animateCursor = () => {
      const dx = mouseX - currentX
      const dy = mouseY - currentY
      currentX += dx * 0.1
      currentY += dy * 0.1
      cursorGlow.style.left = currentX + "px"
      cursorGlow.style.top = currentY + "px"
      requestAnimationFrame(animateCursor)
    }

    window.addEventListener("mousemove", moveCursor)
    animateCursor()

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
      <HowItWorksSection />
      <PreviewSection />
      <TeamSection />
      <ContactSection />
    </main>
  )
}