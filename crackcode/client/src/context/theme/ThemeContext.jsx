import React, { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(null);

export const THEMES = ["light", "cream", "dark", "country", "midnight"];

const THEME_VARS = {
  light: {
    "--bg": "#FFFDF1",
    "--surface": "#FFFFFF",
    "--surface2": "#FFF5E4",
    "--brand": "#FF9644",
    "--brandSoft": "#FFCE99",
    "--brandInk": "#562F00",
    "--text": "#562F00",
    "--textSec": "#7A4420",
    "--muted": "#9B6540",
    "--border": "#E8D0A0",
    "--shadow": "0 2px 12px rgba(86,47,0,0.08)",
    "--shadowBrand": "0 4px 20px rgba(255,150,68,0.25)",
    "--progressTrack": "#E8D0A0",
    "--challengeBg": "#FFCE99",
    "--inviteBg": "#FFCE99",

    //Primary Btn
    "--btn-p-from": "#F97316",
    "--btn-p-via": "#EA6c00",
    "--btn-p-to": "#c2440e",
    "--btn-p-border": "#9a3412",
    "--btn-p-shadow": "rgba(154,52,18,1)",
    "--btn-p-ring": "#fb923c",

    //Secondary Btn
    "--btn-s-from": "#FFFEF5",
    "--btn-s-via": "#FFF8DC",
    "--btn-s-to": "#F5EDB8",
    "--btn-s-hover-from": "#FFFFFF",
    "--btn-s-hover-via": "#FFF8E0",
    "--btn-s-hover-to": "#F0E8A8",
    "--btn-s-border": "#f97316",
    "--btn-s-text": "#ea6c00",
    "--btn-s-shadow": "rgba(194,82,8,0.9)",
    "--btn-s-inset-top": "rgba(255,255,255,0.95)",
    "--btn-s-ring": "#fb923c",
  },
  cream: {
    "--bg": "#FFF0D4",
    "--surface": "#FFFDF1",
    "--surface2": "#FFE8B8",
    "--brand": "#FF9644",
    "--brandSoft": "#FFD896",
    "--brandInk": "#562F00",
    "--text": "#3D1E00",
    "--textSec": "#6B3A10",
    "--muted": "#8B5530",
    "--border": "#DDB870",
    "--shadow": "0 2px 12px rgba(86,47,0,0.12)",
    "--shadowBrand": "0 4px 20px rgba(255,150,68,0.3)",
    "--progressTrack": "#DDB870",
    "--challengeBg": "#FFD896",
    "--inviteBg": "#FFC875",

    //Primary Btn
    "--btn-p-from": "#f97316",
    "--btn-p-via": "#ea6c00",
    "--btn-p-to": "#c2440e",
    "--btn-p-border": "#9a3412",
    "--btn-p-shadow": "rgba(154,52,18,1)",
    "--btn-p-ring": "#fb923c",

    //Secondary Btn
    "--btn-s-from": "#FFFDF1",
    "--btn-s-via": "#FFE8B8",
    "--btn-s-to": "#FFD896",
    "--btn-s-hover-from": "#FFFFFF",
    "--btn-s-hover-via": "#FFE8C0",
    "--btn-s-hover-to": "#FFCF70",
    "--btn-s-border": "#f97316",
    "--btn-s-text": "#c2440e",
    "--btn-s-shadow": "rgba(194,82,8,0.9)",
    "--btn-s-inset-top": "rgba(255,255,255,0.9)",
    "--btn-s-ring": "#fb923c",
  },
  dark: {
    "--bg": "#0D0D0D",
    "--surface": "#1A1A1A",
    "--surface2": "#252525",
    "--brand": "#FF9644",
    "--brandSoft": "#1F1408",
    "--brandInk": "#FFE5CC",
    "--text": "#F5F5F5",
    "--textSec": "#E0E0E0",
    "--muted": "#A0A0A0",
    "--border": "#333333",
    "--shadow": "0 8px 24px rgba(0,0,0,0.8)",
    "--shadowBrand": "0 8px 24px rgba(255,150,68,0.25)",
    "--progressTrack": "#2A2A2A",
    "--challengeBg": "#161616",
    "--inviteBg": "#1A1A1A",

    //Primary Btn
    "--btn-p-from": "#FF9644",
    "--btn-p-via": "#e07320",
    "--btn-p-to": "#b85a10",
    "--btn-p-border": "#7c3a08",
    "--btn-p-shadow": "rgba(80,25,0,0.95)",
    "--btn-p-ring": "#FF9644",

    //Secondary Btn
    "--btn-s-from": "#2A2010",        // dark warm cream top — same hue as #FFFEF5
    "--btn-s-via": "#201808",        // darker warm mid
    "--btn-s-to": "#1F1408",        // darkest warm base
    "--btn-s-hover-from": "#342816",        // lifted warm on hover
    "--btn-s-hover-via": "#281E0C",
    "--btn-s-hover-to": "#1E1408",
    "--btn-s-border": "#FF9644",
    "--btn-s-text": "#FF9644",
    "--btn-s-shadow": "rgba(194,82,8,0.8)",  // same orange shadow as light — just softer
    "--btn-s-inset-top": "rgba(255,255,255,0.13)",  // stronger highlight — dark bg needs more punch
    "--btn-s-ring": "#FF9644",
  },
  country: {
    "--bg": "#1C1007",
    "--surface": "#2A1A09",
    "--surface2": "#341F0C",
    "--brand": "#FF9644",
    "--brandSoft": "#3D2010",
    "--brandInk": "#FFCE99",
    "--text": "#F2DFC0",
    "--textSec": "#D4B890",
    "--muted": "#9A7055",
    "--border": "#4A2E14",
    "--shadow": "0 2px 12px rgba(0,0,0,0.4)",
    "--shadowBrand": "0 4px 20px rgba(255,150,68,0.2)",
    "--progressTrack": "#4A2E14",
    "--challengeBg": "#3E2510",
    "--inviteBg": "#3E2510",

    //Primary Btn
    "--btn-p-from": "#f97316",
    "--btn-p-via": "#ea6c00",
    "--btn-p-to": "#c2440e",
    "--btn-p-border": "#7c3a08",
    "--btn-p-shadow": "rgba(100,35,0,0.95)",
    "--btn-p-ring": "#FF9644",

    //Secondary Btn
    "--btn-s-from": "#4A2E14",
    "--btn-s-via": "#3D2410",
    "--btn-s-to": "#2A1A09",
    "--btn-s-hover-from": "#573515",
    "--btn-s-hover-via": "#4A2A12",
    "--btn-s-hover-to": "#341F0C",
    "--btn-s-border": "#FF9644",
    "--btn-s-text": "#FFCE99",
    "--btn-s-shadow": "rgba(194,82,8,0.9)",
    "--btn-s-inset-top": "rgba(255,255,255,0.08)",
    "--btn-s-ring": "#FF9644",
  },
  midnight: {

    // Deep dark theme - true black base with maximum contrast
    // Base: Pure black for OLED/eye comfort
    // Accents: Bright orange for strong visibility
    // Feel: Premium, modern, true dark mode
    "--bg": "#0A0E17",      // Almost pure black - true dark
    "--surface": "#14192B",      // Very dark blue-gray
    "--surface2": "#1F2545",      // Secondary surfaces
    "--brand": "#FF9644",      // Vibrant orange unchanged
    "--brandSoft": "#1F1408",      // Deep orange-black
    "--brandInk": "#FFE5CC",      // Bright warm cream on dark
    "--text": "#F0F4F8",      // Clean light gray-blue
    "--textSec": "#D6DCE4",      // Secondary text
    "--muted": "#8B92A4",      // Muted text
    "--border": "#2D3B52",      // Visible borders
    "--shadow": "0 8px 24px rgba(0,0,0,0.7)",     // Deep shadows
    "--shadowBrand": "0 12px 32px rgba(255,150,68,0.2)",  // Orange glow
    "--progressTrack": "#1F2545",      // Progress bar
    "--challengeBg": "#141A28",      // Challenge card
    "--inviteBg": "#14192B",      // Invite card

    //Primary Btn
    "--btn-p-from": "#FF9644",
    "--btn-p-via": "#e07320",
    "--btn-p-to": "#c05a0a",
    "--btn-p-border": "#6b3208",
    "--btn-p-shadow": "rgba(80,25,0,0.9)",
    "--btn-p-ring": "#FF9644",

    //Secondary Btn
    "--btn-s-from": "#2D3B52",
    "--btn-s-via": "#1F2545",
    "--btn-s-to": "#14192B",
    "--btn-s-hover-from": "#364560",
    "--btn-s-hover-via": "#2A3158",
    "--btn-s-hover-to": "#1F2545",
    "--btn-s-border": "#3A9AFF",
    "--btn-s-text": "#3A9AFF",
    "--btn-s-shadow": "#1C4D8D",
    "--btn-s-inset-top": "#134E8E",
    "--btn-s-ring": "#FF3E9B",      

  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("crackcode_theme");
    return THEMES.includes(saved) ? saved : "light";
  });

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