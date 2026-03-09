import React, { createContext, useContext, useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { getLandingPalette } from "../../context/theme/ThemeContext";

// ============================================================
// LANDING THEME CONTEXT
// ============================================================
// Manages the two landing page themes: "light" and "dark".
//
// Key responsibility beyond the original:
//   When the landing theme changes, ALL CSS variables needed by the
//   shared Button component (--btn-p-*, --btn-s-*) are injected into
//   <html> — exactly like ThemeContext does for the app. Without this,
//   Button's [data-btn] depth styles read undefined vars and render flat.
//
// Landing "light" maps to the app's "light" button palette.
// Landing "dark"  maps to the app's "dark"  button palette.
// ============================================================

const LandingThemeContext = createContext(null);
const LANDING_THEME_STORAGE_KEY = "crackcode_landing_theme";

// ─── Base palette presets ─────────────────────────────────────────────────────
// Used as fallback if getLandingPalette() from ThemeContext is unavailable.
const PRESETS = {
  dark: {
    from: "#0B0A08",       // warm charcoal (not pure black)
    via:  "#C2763A",       // muted deep amber (blends into dark tones)
    via2: "#0E0C0A",      // very dark near-black (extra depth for dark mode)
    to:   "#110E0C",       // tinted near-black (keeps warmth at tail)
    orb:  "rgba(194,118,58,0.10)",
    text: "#F5F0EB",       // warm off-white (softer on dark bg)
    textSec: "rgba(245,240,235,0.72)",
    brand: "#E8863C",      // refined brand orange (less neon)
    rim:  "rgba(194,118,58,0.06)",
  },
  light: {
    from: "#FFFBF5",       // warm cream (not sterile white) 
    via:  "#FFDCB8",       // soft peach (gentle bridge to brand)
    via2: "#FFF8F0",       // lighter peach (extra warmth for light bg)
    to:   "#FFF7EF",       // pale sand (warm tail)
    orb:  "rgba(232,134,60,0.06)",
    text: "#1A1410",       // warm near-black
    textSec: "#5C4A3A",    // warm mid-brown (not cold grey)
    brand: "#E8863C",      // same brand accent
    rim:  "rgba(232,134,60,0.08)",
  },
};

// ─── Button CSS variables per landing theme ───────────────────────────────────
// These mirror the --btn-p-* / --btn-s-* entries in ThemeContext.jsx exactly.
// They must be injected into :root so that Button's [data-btn] CSS depth rules
// (which read these vars) work correctly on the landing page.
const LANDING_BUTTON_VARS = {
  light: {
    // Primary — classic orange arcade button
    "--btn-p-from":       "#f97316",
    "--btn-p-via":        "#ea6c00",
    "--btn-p-to":         "#c2440e",
    "--btn-p-border":     "#9a3412",
    "--btn-p-shadow":     "rgba(154,52,18,1)",
    "--btn-p-ring":       "#fb923c",
    // Secondary — bright cream, pops on warm white backgrounds
    "--btn-s-from":       "#FFFEF5",
    "--btn-s-via":        "#FFF8DC",
    "--btn-s-to":         "#F5EDB8",
    "--btn-s-hover-from": "#FFFFFF",
    "--btn-s-hover-via":  "#FFF8E0",
    "--btn-s-hover-to":   "#F0E8A8",
    "--btn-s-border":     "#f97316",
    "--btn-s-text":       "#ea6c00",
    "--btn-s-shadow":     "rgba(194,82,8,0.9)",
    "--btn-s-inset-top":  "rgba(255,255,255,0.95)",
    "--btn-s-ring":       "#fb923c",
  },
  dark: {
    // Primary — same single-hue orange gradient, neutral black shadow
    "--btn-p-from":       "#f97316",
    "--btn-p-via":        "#ea6c00",
    "--btn-p-to":         "#c2440e",
    "--btn-p-border":     "#9a3412",
    "--btn-p-shadow":     "rgba(154,52,18,1)",
    "--btn-p-ring":       "#fb923c",
    // Secondary — warm amber-brown, clearly visible against dark landing bg
    "--btn-s-from":       "#4A3010",
    "--btn-s-via":        "#3A2409",
    "--btn-s-to":         "#2A1A05",
    "--btn-s-hover-from": "#58391A",
    "--btn-s-hover-via":  "#46300F",
    "--btn-s-hover-to":   "#34220A",
    "--btn-s-border":     "#FF9644",
    "--btn-s-text":       "#FF9644",
    "--btn-s-shadow":     "rgba(194,82,8,0.8)",
    "--btn-s-inset-top":  "rgba(255,200,120,0.18)",
    "--btn-s-ring":       "#FF9644",
  },
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function LandingThemeProvider({ children, defaultTheme = "light" }) {
  const [landingTheme, setLandingTheme] = useState(() => {
    const savedLandingTheme = localStorage.getItem(LANDING_THEME_STORAGE_KEY);
    if (savedLandingTheme === "light" || savedLandingTheme === "dark") {
      return savedLandingTheme;
    }

    const globalTheme = localStorage.getItem("crackcode_theme");
    return globalTheme === "dark" || globalTheme === "midnight" || globalTheme === "country"
      ? "dark"
      : defaultTheme;
  });
  const wrapperRef = React.useRef(null);

  // Inject CSS variables onto the wrapper <div>, NOT onto :root.
  //
  // Why: ThemeContext (global app theme) also writes --btn-* vars to :root.
  // Both running on mount creates a race — whichever effect runs last wins,
  // and the landing page unpredictably loses its button vars to the app theme.
  //
  // CSS custom properties cascade down the DOM, so a variable set on a parent
  // element takes precedence over :root for all its descendants. By writing
  // onto this wrapper div, every Button inside the landing page reads landing
  // vars, while :root (and the rest of the app) stays completely untouched.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const resolved = resolveLandingVars(landingTheme);
    const btnVars  = LANDING_BUTTON_VARS[landingTheme] || LANDING_BUTTON_VARS.dark;

    // Base palette scoped to this element
    el.style.setProperty("--bg",      resolved.from);
    el.style.setProperty("--brand",   resolved.brand);
    el.style.setProperty("--text",    resolved.text);
    el.style.setProperty("--textSec", resolved.textSec);
    el.style.setProperty("--border",  resolved.rim);

    // All button vars scoped to this element
    Object.entries(btnVars).forEach(([key, val]) => {
      el.style.setProperty(key, val);
    });

    el.setAttribute("data-landing-theme", landingTheme);
    localStorage.setItem(LANDING_THEME_STORAGE_KEY, landingTheme);
  }, [landingTheme]);

  return (
    <LandingThemeContext.Provider value={{ landingTheme, setLandingTheme }}>
      {/* display:contents makes this div layout-invisible — it's a pure
          CSS variable scope boundary, not an extra box in the flow */}
      <div ref={wrapperRef} style={{ display: "contents" }}>
        {children}
      </div>
    </LandingThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLandingTheme() {
  const ctx = useContext(LandingThemeContext);
  if (!ctx) throw new Error("useLandingTheme must be used inside <LandingThemeProvider>");
  return ctx;
}

// ─── resolveLandingVars ───────────────────────────────────────────────────────
// Returns a flat object of all values landing components need for inline styles,
// gradient props, card backgrounds, etc.
//
// Button gradient/shadow vars are NOT computed here — they live in LANDING_BUTTON_VARS
// and are injected to :root by the provider above. This keeps button styling in one
// place (the injected CSS in Button.jsx) rather than spread across inline styles.
export function resolveLandingVars(themeKey) {
  // Start from local preset, then overlay the centralized palette if available
  let base = PRESETS[themeKey] || PRESETS.dark;
  try {
    const global = getLandingPalette?.(themeKey);
    if (global) base = { ...base, ...global };
  } catch (_) {
    // ThemeContext helper unavailable — keep local preset
  }

  const brand = tinycolor(base.brand || base.via);

  // Card backgrounds — tinycolor derivation retained as-is
  const cardBgLight = tinycolor(base.to).lighten(6).setAlpha(0.9).toRgbString();
  const cardBgDark  = tinycolor(base.via).lighten(8).setAlpha(0.12).toRgbString();

  // Subtle rim/shadow
  const rim = base.rim || tinycolor(base.via).setAlpha(0.06).toRgbString();

  // btnStart / btnEnd kept for any landing components that still reference them
  // directly via inline styles (e.g. hero CTA gradients, decorative elements).
  // These are NOT what Button.jsx uses — Button reads from CSS vars on :root.
  const btnStart = brand.clone().brighten(6).toHexString();
  const btnEnd   = brand.clone().darken(6).toHexString();
  const btnText  = tinycolor.readability(btnStart, '#ffffff') >= 4.5 ? '#ffffff' : '#000000';

  return {
    ...base,
    // Cards & surfaces
    cardBgLight,
    cardBgDark,
    rim,
    // Legacy button values (for non-Button inline uses only)
    btnStart,
    btnEnd,
    btnText,
    // Expose the explicit button vars so components can read them if needed
    // without having to import LANDING_BUTTON_VARS directly
    buttonVars: LANDING_BUTTON_VARS[themeKey] || LANDING_BUTTON_VARS.dark,
  };
}

export default LandingThemeContext;