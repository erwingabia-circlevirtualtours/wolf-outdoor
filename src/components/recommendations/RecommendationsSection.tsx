import React, { useState, useEffect } from 'react';
import { ThumbsUp, Star, ExternalLink, Plus, MessageSquare, CheckCircle, ShieldCheck, MapPin, X } from 'lucide-react';
import { OFFICIAL_RECOMMENDATIONS, CustomerRecommendation } from '../../data/recommendationsData';
import confetti from 'canvas-confetti';

export const RecommendationsSection: React.FC = () => {
  const [recommendations, setRecommendations] = useState<CustomerRecommendation[]>(() => {
    try {
      const stored = localStorage.getItem('wolf_outdoor_recommendations');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return OFFICIAL_RECOMMENDATIONS;
  });

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [authorName, setAuthorName] = useState('');
  const [gearTagged, setGearTagged] = useState('WOLF Technical Trail Apparel');
  const [trailLocation, setTrailLocation] = useState('Batangas City');
  const [reviewContent, setReviewContent] = useState('');
  const [recommendOption, setRecommendOption] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('wolf_outdoor_recommendations', JSON.stringify(recommendations));
    } catch (e) {
      console.error(e);
    }
  }, [recommendations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewContent.trim()) return;

    const newRec: CustomerRecommendation = {
      id: `rec-${Date.now()}`,
      author: authorName.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verifiedSource: 'Verified Buyer',
      gearTagged,
      recommended: recommendOption,
      content: reviewContent.trim(),
      trailLocation: trailLocation.trim() || 'Batangas City',
      rating: 5
    };

    setRecommendations(prev => [newRec, ...prev]);
    setIsModalOpen(false);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#047857', '#ea580c', '#f97316', '#ffffff']
      });
    } catch {
      // ignore
    }

    // Reset
    setAuthorName('');
    setReviewContent('');
  };

  const filteredList = recommendations.filter(rec => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Facebook') return rec.verifiedSource === 'Facebook Page';
    if (activeFilter === 'Camp Fest / Trail') return rec.verifiedSource === 'Mt. Ulanin Joiner';
    return true;
  });

  return (
    <section id="recommendations" className="py-20 bg-[#0e1015] border-t border-[#1d222e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
              <span>Community Trust & Field Feedback</span>
              <span className="text-slate-600">/</span>
              <span>Facebook & Trail Reviews</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Community Recommendations
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Authentic reviews from local hikers, mountain bikers, and campers testing WOLF Outdoor gear on the steep ridges of Batangas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.facebook.com/wolfoutdoorbatangascity/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-lg bg-[#141820] hover:bg-[#1c222e] text-slate-200 hover:text-white border border-[#273040] hover:border-emerald-500 transition-colors text-xs font-semibold flex items-center gap-2 group"
            >
              <span>Review on Facebook</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors active:scale-95 shadow-lg shadow-orange-950/50"
            >
              <Plus className="w-4 h-4" />
              <span>Leave Recommendation</span>
            </button>
          </div>
        </div>

        {/* Featured Review Spotlight (Kirk Villegas Dimatatac) */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#141820] border-2 border-emerald-800/80 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232938]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/80 bg-slate-800 shrink-0">
                <img
                  src="/public/assets/aistudio/image_f2e71c73.png"
                  alt="Kirk Villegas Dimatatac recommendation"
                  className="w-full h-full object-cover object-left"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-display font-bold text-base text-white">
                    Kirk Villegas Dimatatac
                  </h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-700 text-emerald-300 font-mono text-[10px] font-semibold">
                    <ThumbsUp className="w-3 h-3 text-emerald-400" />
                    <span>Recommends WOLF Outdoor</span>
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  May 21, 2025 · Verified Facebook Review
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-amber-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>

          <div className="pt-5 space-y-3">
            <blockquote className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed font-sans">
              "good quality outdoor apparel<br />highly recommended.."
            </blockquote>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="text-slate-400">Tagged:</span>
              <span className="font-semibold">WOLF Technical Trail Apparel</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Batangas City, PH</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {(['All', 'Facebook', 'Camp Fest / Trail'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141820]'
              }`}
            >
              {filter === 'All' ? 'All Reviews' : filter}
            </button>
          ))}
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredList.map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-xl bg-[#141820] border border-[#232938] hover:border-emerald-600/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {rec.author}
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-400 block mt-0.5">
                      ✓ Recommends WOLF Outdoor
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    {rec.date}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic mb-4 whitespace-pre-line">
                  "{rec.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#1e2430] flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono truncate max-w-[150px] text-slate-300">
                  {rec.gearTagged}
                </span>
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[110px]">{rec.trailLocation}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write Recommendation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
          <div 
            className="relative w-full max-w-lg bg-[#141820] border border-[#2b3344] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-[#232938] bg-[#11141b] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Recommend WOLF Outdoor
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1f2633]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Full Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kirk Dimatatac"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gear or Apparel Tested
                </label>
                <select
                  value={gearTagged}
                  onChange={(e) => setGearTagged(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="WOLF Technical Trail Apparel">WOLF Technical Trail Apparel</option>
                  <option value="WOLF Ultralight Ripstop Hammock">WOLF Ultralight Ripstop Hammock</option>
                  <option value="WOLF Summit 2P Expedition Tent">WOLF Summit 2P Expedition Tent</option>
                  <option value="WOLF Cumba Trail Running Cap">WOLF Cumba Trail Running Cap</option>
                  <option value="WOLF 7075 Trekking Poles">WOLF 7075 Trekking Poles</option>
                  <option value="Mt. Ulanin Camp Fest 2026">Mt. Ulanin Camp Fest 2026 Event</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Location or Trail Spot
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brgy. Cumba, Batangas City"
                  value={trailLocation}
                  onChange={(e) => setTrailLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Do you recommend WOLF Outdoor?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRecommendOption(true)}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                      recommendOption
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-[#273040] bg-[#181d27] text-slate-400'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes, Highly Recommend!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecommendOption(false)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                      !recommendOption
                        ? 'border-orange-500 bg-orange-950/40 text-orange-300'
                        : 'border-[#273040] bg-[#181d27] text-slate-400'
                    }`}
                  >
                    Neutral
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Experience & Feedback <span className="text-orange-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. good quality outdoor apparel highly recommended.."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-[#232938] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs uppercase font-bold tracking-wider text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
                >
                  Post Recommendation
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};
