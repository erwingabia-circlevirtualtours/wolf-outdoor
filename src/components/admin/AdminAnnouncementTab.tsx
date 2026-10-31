import React, { useState } from 'react';
import { Megaphone, Save, Sparkles, CheckCircle2, Phone, Tag, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminAnnouncementTab: React.FC = () => {
  const { announcement, updateAnnouncement } = useStore();

  const [badge, setBadge] = useState(announcement.badge);
  const [headline, setHeadline] = useState(announcement.headline);
  const [highlightText, setHighlightText] = useState(announcement.highlightText);
  const [contactNumber, setContactNumber] = useState(announcement.contactNumber);
  const [promoCode, setPromoCode] = useState(announcement.promoCode);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(announcement.freeShippingThreshold);
  const [isActive, setIsActive] = useState(announcement.isActive);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement({
      badge: badge.trim(),
      headline: headline.trim(),
      highlightText: highlightText.trim(),
      contactNumber: contactNumber.trim(),
      promoCode: promoCode.trim().toUpperCase(),
      freeShippingThreshold: Number(freeShippingThreshold) || 2500,
      isActive
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Live Preview Card */}
      <div className="bg-[#12151c] p-4 rounded-xl border border-[#222a3a] space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront Top Bar Live Preview</span>
          </span>
          <span className="text-[11px] text-slate-500">
            Status: {isActive ? '🟢 Active on storefront' : '🔴 Hidden on storefront'}
          </span>
        </div>

        {isActive ? (
          <div className="bg-[#0e1015] border border-emerald-900/40 rounded-lg p-2.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                ▲
              </span>
              <span className="font-semibold text-white">{badge}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{headline}</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-medium">{highlightText}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-[11px]">
              <span className="text-slate-400 font-mono">
                Contact: <strong className="text-emerald-400">{contactNumber}</strong>
              </span>
              <span className="text-emerald-400 font-semibold">Register for Camp Fest →</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-[#0e1015] text-slate-500 text-xs italic text-center border border-dashed border-[#222a3a]">
            Top announcement bar is currently toggled OFF.
          </div>
        )}
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="bg-[#12151c] border border-[#222a3a] rounded-xl p-5 space-y-5 shadow-xl">
        
        <div className="flex items-center justify-between border-b border-[#222a3a] pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">
              Announcement & Store Banner Settings
            </h3>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-slate-300">Show Banner</span>
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Badge / Event Title
            </label>
            <input
              type="text"
              value={badge}
              onChange={e => setBadge(e.target.value)}
              placeholder="e.g. Mt. Ulanin Camp Fest 2026"
              className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Store Hotline / Direct Contact
            </label>
            <input
              type="text"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              placeholder="0956 369 5062"
              className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Headline Notice (Event Dates, Coordinates, or Store Hours)
          </label>
          <input
            type="text"
            value={headline}
            onChange={e => setHeadline(e.target.value)}
            placeholder="Nov 14–15, 2026 · 710 MASL · Brgy. Cumba, Batangas City"
            className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Special Offer / Shipping Notice
            </label>
            <input
              type="text"
              value={highlightText}
              onChange={e => setHighlightText(e.target.value)}
              placeholder="Free delivery on gear orders ₱2,500+"
              className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Free Shipping Threshold (₱ PHP)
            </label>
            <input
              type="number"
              min={0}
              value={freeShippingThreshold}
              onChange={e => setFreeShippingThreshold(Number(e.target.value))}
              placeholder="2500"
              className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Active Store Promo Code
            </label>
            <input
              type="text"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
              placeholder="HABITAT10"
              className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono font-bold outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Gives 10% off gear orders at checkout
            </span>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-3 border-t border-[#222a3a] flex items-center justify-between">
          <div>
            {savedNotice && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Announcement updated instantly on storefront!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Update Store Announcement</span>
          </button>
        </div>

      </form>

    </div>
  );
};
