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
    { to: "/careermaps-Main", label: "Career Maps" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/shop", label: "Store" },
  ]

  return (
    <div className='gap-1 hidden md:flex justify-center items-center'>
      {NAV_TABS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className="px-4 py-2 rounded-lg text-base font-semibold transition-opacity hover:opacity-70"
          style={({ isActive }) => ({
            background: isActive ? 'var(--brand)' : 'transparent',
            color: isActive ? 'var(--brandInk)' : 'var(--text)',
          })}
        >
          {label}
        </NavLink>
      ))}
    </div>
  )
}

export default Navbar