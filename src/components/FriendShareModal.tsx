import React, { useState } from 'react';
import { Mail, Instagram, Copy, Check, ExternalLink, X, Heart, Share2, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { ScanResult } from '../types';

interface FriendShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResult;
}

export const FriendShareModal: React.FC<FriendShareModalProps> = ({
  isOpen,
  onClose,
  scanResult,
}) => {
  const [copiedType, setCopiedType] = useState<'all' | 'email' | 'ig' | null>(null);
  const [friendEmail, setFriendEmail] = useState('');
  const [isSavingImage, setIsSavingImage] = useState(false);

  if (!isOpen) return null;

  const friendName = scanResult.friendName?.trim() || 'my bestie';

  const cleanHype = scanResult.hypeText
    .replace(/^["'“\s]+|["'”\s]+$/g, '')
    .replace(/\*\*/g, '')
    .trim();

  const emailSubject = `✨ A Certified Hype Receipt for ${friendName} from HypeBESTIE! ✨`;

  const emailBody = `Hey ${friendName}! 💕

I ran your photo through HypeBESTIE's AI vibe engine, and here is your official, certified hype receipt:

───────────────────────────────
🔥 STYLE ARCHETYPE: ${scanResult.styleName}
👑 MAIN CHARACTER ENERGY: ${scanResult['MCE%']}
───────────────────────────────

TECHNICAL SPECS:
${scanResult.biometricSpecs.map((s) => s.replace(/\*\*/g, '')).join('\n')}

VALIDATION REPORT:
"${cleanHype}"

───────────────────────────────
Sent with pure love and dopamine via HypeBESTIE ✨`;

  const instagramCaption = `✨ Certified Hype Receipt for ${friendName} ✨

👑 Main Character Energy: ${scanResult['MCE%']}
💅 Aesthetic Archetype: ${scanResult.styleName}

"${cleanHype}"

Sent with love via @hypebestie 💖🔥`;

  const handleCopy = (text: string, type: 'all' | 'email' | 'ig') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadStoryPNG = async () => {
    const card = document.getElementById('hype-receipt-card');
    if (!card) {
      alert('Receipt card not found. Please scroll down to view the receipt.');
      return;
    }

    try {
      setIsSavingImage(true);
      const dataUrl = await toPng(card, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#1a1a1a',
      });

      const link = document.createElement('a');
      link.download = `HYPEBESTIE_${friendName.toUpperCase()}_STORY.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export Story PNG:', err);
      alert('Could not download image. Please use the Download button below the receipt.');
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleSendEmailNative = () => {
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:${encodeURIComponent(friendEmail)}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoUrl;
  };

  const handleSendEmailGmail = () => {
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      friendEmail
    )}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(gmailUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: emailSubject,
          text: instagramCaption,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopy(instagramCaption, 'all');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden text-gray-100 font-sans max-h-[90vh] overflow-y-auto">
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2 pt-1">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 to-yellow-400 p-[2px] shadow-lg shadow-pink-500/20">
              <div className="w-full h-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400 fill-pink-400/20" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-white">
              Send Compliment to {friendName}
            </h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Deliver this certified dopamine boost directly to your friend via Email, Instagram, or direct message!
            </p>
          </div>

          {/* Quick Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via Phone Apps (Messages, IG, WhatsApp)</span>
            </button>
          )}

          {/* INSTAGRAM OPTION */}
          <div className="bg-[#1b1b1b] border border-white/5 rounded-xl p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Share on Instagram</h3>
                  <p className="text-[10px] text-gray-400">DM, Story, or Post</p>
                </div>
              </div>
              <a
                href="https://www.instagram.com/direct/inbox/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 hover:underline"
              >
                <span>Open IG</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-white/5 text-[11px] font-sans text-gray-300 italic leading-relaxed">
              "{instagramCaption}"
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleCopy(instagramCaption, 'ig')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
              >
                {copiedType === 'ig' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-400">Copied Caption!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-pink-400" />
                    <span>Copy IG Text</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadStoryPNG}
                disabled={isSavingImage}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-yellow-400" />
                <span>{isSavingImage ? 'Saving...' : 'Save Story PNG'}</span>
              </button>
            </div>
          </div>

          {/* EMAIL OPTION */}
          <div className="bg-[#1b1b1b] border border-white/5 rounded-xl p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Send via Email</h3>
                <p className="text-[10px] text-gray-400">Open in Gmail Web or Mail App</p>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="email"
                placeholder="Friend's email (optional)..."
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none font-mono"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSendEmailGmail}
                  className="py-2.5 px-3 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  title="Opens in Gmail web"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Gmail</span>
                </button>

                <button
                  onClick={handleSendEmailNative}
                  className="py-2.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  title="Opens in Apple Mail / Outlook app"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mail App</span>
                </button>
              </div>

              <button
                onClick={() => handleCopy(emailBody, 'email')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[11px] font-mono text-gray-300 transition-colors cursor-pointer mt-1"
              >
                {copiedType === 'email' ? (
                  <>
                    <Check className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-400">Email Draft Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-gray-400" />
                    <span>Copy Full Email Draft</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="text-xs font-mono text-gray-500 hover:text-gray-300 uppercase tracking-widest cursor-pointer"
            >
              [Done / Close Window]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};