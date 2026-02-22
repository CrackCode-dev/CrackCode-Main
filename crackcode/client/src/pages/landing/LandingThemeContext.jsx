import React, { createContext, useContext, useState } from "react";
import tinycolor from "tinycolor2";
import { getLandingPalette } from "../../context/theme/ThemeContext";

// Landing-specific theme context.
// This keeps landing page theme concerns local to the landing page folder
// so the global ThemeContext doesn't need to change.

const LandingThemeContext = createContext(null);

// Keep a small local fallback, but prefer the centralized palette from ThemeContext
const PRESETS = {
  dark: {
    from: "#000000",
    via: "#FF9644",
    to: "#0a0a0a",
    orb: "rgba(255,150,68,0.12)",
    text: "#FFFFFF",
    textSec: "rgba(255,255,255,0.85)",
    brand: "#FF9644",
    rim: "rgba(255,150,68,0.06)",
  },
  light: {
    from: "#FFFFFF",
    via: "#FF9644",
    to: "#FFFFFF",
    orb: "rgba(255,150,68,0.06)",
    text: "#111111",
    textSec: "#555555",
    brand: "#FF9644",
    rim: "rgba(255,150,68,0.08)",
  },
};

export function LandingThemeProvider({ children, defaultTheme = "light" }) {
  const [landingTheme, setLandingTheme] = useState(defaultTheme);

  return (
    <LandingThemeContext.Provider value={{ landingTheme, setLandingTheme }}>
      {children}
    </LandingThemeContext.Provider>
  );
}

export function useLandingTheme() {
  const ctx = useContext(LandingThemeContext);
  if (!ctx) throw new Error("useLandingTheme must be used inside <LandingThemeProvider>");
  return ctx;
}

export function resolveLandingVars(themeKey) {
  // Prefer the global landing palette if available; fall back to PRESETS.
  let base = PRESETS[themeKey] || PRESETS.dark;
  try {
    const global = getLandingPalette?.(themeKey);
    if (global) base = { ...base, ...global };
  } catch (e) {
    // if ThemeContext helper is not available for any reason, keep the local preset
  }

  // compute derived colors for buttons, cards, and contrast using tinycolor
  const brand = tinycolor(base.brand || base.via)
  const bg = tinycolor(base.from)

  // button gradient: mix brand with bg for a subtle glow
  const btnStart = brand.clone().brighten(6).toHexString()
  const btnEnd = brand.clone().darken(6).toHexString()

  // button text — ensure high contrast against btnStart
  const btnText = tinycolor.readability(btnStart, '#ffffff') >= 4.5 ? '#ffffff' : '#000000'

  // card backgrounds
  const cardBgLight = tinycolor(base.to).lighten(6).setAlpha(0.9).toRgbString()
  const cardBgDark = tinycolor(base.via).lighten(8).setAlpha(0.12).toRgbString()

  // subtle rim/shadow
  const rim = base.rim || tinycolor(base.via).setAlpha(0.06).toRgbString()

  return {
    ...base,
    btnStart,
    btnEnd,
    btnText,
    cardBgLight,
    cardBgDark,
    rim,
  }
}

export default LandingThemeContext;
