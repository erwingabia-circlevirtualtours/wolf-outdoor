import React, { useState, useEffect } from 'react';
import { Camera, Heart, Upload, Trophy, MapPin, CheckCircle2, X, Sparkles, Filter } from 'lucide-react';
import { PhotoSubmission, PhotoContestCategory } from '../../types';
import { INITIAL_PHOTO_SUBMISSIONS } from '../../data/contestData';
import confetti from 'canvas-confetti';

export const PhotoContestModule: React.FC = () => {
  const [submissions, setSubmissions] = useState<PhotoSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('wolf_photo_contest_entries');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PHOTO_SUBMISSIONS;
  });

  const [votedIds, setVotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wolf_photo_contest_votes');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [activeCategory, setActiveCategory] = useState<'All' | PhotoContestCategory>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form states for new submission
  const [title, setTitle] = useState('');
  const [photographerName, setPhotographerName] = useState('');
  const [category, setCategory] = useState<PhotoContestCategory>('Summit Vista');
  const [trailSpot, setTrailSpot] = useState('Mt. Ulanin Summit (710 MASL)');
  const [caption, setCaption] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string>(
    '/images/mt_ulanin_summit_hero.jpg'
  );

  useEffect(() => {
    try {
      localStorage.setItem('wolf_photo_contest_entries', JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem('wolf_photo_contest_votes', JSON.stringify(votedIds));
    } catch (e) {
      console.error(e);
    }
  }, [votedIds]);

  const handleToggleVote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const hasVoted = votedIds.includes(id);

    if (hasVoted) {
      // Remove vote
      setVotedIds(prev => prev.filter(vId => vId !== id));
      setSubmissions(prev =>
        prev.map(sub => sub.id === id ? { ...sub, votes: Math.max(0, sub.votes - 1) } : sub)
      );
    } else {
      // Add vote
      setVotedIds(prev => [...prev, id]);
      setSubmissions(prev =>
        prev.map(sub => sub.id === id ? { ...sub, votes: sub.votes + 1 } : sub)
      );

      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#ea580c', '#10b981', '#ffffff']
        });
      } catch {
        // ignore
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !photographerName.trim() || !caption.trim()) return;

    const newEntry: PhotoSubmission = {
      id: `photo-${Date.now()}`,
      title: title.trim(),
      photographerName: photographerName.trim(),
      category,
      imageUrl: selectedImagePreview,
      votes: 1, // Start with submitter's own vote
      caption: caption.trim(),
      timestamp: 'Just now',
      trailSpot: trailSpot.trim() || 'Brgy. Cumba, Batangas City'
    };

    setSubmissions(prev => [newEntry, ...prev]);
    setVotedIds(prev => [...prev, newEntry.id]);
    setIsUploadModalOpen(false);

    // Reset fields
    setTitle('');
    setPhotographerName('');
    setCaption('');
  };

  // Filtered by Category
  const filteredSubmissions = submissions.filter(sub => {
    if (activeCategory === 'All') return true;
    return sub.category === activeCategory;
  });

  // Top 3 Podium Leaders
  const leaderboard = [...submissions].sort((a, b) => b.votes - a.votes).slice(0, 3);

  return (
    <section id="photo-contest" className="py-20 bg-[#0c0e12] border-t border-[#1d222e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-2 uppercase tracking-wider">
              <span>Camp Fest 2026 Creative Module</span>
              <span className="text-slate-600">/</span>
              <span>Community Showcase</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              "Sea / Summit / City" Photo Contest
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Capturing the raw spirit of Mt. Ulanin: the turquoise sea views over Verde Island Passage, the rugged 710 MASL summit ridge, and the twinkling city nightscapes of Batangas.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="self-start md:self-auto px-6 py-3 text-xs uppercase font-bold tracking-wider text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Submit Your Shot</span>
          </button>
        </div>

        {/* Top 3 Podium Leaderboard Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-[#141820] border border-[#273040]">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-slate-400 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Current Community Leaderboard (Top 3)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {leaderboard.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0e1015] border border-[#232938]"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  idx === 0 ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40' :
                  idx === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40' :
                  'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                }`}>
                  #{idx + 1}
                </div>

                <div className="overflow-hidden flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <span className="text-[11px] text-slate-400 truncate block">By {item.photographerName}</span>
                </div>

                <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums shrink-0">
                  {item.votes} votes
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter Controls */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {(['All', 'Sea View', 'Summit Vista', 'City Lights'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141820]'
              }`}
            >
              {cat === 'All' ? 'All Submissions' : cat}
            </button>
          ))}
        </div>

        {/* Custom Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => {
            const hasVoted = votedIds.includes(submission.id);

            return (
              <div
                key={submission.id}
                className="group rounded-2xl bg-[#141820] border border-[#273040] hover:border-emerald-700/60 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
              >
                {/* Photo Container */}
                <div className="relative aspect-[4/3] bg-[#0c0e12] overflow-hidden">
                  <picture>
                    <source srcSet={submission.imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')} type="image/webp" />
                    <img
                      src={submission.imageUrl}
                      alt={submission.title}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={450}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </picture>

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#0e1015]/90 border border-white/10 text-white font-mono text-[10px] font-bold uppercase rounded">
                    {submission.category}
                  </span>

                  {/* Upvote Floating Button */}
                  <button
                    onClick={(e) => handleToggleVote(submission.id, e)}
                    className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-mono font-bold transition-all ${
                      hasVoted
                        ? 'bg-orange-600 text-white scale-105 shadow-lg shadow-orange-950/60'
                        : 'bg-[#0e1015]/85 text-slate-300 hover:text-white hover:bg-orange-600/80 backdrop-blur-md'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white' : ''}`} />
                    <span className="tabular-nums">{submission.votes}</span>
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                      {submission.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      "{submission.caption}"
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#1e2430] flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-medium text-slate-300 truncate max-w-[140px]">
                      {submission.photographerName}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-emerald-400">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[130px]">{submission.trailSpot}</span>
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Upload Submission Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-xl bg-[#141820] border border-[#2b3344] rounded-2xl overflow-hidden shadow-2xl text-slate-100 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-[#232938] flex items-center justify-between bg-[#11141b]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Submit Sea / Summit / City Shot
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1f2633]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Photo Title <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunrise over Verde Island Passage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Joiner / Photographer Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={photographerName}
                    onChange={(e) => setPhotographerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contest Category <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Sea View">Sea View (Batangas Bay / Verde Passage)</option>
                    <option value="Summit Vista">Summit Vista (710 MASL Ridge & Peaks)</option>
                    <option value="City Lights">City Lights (Nightscape & Camp Twilight)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specific Trail Spot
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mt. Ulanin Highest Rock, Brgy. Cumba"
                  value={trailSpot}
                  onChange={(e) => setTrailSpot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Caption / Moment Behind The Shot <span className="text-orange-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell the community about this trail moment..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Photo Source Selector: Custom file or sample choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Photo File or Trail Sample
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-800 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  />
                </div>

                {/* Quick Presets */}
                <div className="text-[11px] text-slate-400 mb-1">Or choose an authentic Mt. Ulanin capture:</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Summit 710M', src: '/images/mt_ulanin_summit_hero.jpg' },
                    { label: 'Verde Sea', src: '/images/contest_sea_view.jpg' },
                    { label: 'City Twilight', src: '/images/contest_city_lights.jpg' },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.src}
                      onClick={() => setSelectedImagePreview(preset.src)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImagePreview === preset.src ? 'border-orange-500 scale-95' : 'border-transparent'
                      }`}
                    >
                      <img src={preset.src} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 right-1 bg-black/70 text-[9px] text-white text-center py-0.5 rounded">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-[#232938] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs uppercase font-bold tracking-wider text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
                >
                  Publish to Gallery
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
