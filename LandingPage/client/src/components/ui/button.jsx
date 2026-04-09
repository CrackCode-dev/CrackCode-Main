import React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      className={cn(
        // Base classes
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          // ── Existing Variants ────────────────────────────────────────────────
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default" || !variant,
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive", 
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "text-accent-foreground": variant === "ghost",
          
          // ── New 3D Gamified Variants ─────────────────────────────────────────
          
          // 1. Filled (Inspired by the Blue "START" button)
          // Uses gradients, inner highlights (inset shadows), and a text shadow for maximum pop.
          "rounded-full transition-all duration-150 ease-out bg-gradient-to-b from-orange-600 to-orange-600 text-white font-bold tracking-wider border border-orange-600 shadow-[0_6px_0_0_#1e3a8a,inset_0_4px_0_0_rgba(255,255,255,0.4),inset_0_-4px_0_0_rgba(0,0,0,0.15)] hover:shadow-[0_4px_0_0_#000000,inset_0_4px_0_0_rgba(255,255,255,0.4),inset_0_-4px_0_0_rgba(0,0,0,0.15)] hover:translate-y-[2px] active:shadow-[0_0px_0_0_#1e3a8a,inset_0_4px_0_0_rgba(255,255,255,0.4),inset_0_-4px_0_0_rgba(0,0,0,0.15)] active:translate-y-[6px] [text-shadow:0_2px_2px_rgba(0,0,0,0.25)]": 
            variant === "gamified",

          // ── Sizes ────────────────────────────────────────────────────────────
          "h-10 px-4 py-2": size === "default" || !size,
          "h-9 rounded-md px-3": size === "sm",
          // Increased the height of the large button slightly so the 3D effect has room to breathe
          "h-12 rounded-md px-8 text-lg": size === "lg", 
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }