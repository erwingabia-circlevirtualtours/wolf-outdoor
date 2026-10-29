import React, { useState } from 'react';
import { Calendar, MapPin, Users, Tent, Bike, Compass, Check, ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { CAMP_FEST_CONFIG, CAMP_FEST_SCHEDULE, EVENT_SPONSORS } from '../../data/eventData';
import { CampFestRegistrationModal } from './CampFestRegistrationModal';

interface CampFestCenterProps {
  isRegistrationModalOpen: boolean;
  onOpenRegistration: () => void;
  onCloseRegistration: () => void;
}

export const CampFestCenter: React.FC<CampFestCenterProps> = ({
  isRegistrationModalOpen,
  onOpenRegistration,
  onCloseRegistration,
}) => {
  const [activeDayFilter, setActiveDayFilter] = useState<'All' | 'Day 1' | 'Day 2'>('All');

  const filteredSchedule = CAMP_FEST_SCHEDULE.filter(item => {
    if (activeDayFilter === 'All') return true;
    return item.day.startsWith(activeDayFilter);
  });

  return (
    <section id="camp-fest" className="py-20 bg-[#0e1015] border-t border-[#1d222e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-2 uppercase tracking-wider">
              <span>Annual Outdoor Gathering</span>
              <span className="text-slate-600">/</span>
              <span>Batangas City Habitat</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-none">
              Mt. Ulanin Camp Fest 2026
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
              Hike, Bike & Camp under the stars at 710 MASL. Sea-to-summit trails, mountain bike assaults, campfire acoustics, and community fellowship in Brgy. Cumba.
            </p>
          </div>

          <button
            onClick={onOpenRegistration}
            className="self-start lg:self-auto px-7 py-3.5 text-xs uppercase font-bold tracking-wider text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-all shadow-xl shadow-orange-950/60 flex items-center gap-2 group active:scale-95"
          >
            <span>Register Joiner Slot</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Feature Event Banner & Key Facts Card */}
        <div className="relative rounded-2xl overflow-hidden border border-[#273040] bg-[#141820] mb-14">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
            <img
              src="/src/assets/images/camp_fest_event_banner_1793274335544.jpg"
              alt="Mt. Ulanin Camp Fest 2026 Twilight Summit"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-[#0e1015]/40 to-transparent" />
            
            {/* Overlay Info Card */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-1 bg-orange-600 text-white font-mono text-[10px] font-bold uppercase rounded">
                  November 14 – 15, 2026
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                  Ridge Camp Summit: 710 MASL
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Brgy. Cumba, Batangas City · Overlooking Verde Island Passage & City Lights</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="tel:09563695062"
                  className="px-3 py-1.5 bg-[#0e1015]/90 border border-emerald-500/40 hover:border-emerald-500 rounded-lg text-xs font-mono text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Hotline: 0956 369 5062</span>
                </a>
                <span className="px-3 py-1.5 bg-[#0e1015]/90 border border-white/10 rounded-lg text-xs font-mono text-slate-300">
                  Slots: 150 Joiners Cap
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Category Options Grid */}
        <div className="mb-16">
          <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Joiner Categories & Inclusions</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Hiker Tier */}
            <div className="p-6 rounded-2xl bg-[#141820] border border-[#273040] flex flex-col justify-between hover:border-emerald-600/60 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-lg text-white">Hiker Category</span>
                  <span className="font-display font-black text-2xl text-emerald-400 tabular-nums">₱650</span>
                </div>
                <p className="text-xs text-slate-400 mb-5">
                  For trail runners, trek enthusiasts, and peak baggers tackling the scenic Cumba cogon ridge to 710 MASL.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Official Camp Fest Quick-Dry Event Jersey</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Brgy. Cumba Registration & Environmental Fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Batangas Backpackers Inc Guide & Medic Escort</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Free Coffee&GoodFlow Summit Morning Brew</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenRegistration}
                className="w-full mt-6 py-2.5 px-4 bg-[#1e2432] hover:bg-orange-600 text-white rounded-lg text-xs uppercase font-bold tracking-wider transition-colors"
              >
                Register as Hiker
              </button>
            </div>

            {/* Mountain Biker Tier */}
            <div className="p-6 rounded-2xl bg-[#141820] border-2 border-orange-600/70 relative flex flex-col justify-between shadow-xl shadow-orange-950/20">
              <span className="absolute -top-3 right-6 px-3 py-0.5 bg-orange-600 text-white font-mono text-[10px] font-bold uppercase rounded-full">
                High Adrenaline
              </span>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-lg text-white">Mountain Biker</span>
                  <span className="font-display font-black text-2xl text-orange-400 tabular-nums">₱750</span>
                </div>
                <p className="text-xs text-slate-400 mb-5">
                  Conquer the steep rocky fire roads and technical switchbacks of Brgy. Cumba up to summit base.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>All Hiker Tier Inclusions + Event Jersey</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>Ride Plus Mechanic Support & Trail Marshalling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>Designated Bike Staging & Security Rack</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>Ride Plus Emergency Tube / Puncture Kit Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenRegistration}
                className="w-full mt-6 py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs uppercase font-bold tracking-wider transition-colors"
              >
                Register as Mountain Biker
              </button>
            </div>

            {/* Camper Tier */}
            <div className="p-6 rounded-2xl bg-[#141820] border border-[#273040] flex flex-col justify-between hover:border-emerald-600/60 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-lg text-white">Full Overnight Camper</span>
                  <span className="font-display font-black text-2xl text-emerald-400 tabular-nums">₱850</span>
                </div>
                <p className="text-xs text-slate-400 mb-5">
                  Overnight stay on the 710 MASL ridge. Stargazing, Kamp 043 acoustic jamming, and sea-to-summit sunrise.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Reserved Ridge Campsite Pitch Slot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Kamp 043 Bushcraft Workshop & Campfire Acoustic Jam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Full Sea / Summit / City Photo Contest Entry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Gear Raffle Entry for WOLF Hammocks & Tents</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenRegistration}
                className="w-full mt-6 py-2.5 px-4 bg-[#1e2432] hover:bg-orange-600 text-white rounded-lg text-xs uppercase font-bold tracking-wider transition-colors"
              >
                Register as Camper
              </button>
            </div>

          </div>
        </div>

        {/* Schedule of Activities */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Event Schedule of Activities</span>
            </h3>

            <div className="flex items-center gap-1 p-1 bg-[#141820] border border-[#232938] rounded-lg">
              {(['All', 'Day 1', 'Day 2'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveDayFilter(filter)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeDayFilter === filter
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredSchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-[#141820] border border-[#232938] hover:border-slate-600 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                      {item.day}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs font-mono text-slate-300">
                      {item.time}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[11px] font-mono text-orange-400">
                      {item.categoryTag}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="block text-xs font-medium text-slate-300">
                    {item.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Event Sponsors Grid (Ride Plus, Batangas Backpackers Inc, Kamp 043, Coffee&GoodFlow) */}
        <div id="sponsors" className="pt-8 border-t border-[#1d222e]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Community Co-Presenters
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
              Official Event Sponsors & Partners
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Brought to you by the passionate outdoor, trail, and coffee collective of Batangas City.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVENT_SPONSORS.map((sponsor) => (
              <div
                key={sponsor.name}
                className="p-6 rounded-2xl bg-[#141820] border border-[#232938] hover:border-emerald-600/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-lg mb-4"
                    style={{ backgroundColor: `${sponsor.accentColor}20`, color: sponsor.accentColor }}
                  >
                    {sponsor.name.charAt(0)}
                  </div>
                  <h4 className="font-display font-bold text-lg text-white">
                    {sponsor.name}
                  </h4>
                  <span 
                    className="block text-xs font-mono font-medium mt-0.5 mb-2"
                    style={{ color: sponsor.accentColor }}
                  >
                    {sponsor.role}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sponsor.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e2430] text-[11px] font-mono text-slate-400 italic">
                  "{sponsor.tagline}"
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Registration Modal */}
      <CampFestRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={onCloseRegistration}
      />
    </section>
  );
};
