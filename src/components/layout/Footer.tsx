import React from 'react';
import { Mountain, MapPin, ExternalLink, Heart, Shield, Compass } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenCampFestRegistration: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenCampFestRegistration
}) => {
  return (
    <footer className="bg-[#080a0d] border-t border-[#1d222e] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1d222e]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/wolf_outdoor_logo.jpg"
                alt="WOLF Outdoor Batangas City"
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain rounded-md border border-emerald-900/60 bg-emerald-950/40 p-0.5"
              />
              <div>
                <span className="font-display font-black text-lg tracking-wider text-white uppercase block">
                  WOLF OUTDOOR
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 block -mt-0.5">
                  BATANGAS CITY · 710 MASL
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              "Brings you to the right habitat." Local outdoor apparel, ultralight camping hammocks, expedition shelters, and coordinators of Mt. Ulanin Camp Fest in Brgy. Cumba, Batangas City.
            </p>

            {/* Official Facebook Link & Mobile Contact */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <a
                href="https://www.facebook.com/wolfoutdoorbatangascity"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141820] hover:bg-[#1f2533] text-slate-200 hover:text-white border border-[#273040] hover:border-emerald-500 transition-colors text-xs font-semibold group"
              >
                <span>Follow on Facebook</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="tel:09563695062"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141820] hover:bg-[#1f2533] text-emerald-400 hover:text-emerald-300 border border-[#273040] hover:border-emerald-500/80 transition-colors text-xs font-mono font-medium"
              >
                <span>Mobile: 0956 369 5062</span>
              </a>
            </div>
          </div>

          {/* Habitat Navigation */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-3">
              Habitat & Trails
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateSection('trail-info')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Mt. Ulanin (710 MASL)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trail-info')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Brgy. Cumba Ridge Trailhead
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trail-info')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Verde Island Sea Views
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trail-info')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Leave No Trace (LNT) Ethics
                </button>
              </li>
            </ul>
          </div>

          {/* Gear & Store */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-3">
              Apparel & Gear
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateSection('catalog')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  WOLF Ripstop Hammocks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Technical Trail Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Summit 2P Expedition Tents
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Trekking Poles & Dry Bags
                </button>
              </li>
            </ul>
          </div>

          {/* Camp Fest & Community */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-3">
              Camp Fest & Community
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenCampFestRegistration}
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors text-left"
                >
                  Camp Fest 2026 Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('photo-contest')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Sea / Summit / City Photo Contest
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('recommendations')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Community Recommendations & Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('sponsors')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Ride Plus & Batangas Backpackers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('sponsors')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Kamp 043 & Coffee&GoodFlow
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Clean Copyright, Coordinates & Habitat Marker */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} WOLF Outdoor Batangas City.</span>
            <span>·</span>
            <span>All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>13.7565° N, 121.0583° E</span>
            </span>
            <span>·</span>
            <span className="text-emerald-400 font-bold">710 MASL Elevation</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
