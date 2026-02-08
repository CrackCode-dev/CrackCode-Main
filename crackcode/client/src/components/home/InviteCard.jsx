import { useState } from 'react';
import { Mail, Link } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

function InviteCard() {
  const [copied, setCopied] = useState(false);
  const inviteLink = 'https://codedetectives.com/invite/abc123xyz';
  const friendsInvited = 3;
  const bonusPoints = 450;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="flat" padding="lg" className="mt-8 border-orange-500/50">
      <h2 className="text-2xl font-bold text-white mb-2">Invite a Friend</h2>
      <p className="text-gray-400 mb-6">
        Bring your friends into the investigation. Both of you get bonus points when they join!
      </p>

      {/* Invite Link Section */}
      <div className="mb-4">
        <label className="text-sm text-gray-300 mb-2 block">Your Invite Link</label>
        <div className="flex gap-6">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="flex-1 bg-[#1a1a1a] border border-[#444040] rounded-lg px-4 py-3 text-gray-400 text-sm focus:outline-none"
          />
          <Button 
            variant="primary" 
            onClick={handleCopy}
            className="px-6"
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="mb-6">
        <p className="text-sm text-gray-300 mb-3">Or share via</p>
        <div className="grid grid-cols-2 gap-4">
          <Button variant='outline' className="flex items-center justify-center gap-2 py-3 px-4 text-orange-500">
            <Mail size={18} />
            <span>Email</span>
          </Button>
          <Button variant='outline' className="flex items-center justify-center gap-2 py-3 px-4 text-orange-500">
            <Link size={18} />
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t border-orange-500/50 pt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">Friends Invited</p>
          <p className="text-4xl font-bold text-orange-700">{friendsInvited}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Bonus Points Earned</p>
          <p className="text-4xl font-bold text-orange-700">{bonusPoints}</p>
        </div>
      </div>
    </Card>
  );
}

export default InviteCard;