import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/theme/ThemeContext";
import { Settings, Bell, Search } from "lucide-react";
import CrackcodeLogo from "../../assets/logo/crackcode_logo.svg";

const NAV_TABS = [
  { to: "/home",        label: "Learn"       },
  { to: "/caselog",     label: "Case List"   },
  { to: "/careermap",   label: "Career Maps" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/shop",        label: "Store"       },
];

const THEME_ICONS = { light: "☀️", cream: "🍯", dark: "🌙" };

// Reusable small card wrapper (used for the settings dropdown items)
function ThemeOption({ name, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 hover:opacity-80"
      style={{
        background: active ? "var(--brandSoft)" : "transparent",
        color:      active ? "var(--brandInk)" : "var(--text)",
      }}
    >
      <span>{THEME_ICONS[name]}</span>
      <span className="capitalize">{name}</span>
      {active && <span className="ml-auto text-xs font-bold" style={{ color: "var(--brand)" }}>✓</span>}
    </button>
  );
}

export default function AppNavbar() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background:   "var(--bg)",
        borderBottom: "2px solid var(--brand)",
        boxShadow:    "var(--shadow)",
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <NavLink to="/home" className="flex items-center gap-2.5 shrink-0">
          <img 
            src={CrackcodeLogo} 
            alt="CrackCode Logo" 
            className="h-9 w-9 object-contain"
          />
          <div>
            <div className="font-extrabold leading-tight" style={{ color: "var(--text)" }}>CrackCode</div>
            <div className="text-xs leading-tight" style={{ color: "var(--muted)" }}>Detective Dashboard</div>
          </div>
        </NavLink>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_TABS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold transition-opacity ${
                  isActive ? "text-white" : "hover:opacity-70"
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? "var(--brand)" : "transparent",
                color:      isActive ? "#fff"         : "var(--text)",
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: search + bell + settings */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Search input */}
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted)" }} />
            <input
              placeholder="Search Cases..."
              className="w-48 pl-8 pr-3 py-2 rounded-xl text-sm border transition-shadow duration-200 focus:outline-none focus:ring-2"
              style={{
                background: "var(--surface2)",
                border:     "1.5px solid var(--border)",
                color:      "var(--text)",
                "--tw-ring-color": "rgba(255,150,68,0.3)",
              }}
            />
          </div>

          {/* Bell */}
          <button
            className="relative p-2 rounded-xl hover:opacity-70 transition-opacity"
            style={{ color: "var(--text)" }}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--brand)" }} />
          </button>

          {/* Settings button + dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm text-white transition-transform hover:scale-105 active:scale-95"
              style={{ background: "var(--brand)", boxShadow: "var(--shadowBrand)" }}
            >
              <Settings size={14} className={open ? "animate-spin" : ""} />
              Settings
            </button>

            {open && (
              <div
                className="absolute right-0 top-full mt-2 rounded-2xl border overflow-hidden z-50 min-w-[180px]"
                style={{ background: "var(--surface)", border: "1.5px solid var(--border)", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}
              >
                <div className="px-4 py-2.5 border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                  Color Theme
                </div>
                {themes.map((t) => (
                  <ThemeOption
                    key={t}
                    name={t}
                    active={t === theme}
                    onClick={() => { setTheme(t); setOpen(false); }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop to close dropdown */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </header>
  );
}