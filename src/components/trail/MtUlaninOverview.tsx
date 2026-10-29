import React, { useState } from 'react';
import { Mountain, Compass, Wind, Eye, CheckCircle2, MapPin } from 'lucide-react';

export const MtUlaninOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'views' | 'habitat'>('profile');

  return (
    <section id="trail-info" className="py-20 bg-[#0e1015] border-t border-[#1d222e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
              <span>Habitat Spotlight</span>
              <span className="text-slate-600">/</span>
              <span>Batangas City Peak</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Mt. Ulanin: 710 MASL Sea-to-Summit
            </h2>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#141820] border border-[#232938] rounded-lg">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'profile'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Trail Profile
            </button>
            <button
              onClick={() => setActiveTab('views')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'views'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Panoramic Views
            </button>
            <button
              onClick={() => setActiveTab('habitat')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'habitat'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Habitat & Ecology
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Display Visual */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#273040] bg-[#141820] aspect-[16/10] group">
              <img
                src={
                  activeTab === 'views'
                    ? '/images/contest_sea_view.jpg'
                    : activeTab === 'habitat'
                    ? '/images/wolf_ripstop_hammock.jpg'
                    : '/images/mt_ulanin_summit_hero.jpg'
                }
                alt="Mt. Ulanin Landscape in Brgy. Cumba"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-transparent to-black/20" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200 bg-[#0e1015]/80 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/10">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Brgy. Cumba Ridge Trailhead, Batangas City</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">710 MASL</span>
              </div>
            </div>

            {/* Quick 3-point Highlights */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#141820] border border-[#232938]">
                <span className="block text-[11px] font-mono text-slate-400 uppercase">Trek Duration</span>
                <span className="font-display font-bold text-white text-base">2.5 – 3.5 Hours</span>
                <span className="text-[11px] text-slate-500">From Cumba base</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141820] border border-[#232938]">
                <span className="block text-[11px] font-mono text-slate-400 uppercase">MTB Technicality</span>
                <span className="font-display font-bold text-white text-base">Intermediate</span>
                <span className="text-[11px] text-slate-500">Rocky singletrack</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141820] border border-[#232938]">
                <span className="block text-[11px] font-mono text-slate-400 uppercase">Camp Pitch Type</span>
                <span className="font-display font-bold text-emerald-400 text-base">Hammock & Tent</span>
                <span className="text-[11px] text-slate-500">Ridge timber grove</span>
              </div>
            </div>
          </div>

          {/* Interactive Info Panel */}
          <div className="lg:col-span-5 bg-[#141820] border border-[#232938] rounded-2xl p-6 sm:p-8 space-y-6">
            
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">
                    Trail Architecture & Terrain
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Mt. Ulanin rises sharply from the quiet rural barangay of Cumba in eastern Batangas City. Offering an authentic sea-to-summit challenge, the trail transitions from shaded fruit orchards and bamboo groves into an exposed grassy ridge with commanding 360-degree viewpoints.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">Dual Access: Hiking & Mountain Biking</h4>
                      <p className="text-xs text-slate-400">Maintained path allowing both trail runners/hikers and aggressive mountain bikers to share the ascent safely.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">Campsite Ridge at 680–710 MASL</h4>
                      <p className="text-xs text-slate-400">Firm grassy clearings ideal for 2-3 person dome tents, flanked by sturdy endemic trees for hammock hanging.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">Water Source & Signal Coverage</h4>
                      <p className="text-xs text-slate-400">Seasonal water spring at Camp 1 (2.0 km mark). Good 4G mobile signal along the eastern ridge shoulder.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'views' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">
                    The 3-Horizon Panorama
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Few mountains in Southern Tagalog offer this unique combination of coastal ocean expanse, surrounding volcanic peaks, and nocturnal city lights.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#1a202c] border border-white/5">
                    <span className="text-xs font-bold text-emerald-400 uppercase font-mono">01. The Sea Horizon</span>
                    <p className="text-xs text-slate-300 mt-1">Shimmering waters of Batangas Bay and the Verde Island Passage (the world center of marine shore fish biodiversity).</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1a202c] border border-white/5">
                    <span className="text-xs font-bold text-orange-400 uppercase font-mono">02. The Mountain Horizon</span>
                    <p className="text-xs text-slate-300 mt-1">Unobstructed vistas of Mt. Banahaw, Mt. Cristobal, Mt. Maculot, and the rugged Lobo mountain chain.</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1a202c] border border-white/5">
                    <span className="text-xs font-bold text-slate-200 uppercase font-mono">03. The City Nightscape</span>
                    <p className="text-xs text-slate-300 mt-1">A glowing sea of gold as evening lights illuminate the Batangas Port terminal, shipping lanes, and city proper.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'habitat' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">
                    Preserving the Right Habitat
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    WOLF Outdoor partners with the local community of Brgy. Cumba and Batangas Backpackers Inc to uphold strict Leave No Trace (LNT) mountain ethics.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-[#1a202c] border border-white/5 flex items-center justify-between">
                    <span>Clean Trail Mandate</span>
                    <span className="font-mono text-emerald-400">Pack It In, Pack It Out</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a202c] border border-white/5 flex items-center justify-between">
                    <span>Tree-Friendly Hammocking</span>
                    <span className="font-mono text-emerald-400">Wide Webbing Only</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a202c] border border-white/5 flex items-center justify-between">
                    <span>Campfire Policy</span>
                    <span className="font-mono text-orange-400">Strict Fire Pit Zones Only</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#232938]">
              <a
                href="#camp-fest"
                className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors uppercase tracking-wider"
              >
                <span>Experience Mt. Ulanin at Camp Fest 2026</span>
                <span>→</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
