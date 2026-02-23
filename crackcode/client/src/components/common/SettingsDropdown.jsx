import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/theme/ThemeContext';
import { Settings, Sun, Moon, Cloud, Palette, User, LogOut } from 'lucide-react';
import { THEMES } from '../../context/theme/ThemeContext';

export default function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const themeIcons = {
    light: <Sun className='w-4 h-4' />,
    cream: <Palette className='w-4 h-4' />,
    dark: <Moon className='w-4 h-4' />,
    country: <Cloud className='w-4 h-4' />,
    midnight: <Moon className='w-4 h-4' />
  };

  const themeLabels = {
    light: 'Light',
    cream: 'Cream',
    dark: 'Dark',
    country: 'Country',
    midnight: 'Midnight'
  };

  const handleThemeSelect = (themeKey) => {
    setTheme(themeKey);
    setOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/user-profile');
    setOpen(false);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
    setOpen(false);
  };

  return (
    <div className='relative'>
      {/* Settings Button */}
      <button
        onClick={() => setOpen(!open)}
        className='p-2 rounded-lg transition-all duration-300 hover:bg-opacity-10'
        style={{
          color: 'var(--text)',
          background: 'rgba(255, 165, 0, 0.05)'
        }}
      >
        <Settings className='w-5 h-5 sm:w-6 sm:h-6' />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className='absolute right-0 mt-2 w-56 rounded-lg shadow-2xl z-50 border animate-in fade-in slide-in-from-top-2'
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)'
          }}
        >
          {/* Theme Section */}
          <div className='p-4 border-b' style={{ borderColor: 'var(--border)' }}>
            <p className='text-xs font-semibold uppercase mb-3' style={{ color: 'var(--textSec)' }}>
              Select Theme
            </p>
            <div className='grid grid-cols-3 gap-2'>
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => handleThemeSelect(t)}
                  className='p-2 rounded-md transition-all duration-300 flex flex-col items-center gap-1 text-xs font-medium'
                  style={{
                    background:
                      theme === t
                        ? 'var(--brand)'
                        : 'rgba(255, 165, 0, 0.05)',
                    color: theme === t ? 'var(--surface)' : 'var(--text)',
                    border: theme === t ? '2px solid var(--brand)' : '1px solid var(--border)',
                    cursor: 'pointer'
                  }}
                >
                  {themeIcons[t]}
                  <span>{themeLabels[t]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Profile Section */}
          <div
            className='p-2'
            style={{
              borderBottom: '1px solid var(--border)'
            }}
          >
            <button
              onClick={handleProfileClick}
              className='w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300'
              style={{
                background: 'rgba(255, 165, 0, 0.05)',
                color: 'var(--text)'
              }}
            >
              <User className='w-4 h-4' />
              <span>View Profile</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className='p-2'>
            <button
              onClick={handleLogout}
              className='w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300'
              style={{
                color: '#dc2626'
              }}
            >
              <LogOut className='w-4 h-4' />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Close on Click Outside */}
      {open && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
