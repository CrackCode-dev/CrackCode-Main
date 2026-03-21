import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/theme/ThemeContext';
import { Settings, Sun, Moon, Cloud, Palette, User, LogOut, Lock } from 'lucide-react';
import { THEMES } from '../../context/theme/ThemeContext';

const LOCKED_THEMES = ['country', 'midnight'];
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051';

export default function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const [ownedThemeKeys, setOwnedThemeKeys] = useState(new Set());
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

  useEffect(() => {
    if (!open) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch(`${API_BASE_URL}/api/shop/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const inventory = Array.isArray(data) ? data : data?.inventory || data?.items || [];
        const keys = new Set();
        inventory.forEach((inv) => {
          const item = inv?.itemId || inv?.item || inv;
          if (item?.category === 'theme' && item?.metadata?.themeKey) {
            keys.add(item.metadata.themeKey);
          }
        });
        setOwnedThemeKeys(keys);
      })
      .catch(() => {});
  }, [open]);

  const isLocked = (themeKey) =>
    LOCKED_THEMES.includes(themeKey) && !ownedThemeKeys.has(themeKey);

  const handleThemeSelect = (themeKey) => {
    if (isLocked(themeKey)) {
      navigate('/store');
      setOpen(false);
      return;
    }
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
              {THEMES.map((t) => {
                const locked = isLocked(t);
                return (
                  <button
                    key={t}
                    onClick={() => handleThemeSelect(t)}
                    title={locked ? 'Purchase from Detective Store ($6)' : themeLabels[t]}
                    className='p-2 rounded-md transition-all duration-300 flex flex-col items-center gap-1 text-xs font-medium relative'
                    style={{
                      background:
                        theme === t
                          ? 'var(--brand)'
                          : 'rgba(255, 165, 0, 0.05)',
                      color: theme === t ? 'var(--surface)' : locked ? 'var(--muted)' : 'var(--text)',
                      border: theme === t ? '2px solid var(--brand)' : '1px solid var(--border)',
                      cursor: locked ? 'not-allowed' : 'pointer',
                      opacity: locked ? 0.6 : 1,
                    }}
                  >
                    {locked ? <Lock className='w-4 h-4' /> : themeIcons[t]}
                    <span>{themeLabels[t]}</span>
                    {locked && (
                      <span
                        className='absolute -top-1 -right-1 text-[9px] font-bold px-1 rounded'
                        style={{ background: 'var(--brand)', color: '#fff' }}
                      >
                        $6
                      </span>
                    )}
                  </button>
                );
              })}
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
