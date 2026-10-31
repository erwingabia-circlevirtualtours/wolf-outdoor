import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AnnouncementBarProps {
  onRegisterClick?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onRegisterClick }) => {
  const { announcement } = useStore();

  if (!announcement.isActive) return null;

  return (
    <div className="bg-[#12151c] border-b border-emerald-900/40 text-xs py-2 px-4 text-slate-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
            ▲
          </span>
          <span className="font-medium text-slate-200">{announcement.badge}</span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden sm:inline text-slate-400">{announcement.headline}</span>
          <span className="hidden md:inline text-slate-400">·</span>
          <span className="hidden md:inline text-emerald-400 font-medium">{announcement.highlightText}</span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {announcement.contactNumber && (
            <a
              href={`tel:${announcement.contactNumber.replace(/\s+/g, '')}`}
              className="hidden sm:inline-flex items-center gap-1 font-mono text-slate-300 hover:text-emerald-400 transition-colors text-[11px]"
            >
              <span className="text-slate-500">Contact:</span>
              <span className="text-emerald-400 font-semibold">{announcement.contactNumber}</span>
            </a>
          )}

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
