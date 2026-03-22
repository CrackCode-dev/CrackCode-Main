import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/theme/ThemeContext'
import { Settings } from 'lucide-react'
import SettingsDropdown from './SettingsDropdown'

function Navbar() {
  const { theme, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)

  const NAV_TABS = [
    { to: "/learn", label: "Learn" },
    { to: "/caselog", label: "Case Log" },
    { to: "/careermap", label: "Career Maps" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/store", label: "Store" },
  ]

  return (
    <div className='gap-1 hidden md:flex justify-center items-center'>
      {NAV_TABS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className="relative inline-flex flex-col px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-300 group"
          style={({ isActive }) => ({
            background: isActive ? "var(--brand)" : "transparent",
            color: isActive ? "var(--brandInk)" : "var(--text)",
          })}
        >
          {label}
          <span
            className="absolute bottom-1 left-4 right-4 h-0.5 w-0 group-hover:w-[calc(100%-2rem)] transition-all duration-300 rounded-full"
            style={{ background: "linear-gradient(to right, var(--brand), rgba(255,165,0,0.4))" }}
          />
        </NavLink>
      ))}
    </div>
  )
}

export default Navbar