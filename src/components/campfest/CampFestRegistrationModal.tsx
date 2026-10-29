import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, Shield, Phone, User, Calendar, MapPin, AlertCircle, Download } from 'lucide-react';
import { CampCategory, CampRegistration } from '../../types';
import { CAMP_FEST_CONFIG } from '../../data/eventData';
import confetti from 'canvas-confetti';

interface CampFestRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess?: (reg: CampRegistration) => void;
}

export const CampFestRegistrationModal: React.FC<CampFestRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistrationSuccess
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [joinerName, setJoinerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [category, setCategory] = useState<CampCategory>('Hiker');
  const [trailExperience, setTrailExperience] = useState('Intermediate (Done 2-5 mountain hikes)');
  const [rentHammock, setRentHammock] = useState(false);
  const [rentTent, setRentTent] = useState(false);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Maya' | 'Cash at Basecamp'>('GCash');
  const [registeredData, setRegisteredData] = useState<CampRegistration | null>(null);

  if (!isOpen) return null;

  const baseFee = CAMP_FEST_CONFIG.registrationFees[category];
  const hammockRentalFee = rentHammock ? CAMP_FEST_CONFIG.gearRentalPrices.hammock : 0;
  const tentRentalFee = rentTent ? CAMP_FEST_CONFIG.gearRentalPrices.tent : 0;
  const totalRegistrationFee = baseFee + hammockRentalFee + tentRentalFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinerName.trim() || !contactNumber.trim() || !emergencyContactName.trim() || !emergencyContactPhone.trim()) {
      return;
    }

    const newRegistration: CampRegistration = {
      id: `WOLF-CF26-${Math.floor(1000 + Math.random() * 9000)}`,
      joinerName: joinerName.trim(),
      contactNumber: contactNumber.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      category,
      trailExperience,
      gearRental: {
        hammock: rentHammock,
        tent: rentTent
      },
      registrationDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      registrationFeePhp: totalRegistrationFee,
      qrCodeId: `WOLF-ULANIN-710M-${Date.now().toString(36).toUpperCase()}`,
      paymentMethod,
      dietaryNotes: dietaryNotes.trim() || undefined,
      status: paymentMethod === 'Cash at Basecamp' ? 'Pending Basecamp Verification' : 'Confirmed'
    };

    try {
      // Save in localStorage so joiners can review their pass
      const stored = localStorage.getItem('wolf_campfest_registrations');
      const list = stored ? JSON.parse(stored) : [];
      list.push(newRegistration);
      localStorage.setItem('wolf_campfest_registrations', JSON.stringify(list));

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#047857', '#ea580c', '#f97316', '#10b981', '#ffffff']
      });
    } catch {
      // fallback
    }

    setRegisteredData(newRegistration);
    setStep('success');
    if (onRegistrationSuccess) {
      onRegistrationSuccess(newRegistration);
    }
  };

  const handleResetAndClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#141820] border border-[#2b3344] rounded-2xl overflow-hidden shadow-2xl text-slate-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#232938] flex items-center justify-between bg-[#11141b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-sm">
              ▲
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Mt. Ulanin Camp Fest 2026 Registration
              </h3>
              <p className="text-xs text-emerald-400 font-mono">
                710 MASL · Brgy. Cumba, Batangas City · Nov 14–15
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1f2633] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Joiner Category <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['Hiker', 'Mountain Biker', 'Camper'] as CampCategory[]).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        category === cat
                          ? 'border-orange-500 bg-orange-950/20 shadow-md ring-1 ring-orange-500'
                          : 'border-[#273040] bg-[#181d27] hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-bold text-sm text-white">{cat}</span>
                        <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                          ₱{CAMP_FEST_CONFIG.registrationFees[cat]}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {cat === 'Hiker' && 'Ridge trek, guide, jersey & summit pass'}
                        {cat === 'Mountain Biker' && 'Uphill rocky singletrack + Ride Plus marshals'}
                        {cat === 'Camper' && 'Overnight ridge pitch, acoustics & fire sessions'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Joiner Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Joiner Full Name <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Juan dela Cruz"
                      value={joinerName}
                      onChange={(e) => setJoinerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Mobile / Contact Number <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="0917 123 4567"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-xl bg-[#11141b] border border-[#222836] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span>Mandatory Emergency Contact (Batangas Backpackers Inc Protocol)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Emergency Contact Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria dela Cruz (Mother)"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Emergency Contact Phone <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0918 987 6543"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Trail Experience & Optional Gear Rental */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Trail & Outdoor Experience Level
                  </label>
                  <select
                    value={trailExperience}
                    onChange={(e) => setTrailExperience(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Beginner (First time mountain hike/ride)">Beginner (First time mountain hike/ride)</option>
                    <option value="Intermediate (Done 2-5 mountain hikes)">Intermediate (Done 2-5 mountain hikes)</option>
                    <option value="Advanced Trailblazer (Multi-day expedition)">Advanced Trailblazer (Multi-day expedition)</option>
                  </select>
                </div>

                {/* Optional Gear Rentals */}
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Optional On-Site Gear Rental (WOLF Equipment)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      rentHammock ? 'border-emerald-500 bg-emerald-950/20' : 'border-[#273040] bg-[#181d27]'
                    }`}>
                      <input
                        type="checkbox"
                        checked={rentHammock}
                        onChange={(e) => setRentHammock(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-0"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-white block">Rent WOLF Ultralight Hammock (+₱250)</span>
                        <span className="text-[11px] text-slate-400">Includes 10ft daisy tree straps & carabiners</span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      rentTent ? 'border-emerald-500 bg-emerald-950/20' : 'border-[#273040] bg-[#181d27]'
                    }`}>
                      <input
                        type="checkbox"
                        checked={rentTent}
                        onChange={(e) => setRentTent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-0"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-white block">Rent WOLF Summit 2P Tent (+₱450)</span>
                        <span className="text-[11px] text-slate-400">Includes rainfly, groundsheet & stakes</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Preferred Settlement Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['GCash', 'Maya', 'Cash at Basecamp'] as const).map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                          paymentMethod === method
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold'
                            : 'border-[#273040] bg-[#181d27] text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary and Submit Button */}
              <div className="pt-4 border-t border-[#232938] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Total Inclusions & Fees:</span>
                  <span className="font-display font-black text-2xl text-emerald-400 tabular-nums">
                    ₱{totalRegistrationFee.toLocaleString()} PHP
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 text-xs uppercase font-bold tracking-wider text-white bg-orange-600 hover:bg-orange-500 active:scale-95 rounded-lg transition-all shadow-lg shadow-orange-950/50"
                >
                  Confirm Registration & Get Pass
                </button>
              </div>

            </form>
          ) : (
            /* Registration Pass Confirmation Screen */
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-display font-black text-2xl text-white">
                  Registration Confirmed!
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Welcome to Mt. Ulanin Camp Fest 2026. Your digital joiner slot is securely confirmed for Brgy. Cumba, Batangas City.
                </p>
              </div>

              {/* Digital Event Pass Card */}
              {registeredData && (
                <div className="max-w-md mx-auto bg-[#0e1015] border-2 border-emerald-800/80 rounded-2xl p-6 text-left relative overflow-hidden shadow-2xl">
                  {/* Decorative Header Banner */}
                  <div className="flex items-center justify-between border-b border-[#232938] pb-3 mb-4">
                    <div>
                      <span className="font-display font-bold text-sm tracking-wide text-white block">
                        MT. ULANIN CAMP FEST 2026
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">
                        Official Joiner Summit Pass
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-600 text-white font-mono text-[10px] font-bold rounded">
                      {registeredData.category}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Joiner:</span>
                      <span className="font-semibold text-white">{registeredData.joinerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact:</span>
                      <span className="font-mono text-slate-200">{registeredData.contactNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Emergency Contact:</span>
                      <span className="text-slate-200">{registeredData.emergencyContactName} ({registeredData.emergencyContactPhone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pass Code / ID:</span>
                      <span className="font-mono text-emerald-400 font-bold">{registeredData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Settlement:</span>
                      <span className="font-mono font-bold text-white">₱{registeredData.registrationFeePhp.toLocaleString()} ({registeredData.paymentMethod})</span>
                    </div>
                  </div>

                  {/* QR Simulated Stamp */}
                  <div className="mt-5 pt-4 border-t border-[#232938] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-10 h-10 text-emerald-400" />
                      <div className="text-[10px] text-slate-400 font-mono">
                        <span>SCAN AT BASECAMP CUMBA</span>
                        <span className="block text-slate-500">710 MASL VERIFICATION</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 px-2 py-1 bg-emerald-950/60 border border-emerald-800 rounded">
                      {registeredData.status}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Done & Back to Site
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
