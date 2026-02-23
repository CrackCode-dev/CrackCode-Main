/**
 * Hover Effects Utility
 * Reusable hover effect handlers for landing page cards
 */

export const cardHoverEffects = {
  /**
   * Apply hover effect to a card element
   * Changes border color, background, and shadow
   */
  onCardHover: (element, vars, landingTheme) => {
    if (!element) return
    
    element.style.borderColor = vars.brand
    element.style.background = landingTheme === 'light' 
      ? 'rgba(255,200,124,0.12)' 
      : 'rgba(255,150,68,0.15)'
    element.style.boxShadow = `0 20px 40px ${
      landingTheme === 'light' 
        ? 'rgba(255,150,68,0.15)' 
        : 'rgba(255,150,68,0.2)'
    }`
  },

  /**
   * Reset card to original state when mouse leaves
   */
  onCardLeave: (element, vars, cardBg, landingTheme) => {
    if (!element) return
    
    element.style.borderColor = vars.rim || (
      landingTheme === 'light' ? '#E6E6E6' : 'rgba(255,255,255,0.06)'
    )
    element.style.background = cardBg
    element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
  },

  /**
   * Apply hover effect to feature tags
   */
  onTagHover: (element, vars, landingTheme) => {
    if (!element) return
    
    element.style.borderColor = vars.brand
    element.style.boxShadow = `0 12px 24px ${
      landingTheme === 'light' 
        ? 'rgba(255,150,68,0.2)' 
        : 'rgba(255,150,68,0.3)'
    }`
    element.style.background = landingTheme === 'light' 
      ? 'rgba(255,200,124,0.15)' 
      : 'rgba(255,150,68,0.15)'
  },

  /**
   * Reset tag to original state
   */
  onTagLeave: (element, vars, landingTheme) => {
    if (!element) return
    
    element.style.borderColor = vars.rim
    element.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
    element.style.background = landingTheme === 'light' 
      ? vars.cardBgLight 
      : vars.cardBgDark
  },

  /**
   * Apply hover effect to buttons
   */
  onButtonHover: (element, vars, landingTheme) => {
    if (!element) return
    
    element.style.borderColor = vars.brand
    element.style.backgroundColor = landingTheme === 'light' 
      ? 'rgba(255,200,124,0.12)' 
      : 'rgba(255,150,68,0.1)'
  },

  /**
   * Reset button to original state
   */
  onButtonLeave: (element, vars) => {
    if (!element) return
    
    element.style.borderColor = vars.rim
    element.style.backgroundColor = 'rgba(255,150,68,0.05)'
  }
}

/**
 * Animation configuration for consistent transitions
 */
export const animationConfig = {
  cardHover: { duration: 0.3 },
  cardLift: { y: -10, scale: 1.02 },
  tagHover: { scale: 1.08, y: -4 },
  buttonHover: { scale: 1.05, y: -2 },
  buttonTap: { scale: 0.95 },
  iconScale: 1.25,
  iconRotate: 12
}
