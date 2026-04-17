import { useState } from 'react';
import { useTheme } from '../../context/theme/ThemeContext'
import { Mail, Link, Link2, Copy, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

function InviteCard() {
  // eslint-disable-next-line no-unused-vars
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false);
  const inviteLink = 'https://app.crackcodehq.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:scale-102 border-l-4"
      style={{
        background: `linear-gradient(135deg, var(--surface) 0%, rgba(255, 165, 0, 0.03) 100%)`,
        color: 'var(--text)',
        borderColor: 'var(--brand)',
        borderWidth: '1px'
      }}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
        {/* Left: Info */}
        <div className='flex flex-row md:col-span-1 gap-6'>
          <div>
            <h3 className="flex items-center justify-baseline gap-2 text-lg font-bold mb-1">
              <span><Link2 /></span>
              Invite Friends
            </h3>
          </div>
          <div>
            <p style={{ color: 'var(--textSec)' }} className="text-xs">
              Know someone who’d enjoy learning to code through challenges and stories? <br />
              Send them this link and let them jump in!
            </p>
          </div>
        </div>

        {/* Center: Copy Link */}
        <div className='md:col-span-1'>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 rounded-lg px-3 py-2 text-xs focus:outline-none transition-all duration-300"
              style={{
                background: 'rgba(255, 165, 0, 0.05)',
                color: 'var(--muted)',
                border: '1px solid var(--border)'
              }}
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 text-xs flex-shrink-0"
              style={{
                background: 'var(--brand)',
                color: 'var(--surface)'
              }}
              onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
            >
              {copied ? (
                <>
                  <CheckCircle2 className='w-3 h-3' />
                  ✓
                </>
              ) : (
                <Copy className='w-3 h-3' />
              )}
            </button>
          </div>
        </div>

        {/* Right: Stats */}
        {/* <div className='md:col-span-1 flex gap-4'>
          <div className='flex-1'>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--textSec)' }}>
              Invited
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--brand)' }}>
              {friendsInvited}
            </p>
          </div>
          <div className='flex-1'>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--textSec)' }}>
              Points
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--brand)' }}>
              +{bonusPoints}
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default InviteCard;