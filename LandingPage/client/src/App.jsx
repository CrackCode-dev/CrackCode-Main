import React, { useEffect, useRef, useState } from "react"
import HeroSection from "./components/hero-section.jsx"
import ProblemSection from "./components/problem-section.jsx"
import SolutionSection from "./components/solution-section.jsx"
import HowItWorksSection from "./components/how-it-works-section.jsx"
import PreviewSection from "./components/preview-section.jsx"
import TeamSection from "./components/team-section.jsx"
import ContactSection from "./components/contact-section.jsx"

export default function App() {
  const cursorRef = useRef(null)
  const linesRef = useRef(null)
  const squareRef = useRef(null)
  const [rotation, setRotation] = useState(0)
  const moveTimeout = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const lines = linesRef.current
    const square = squareRef.current
    
    if (!cursor) return

    // Track cursor position
    const moveCursor = (e) => {
      cursor.style.left = e.clientX + "px"
      cursor.style.top = e.clientY + "px"
      
      // Add moving class to trigger square pulse
      square.classList.add("moving")
      
      // Clear previous timeout
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current)
      }
      
      // Remove moving class after animation and randomly rotate lines
      moveTimeout.current = setTimeout(() => {
        square.classList.remove("moving")
        
        // Random rotation direction
        const isClockwise = Math.random() > 0.5
        lines.classList.remove('rotating-cw', 'rotating-ccw')
        
        setTimeout(() => {
          lines.classList.add(isClockwise ? 'rotating-cw' : 'rotating-ccw')
        }, 10)
        
        const newRotation = rotation + (isClockwise ? 90 : -90)
        setRotation(newRotation)
      }, 100)
    }

    // Handle click animation
    const handleClick = () => {
      square.classList.add("clicking")
      setTimeout(() => {
        square.classList.remove("clicking")
      }, 200)
    }

    // Handle hover on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.onclick || 
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      
      if (isInteractive) {
        cursor.classList.add('hovering')
      }
    }

    const handleMouseOut = () => {
      cursor.classList.remove('hovering')
    }

    // Hide cursor when leaving window
    const handleMouseLeave = () => {
      cursor.classList.add('hidden')
    }

    const handleMouseEnter = () => {
      cursor.classList.remove('hidden')
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("click", handleClick)
    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("click", handleClick)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current)
      }
    }
  }, [rotation])

  return (
    <>
      {/* Custom Crosshair Cursor */}
      <div ref={cursorRef} className="custom-cursor">
        <div ref={squareRef} className="cursor-square">
          <div className="corner tl"></div>
          <div className="corner tr"></div>
          <div className="corner bl"></div>
          <div className="corner br"></div>
        </div>
        <div ref={linesRef} className="cursor-lines">
          <div className="cursor-line top"></div>
          <div className="cursor-line right"></div>
          <div className="cursor-line bottom"></div>
          <div className="cursor-line left"></div>
        </div>
        <div className="cursor-center"></div>
      </div>

      {/* Main Content */}
      <main className="relative overflow-hidden font-sans antialiased text-foreground bg-background">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <PreviewSection />
        <TeamSection />
        <ContactSection />
      </main>
    </>
  )
}