import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onRegisterClick?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onRegisterClick }) => {
  return (
    <div className="bg-[#12151c] border-b border-emerald-900/40 text-xs py-2 px-4 text-slate-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
            ▲
          </span>
          <span className="font-medium text-slate-200">Mt. Ulanin Camp Fest 2026</span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden sm:inline text-slate-400">Nov 14–15, 2026 · 710 MASL · Brgy. Cumba, Batangas City</span>
          <span className="hidden md:inline text-slate-400">·</span>
          <span className="hidden md:inline text-emerald-400">Free delivery on gear orders ₱2,500+</span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <a
            href="tel:09563695062"
            className="hidden sm:inline-flex items-center gap-1 font-mono text-slate-300 hover:text-emerald-400 transition-colors text-[11px]"
          >
            <span className="text-slate-500">Contact:</span>
            <span className="text-emerald-400 font-semibold">0956 369 5062</span>
          </a>

          <button
            onClick={onRegisterClick}
            className="shrink-0 inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap group text-[11px]"
          >
            <span>Register for Camp Fest</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
