import { useEffect, useRef } from "react"

export default function DotBackground({ color = "#a855f7", maxDistance = 150 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let isVisible = false
    let animationFrameId = null

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }
    resizeCanvas()

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 168, g: 85, b: 247 }
    }

    const rgb = hexToRgb(color)
    const dots = []
    // Reduced from 100 → 70 to lower O(n²) line-draw cost per frame
    const dotCount = 70

    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    const animate = () => {
      // Guard: skip frames when section is not in viewport
      if (!isVisible) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update + draw dots
      dots.forEach((dot) => {
        dot.x += dot.vx
        dot.y += dot.vy
        if (dot.x < 0 || dot.x > canvas.width)  dot.vx *= -1
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1

        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${
              0.25 * (1 - distance / maxDistance)
            })`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Pause animation when section scrolls out of view
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(animate)
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
      },
      { threshold: 0.05 }
    )

    visibilityObserver.observe(canvas)

    window.addEventListener("resize", resizeCanvas)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      visibilityObserver.disconnect()
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [color, maxDistance])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      role="presentation"
    />
  )
}