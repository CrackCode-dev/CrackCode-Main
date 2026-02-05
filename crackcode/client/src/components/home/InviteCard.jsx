import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Mail, Link } from 'lucide-react';

function InviteCard() {
    const [copied, setCopied] = useState(false);
    //Sample invite link
    const inviteLink = 'https://www.crackcode.com/invite/abc123';

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card variant='flat' padding='lg' className='mt-8 border border-orange-500/50'>
            <h2 className='text-2xl font-bold text-white mb-2'>Invite a Friend</h2>
            <p className='text-gray-400 mb-6'>
                Bring your friends into the investigation. Both of you get bonus points when they join!
            </p>

            {/* Invite Link Section */}
            <div className='mb-4'>
                <label className='text-sm text-gray-300 mb-2 block'>Your Invite Link</label>
                <div className='flex gap-6'>
                    <input 
                    type="text"
                    readOnly
                    value={inviteLink}
                    className='flex-1 bg-[#1a1a1a] border border-[#444040] rounded-lg px-4 py-3 text-gray-400 text-sm focus:outline-none' 
                    />
                    <Button 
                    variant='primary'
                    onClick={handleCopy}
                    className='px-6'>
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                </div>
            </div>

            {/* Share Buttons */}
            <div className='flex gap-4'>
                <Button variant='outline' className='w-full mb-3 flex items-center justify-center gap-2'>
                    <Mail size={16} />
                    Share via Email
                </Button>
                <Button variant='outline' className='w-full flex items-center justify-center gap-2'>
                    <Link size={16} />
                    Share Link
                </Button>
            </div>


        </Card>
    );
}

export default InviteCard;