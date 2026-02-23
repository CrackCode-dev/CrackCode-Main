import React, { createContext, useContext, useEffect, useState } from "react";

// ============================================================
// THEME SYSTEM - Single Source of Truth
// ============================================================
// This file defines ALL theme colors and injects them into the DOM.
// CSS variables are injected via JavaScript, NOT defined in CSS files.
// 
// theme.css only provides basic fallback values (overridden immediately).
// To update colors: edit THEME_VARS below.
// ============================================================

const ThemeContext = createContext(null);

export const THEMES = ["light", "cream", "dark", "country", "midnight"];

// SINGLE SOURCE OF TRUTH FOR ALL THEME COLORS
// When you need to change a color, update it here only
const THEME_VARS = {
  light: {
    "--bg":            "#FFFDF1",
    "--surface":       "#FFFFFF",
    "--surface2":      "#FFF5E4",
    "--brand":         "#FF9644",
    "--brandSoft":     "#FFCE99",
    "--brandInk":      "#562F00",
    "--text":          "#562F00",
    "--textSec":       "#7A4420",
    "--muted":         "#9B6540",
    "--border":        "#E8D0A0",
    "--shadow":        "0 2px 12px rgba(86,47,0,0.08)",
    "--shadowBrand":   "0 4px 20px rgba(255,150,68,0.25)",
    "--progressTrack": "#E8D0A0",
    "--challengeBg":   "#FFCE99",
    "--inviteBg":      "#FFCE99",
  },
  cream: {
    "--bg":            "#FFF0D4",
    "--surface":       "#FFFDF1",
    "--surface2":      "#FFE8B8",
    "--brand":         "#FF9644",
    "--brandSoft":     "#FFD896",
    "--brandInk":      "#562F00",
    "--text":          "#3D1E00",
    "--textSec":       "#6B3A10",
    "--muted":         "#8B5530",
    "--border":        "#DDB870",
    "--shadow":        "0 2px 12px rgba(86,47,0,0.12)",
    "--shadowBrand":   "0 4px 20px rgba(255,150,68,0.3)",
    "--progressTrack": "#DDB870",
    "--challengeBg":   "#FFD896",
    "--inviteBg":      "#FFC875",
  },
  dark: {
    // Pure black & white theme - minimal, high contrast, clean
    // Base: True black background
    // Accents: Bright white text + orange brand
    // Feel: Modern, professional, maximum readability
    "--bg":            "#0D0D0D",      // Almost pure black background
    "--surface":       "#1A1A1A",      // Dark gray surfaces
    "--surface2":      "#252525",      // Slightly lighter surfaces
    "--brand":         "#FF9644",      // Orange - unchanged
    "--brandSoft":     "#1F1408",      // Deep orange-black
    "--brandInk":      "#FFE5CC",      // Bright cream for dark areas
    "--text":          "#F5F5F5",      // Pure white-ish text
    "--textSec":       "#E0E0E0",      // Secondary text
    "--muted":         "#A0A0A0",      // Muted text
    "--border":        "#333333",      // Dark borders with visibility
    "--shadow":        "0 8px 24px rgba(0,0,0,0.8)",     // Deep shadows
    "--shadowBrand":   "0 8px 24px rgba(255,150,68,0.25)",  // Orange glow
    "--progressTrack": "#2A2A2A",      // Progress bar track
    "--challengeBg":   "#161616",      // Challenge card background
    "--inviteBg":      "#1A1A1A",      // Invite/notification background
  },
  country: {
    // Warm dark theme - professional with warm brown undertones
    // Base: Warm dark browns
    // Accents: Orange brand color maintains warmth
    // Feel: Cozy, sophisticated, detective office aesthetic
    "--bg":            "#1C1007",
    "--surface":       "#2A1A09",
    "--surface2":      "#341F0C",
    "--brand":         "#FF9644",
    "--brandSoft":     "#3D2010",
    "--brandInk":      "#FFCE99",
    "--text":          "#F2DFC0",
    "--textSec":       "#D4B890",
    "--muted":         "#9A7055",
    "--border":        "#4A2E14",
    "--shadow":        "0 2px 12px rgba(0,0,0,0.4)",
    "--shadowBrand":   "0 4px 20px rgba(255,150,68,0.2)",
    "--progressTrack": "#4A2E14",
    "--challengeBg":   "#3E2510",
    "--inviteBg":      "#3E2510",
  },
  midnight: {
    // Deep dark theme - true black base with maximum contrast
    // Base: Pure black for OLED/eye comfort
    // Accents: Bright orange for strong visibility
    // Feel: Premium, modern, true dark mode
    "--bg":            "#0A0E17",      // Almost pure black - true dark
    "--surface":       "#14192B",      // Very dark blue-gray
    "--surface2":      "#1F2545",      // Secondary surfaces
    "--brand":         "#FF9644",      // Vibrant orange unchanged
    "--brandSoft":     "#1F1408",      // Deep orange-black
    "--brandInk":      "#FFE5CC",      // Bright warm cream on dark
    "--text":          "#F0F4F8",      // Clean light gray-blue
    "--textSec":       "#D6DCE4",      // Secondary text
    "--muted":         "#8B92A4",      // Muted text
    "--border":        "#2D3B52",      // Visible borders
    "--shadow":        "0 8px 24px rgba(0,0,0,0.7)",     // Deep shadows
    "--shadowBrand":   "0 12px 32px rgba(255,150,68,0.2)",  // Orange glow
    "--progressTrack": "#1F2545",      // Progress bar
    "--challengeBg":   "#141A28",      // Challenge card
    "--inviteBg":      "#14192B",      // Invite card
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Load saved theme on first render
  useEffect(() => {
    const saved = localStorage.getItem("crackcode_theme");
    if (THEMES.includes(saved)) setTheme(saved);
  }, []);

  // Inject CSS variables into <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(THEME_VARS[theme]).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
    root.setAttribute("data-theme", theme);
    localStorage.setItem("crackcode_theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

// Map the global theme variables into a compact landing palette the landing
// components can consume. This keeps the single source-of-truth in ThemeContext
// while allowing landing UI to request a small set of colors (`from`, `via`,
// `to`, `brand`, `text`, `textSec`, `rim`, `orb`) for gradients and accents.
export function getLandingPalette(themeKey = 'light') {
  const vars = THEME_VARS[themeKey] || THEME_VARS['dark'];

  return {
    from: vars['--bg'] || '#FFFDF1',
    via: vars['--brandSoft'] || vars['--brand'] || '#FFCE99',
    to: vars['--surface'] || vars['--bg'] || '#FFFFFF',
    orb: vars['--brandSoft'] ? `${vars['--brandSoft']}33` : 'rgba(86,47,0,0.06)',
    text: vars['--text'] || '#213547',
    textSec: vars['--textSec'] || '#475569',
    brand: vars['--brand'] || '#FF9644',
    rim: vars['--border'] || 'rgba(255,150,68,0.06)'
  };
}