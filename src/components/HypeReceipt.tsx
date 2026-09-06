import React, { useRef, useState } from 'react';
import { Download, Share2, Check, Flame, ShieldCheck, Zap, Sparkles, Image as ImageIcon, Heart, Send } from 'lucide-react';
import { toPng } from 'html-to-image';
import { ScanResult } from '../types';

interface HypeReceiptProps {
  scanResult: ScanResult;
  userImage: string;
  isDemo?: boolean;
  onUploadReal?: () => void;
  onOpenShareModal?: () => void;
}

// Clean any messy quotes or markdown asterisks returned by the LLM
function sanitizeHypeText(text: string): string {
  return text
    .replace(/^["'“\s]+|["'”\s]+$/g, '') // remove leading/trailing quotes
    .replace(/\*\*/g, '') // strip markdown bold asterisks
    .trim();
}

function sanitizeSpec(spec: string): string {
  // Strip any existing '>', markdown bold '**', and trim
  const clean = spec.replace(/^[>\s*-]+/, '').replace(/\*\*/g, '').trim();
  return `> ${clean}`;
}

export const HypeReceipt: React.FC<HypeReceiptProps> = ({
  scanResult,
  userImage,
  isDemo = false,
  onUploadReal,
  onOpenShareModal,
}) => {
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewOriginalReceipt, setViewOriginalReceipt] = useState(false);

  const txId = useRef(`HB-${Math.floor(100000 + Math.random() * 900000)}-X7`).current;
  const timestamp = useRef(new Date().toISOString().replace('T', ' ').substring(0, 10)).current;

  const handleDownload = async () => {
    if (viewOriginalReceipt) {
      const link = document.createElement('a');
      link.download = 'HYPEBESTIE_DEMO_RECEIPT.png';
      link.href = '/assets/demo-hb-receipt.png';
      link.click();
      return;
    }

    const card = receiptRef.current || document.getElementById('hype-receipt-card');
    if (!card) return;

    try {
      setIsDownloading(true);
      const dataUrl = await toPng(card, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#1a1a1a',
      });

      const link = document.createElement('a');
      const filename = scanResult.friendName
        ? `HYPEBESTIE_${scanResult.friendName.toUpperCase()}_RECEIPT.png`
        : isDemo
        ? 'HYPEBESTIE_DEMO_RECEIPT.png'
        : 'HYPEBESTIE_RECEIPT.png';
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export receipt PNG:', err);
      alert('Could not export receipt image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = () => {
    const friendTag = scanResult.friendName ? ` (Dedicated to ${scanResult.friendName})` : '';
    const cleanText = sanitizeHypeText(scanResult.hypeText);
    const shareText = `🔥 HYPEBESTIE RECEIPT 🔥${friendTag}\n\nStyle Archetype: ${scanResult.styleName}\nMain Character Energy: ${scanResult['MCE%']}\n\n"${cleanText}"\n\n#HypeBESTIE #GoogleAI`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center gap-5 my-2">
      {/* Demo Status Banner */}
      {isDemo && (
        <div className="w-full max-w-md bg-gradient-to-r from-yellow-500/10 via-pink-500/10 to-cyan-500/10 border border-yellow-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="font-mono text-yellow-300 font-bold">
              DEMO SIMULATION COMPLETED
            </span>
          </div>
          {onUploadReal && (
            <button
              onClick={onUploadReal}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 text-black font-black uppercase text-[10px] tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              <span>Scan Real Photo</span>
            </button>
          )}
        </div>
      )}

      {/* Main Action Bar: Send Compliment to Friend */}
      {onOpenShareModal && (
        <button
          onClick={onOpenShareModal}
          className="w-full max-w-md py-3.5 px-5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-400 text-black font-black uppercase text-xs tracking-wider shadow-xl shadow-pink-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2.5"
        >
          <Heart className="w-4 h-4 fill-black" />
          <span>
            {scanResult.targetType === 'friend'
              ? `SEND COMPLIMENT TO ${scanResult.friendName ? scanResult.friendName.toUpperCase() : 'FRIEND'} (EMAIL / IG)`
              : 'SEND COMPLIMENT TO FRIEND (EMAIL / IG)'}
          </span>
          <Send className="w-3.5 h-3.5 ml-1" />
        </button>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-md">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-cyan-400 transition-colors cursor-pointer shadow-lg active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'EXPORTING...' : 'DOWNLOAD PNG RECEIPT'}</span>
        </button>

        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-gray-200 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
          title="Share Hype Text"
        >
          {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'COPIED!' : 'SHARE'}</span>
        </button>

        {isDemo && (
          <button
            onClick={() => setViewOriginalReceipt(!viewOriginalReceipt)}
            className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#151515] hover:bg-[#222] border border-cyan-500/30 text-cyan-300 font-mono text-[11px] uppercase tracking-tight active:scale-95 transition-all cursor-pointer"
            title="Toggle Original Asset vs Thermal Canvas"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{viewOriginalReceipt ? 'Thermal Card' : 'Asset PNG'}</span>
          </button>
        )}
      </div>

      {viewOriginalReceipt && isDemo ? (
        <div className="w-full max-w-md bg-[#1a1a1a] p-3 rounded-xl border border-cyan-500/30 shadow-2xl space-y-2 text-center">
          <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            ORIGINAL DEMO RECEIPT ASSET
          </div>
          <img
            src="/assets/demo-hb-receipt.png"
            alt="Demo HypeBestie Receipt"
            className="w-full h-auto rounded-lg border border-white/10 shadow-lg"
          />
        </div>
      ) : (
        /* THERMAL RECEIPT CANVAS CONTAINER */
        <div
          id="hype-receipt-card"
          ref={receiptRef}
          className="relative w-full max-w-md bg-[#1a1a1a] shadow-2xl overflow-hidden font-mono text-xs border border-white/10 rounded-sm"
        >
          {/* Top Paper Tooth Pattern */}
          <div
            className="h-2.5 bg-[#1a1a1a] w-full"
            style={{
              background: 'repeating-linear-gradient(45deg, #111, #111 10px, #1a1a1a 10px, #1a1a1a 20px)',
            }}
          />

          <div className="p-6 sm:p-8 space-y-6">
            {/* RECEIPT HEADER */}
            <div className="text-center space-y-1 border-b border-white/10 pb-4">
              <h3 className="font-mono text-xs text-gray-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap">
                <Flame className="w-4 h-4 text-cyan-400 shrink-0 fill-cyan-400/20" />
                <span>HYPEBESTIE RECEIPT</span>
              </h3>
              <p className="font-mono text-[10px] text-gray-500 whitespace-nowrap">
                ID: {txId} // {timestamp} {isDemo ? '// DEMO' : ''}
              </p>
              {scanResult.targetType === 'friend' && (
                <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-mono text-pink-400 font-bold uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 fill-pink-400" />
                  <span>DEDICATED TO: {scanResult.friendName?.toUpperCase() || 'FRIEND'}</span>
                </div>
              )}
            </div>

            {/* PHOTO THUMBNAIL & ARCHETYPE BLOCK */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-900 rounded-sm overflow-hidden border border-white/10 shrink-0 grayscale contrast-125">
                <img
                  src={userImage}
                  alt="Scan Target"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-cyan-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase whitespace-nowrap">
                    MCE: {scanResult['MCE%']}
                  </span>
                  <span className="bg-pink-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase whitespace-nowrap">
                    {scanResult.targetType === 'friend'
                      ? 'FRIEND_HYPE'
                      : isDemo
                      ? 'DEMO_STAR'
                      : 'ALPHA_CORE'}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black italic tracking-tight text-white uppercase leading-snug break-words">
                  {scanResult.styleName.replace(/\*\*/g, '')}
                </h4>
              </div>
            </div>

            {/* BIOMETRIC SPECS (Sanitized to prevent formatting glitches) */}
            <div className="space-y-1.5 py-3 border-y border-dashed border-white/10">
              {scanResult.biometricSpecs.map((spec, idx) => (
                <p key={idx} className="font-mono text-[10px] text-cyan-400 tracking-normal leading-normal break-words">
                  {sanitizeSpec(spec)}
                </p>
              ))}
            </div>

            {/* BESTIE TRIBUTE */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-pink-400 font-bold block">
                {scanResult.targetType === 'friend'
                  ? `SPECIAL BESTIE COMPLIMENT FOR ${scanResult.friendName?.toUpperCase() || 'FRIEND'}:`
                  : 'BESTIE VALIDATION REPORT:'}
              </span>
              <p className="text-xs text-gray-200 font-sans font-medium leading-relaxed italic bg-black/40 p-3.5 rounded border border-white/5 break-words">
                "{sanitizeHypeText(scanResult.hypeText)}"
              </p>
            </div>

            {/* RECEIPT FOOTER */}
            <div className="pt-4 border-t border-white/10 flex flex-col items-center gap-1 text-center">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase font-mono whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>CERTIFIED BY GEMINI // POWERED BY LOVE</span>
              </div>
              <span className="font-mono text-[9px] text-gray-500 tracking-widest uppercase">
                *{txId}*
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};