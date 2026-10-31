import React from 'react';
import { ArrowRight, Mountain, MapPin, Compass, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onExploreGear: () => void;
  onJoinCampFest: () => void;
  onViewTrailInfo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreGear,
  onJoinCampFest,
  onViewTrailInfo
}) => {
  return (
    <section id="hero" className="relative bg-[#0c0e12] overflow-hidden">
      {/* High-Resolution Mt. Ulanin Background Banner with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/images/mt_ulanin_summit_hero.webp" type="image/webp" />
          <img
            src="/images/mt_ulanin_summit_hero.jpg"
            alt="Mt. Ulanin 710 MASL Summit View in Brgy. Cumba Batangas City"
            referrerPolicy="no-referrer"
            {...({ fetchpriority: 'high' } as any)}
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
          />
        </picture>
        {/* Measured dark gradient scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e12]/95 via-[#0c0e12]/80 to-[#0c0e12]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-transparent to-[#0c0e12]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-3xl">
          
          {/* Subtle Location & Brand Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-4 tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Brgy. Cumba, Batangas City</span>
            </span>
            <span className="text-slate-500">/</span>
            <span>710 MASL Sea-to-Summit</span>
          </div>

          {/* Primary Slogan & Display Headline */}
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-6 text-balance">
            Brings you to the <span className="text-emerald-400">right habitat</span>.
          </h1>

          {/* Descriptive Body Measure */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
            Rooted in Batangas City, WOLF Outdoor creates rugged trail apparel, ultralight ripstop camping hammocks, and expedition shelters built for raw Philippine summits. Join us on the ridge of Mt. Ulanin as sea breezes meet mountain horizons.
          </p>

          {/* Action Points: Bright Signal Orange + Emerald Accent */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button
              onClick={onJoinCampFest}
              className="px-6 py-3.5 text-sm uppercase font-bold tracking-wider text-white bg-orange-600 hover:bg-orange-500 active:scale-95 rounded-lg transition-all shadow-xl shadow-orange-950/60 flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <span>Mt. Ulanin Camp Fest 2026</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreGear}
              className="px-6 py-3.5 text-sm uppercase font-bold tracking-wider text-slate-200 hover:text-white bg-[#161a22]/90 hover:bg-[#1f2633] border border-[#2b3344] hover:border-emerald-500/60 rounded-lg transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <span>Explore Gear Catalog</span>
            </button>

            <button
              onClick={onViewTrailInfo}
              className="px-4 py-3.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1.5 focus:outline-none"
            >
              <Mountain className="w-4 h-4" />
              <span>Trail Profile & Views</span>
            </button>
          </div>

          {/* Mountain Telemetry & Authenticity Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#141820]/90 border border-white/10 backdrop-blur-md">
            <div>
              <span className="block text-[11px] uppercase font-mono text-slate-400 tracking-wider">Summit Elevation</span>
              <span className="font-display font-bold text-xl sm:text-2xl text-white tabular-nums">710 MASL</span>
              <span className="block text-[11px] text-emerald-400 font-medium">Mt. Ulanin Peak</span>
            </div>

            <div>
              <span className="block text-[11px] uppercase font-mono text-slate-400 tracking-wider">Geographic Vantage</span>
              <span className="font-display font-bold text-xl sm:text-2xl text-white">Sea-to-Summit</span>
              <span className="block text-[11px] text-slate-400">Verde Island Passage</span>
            </div>

            <div>
              <span className="block text-[11px] uppercase font-mono text-slate-400 tracking-wider">Trailhead</span>
              <span className="font-display font-bold text-xl sm:text-2xl text-white">Brgy. Cumba</span>
              <span className="block text-[11px] text-slate-400">Batangas City, PH</span>
            </div>

            <div>
              <span className="block text-[11px] uppercase font-mono text-slate-400 tracking-wider">Community Vibe</span>
              <span className="font-display font-bold text-xl sm:text-2xl text-white">Hike · Bike · Camp</span>
              <span className="block text-[11px] text-orange-400 font-medium">Fest Nov 14–15</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
