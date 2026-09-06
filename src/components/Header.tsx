import React from 'react';
import { Sparkles, Heart, Zap } from 'lucide-react';

interface HeaderProps {
  creditsRemaining: number | null;
  maxCredits?: number;
}

export const Header: React.FC<HeaderProps> = ({
  creditsRemaining,
  maxCredits = 25,
}) => {
  const maxLimit = maxCredits || 25;
  const credits = creditsRemaining !== null ? creditsRemaining : maxLimit;
  const progressPercent = Math.min(100, Math.max(0, (credits / maxLimit) * 100));

  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between px-4 sm:px-8 py-3.5 border-b border-white/10 bg-[#0f0f0f] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-tr from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
          <span className="font-black text-black text-lg italic tracking-tighter">HB</span>
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tighter uppercase italic text-white flex items-center gap-1.5">
            HypeBESTIE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 text-xs font-mono font-black border border-pink-500/30 px-1.5 py-0.5 rounded-full not-italic">
              WITH LOVE
            </span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono hidden xs:block">
            AI Vibe Scanner &amp; Sincere Compliment Engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Daily Quota Counter */}
        <div className="bg-[#1a1a1a] px-3.5 py-1.5 rounded-full border border-white/5 flex items-center gap-2.5 shadow-inner">
          <span className="text-[10px] text-gray-400 font-bold uppercase hidden sm:inline font-mono">
            Daily Scans:
          </span>
          <div className="flex items-center gap-2">
            <div className="w-16 sm:w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span
              className={`text-xs font-mono font-bold ${
                creditsRemaining === 0 ? 'text-red-400' : 'text-pink-400'
              }`}
            >
              {creditsRemaining !== null ? `${creditsRemaining}/${maxLimit}` : `--/${maxLimit}`}
            </span>
          </div>
        </div>

        {/* 100% Free Badge */}
        <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400">
          <Sparkles className="w-3 h-3" />
          <span>25 Free Daily</span>
        </div>
      </div>
    </header>
  );
};


