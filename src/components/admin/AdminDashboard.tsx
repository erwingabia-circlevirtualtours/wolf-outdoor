import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, LogOut, X, Package, ShoppingCart, 
  Users, Megaphone, ArrowLeft, KeyRound, Sparkles, AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminCampFestTab } from './AdminCampFestTab';
import { AdminAnnouncementTab } from './AdminAnnouncementTab';

type AdminTab = 'products' | 'orders' | 'campfest' | 'announcements';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    isStaffAuthenticated, 
    authenticateStaff, 
    logoutStaff,
    products,
    orders,
    campRegistrations
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isAdminOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = authenticateStaff(pinInput);
    if (success) {
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const pendingOrdersCount = orders.filter(o => o.status === 'pending_payment').length;
  const outOfStockCount = products.filter(p => !p.inStock || (p.stockCount ?? 0) === 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in text-slate-100 overflow-y-auto">
      
      {/* If Not Authenticated: PIN Verification Gate */}
      {!isStaffAuthenticated ? (
        <div 
          className="relative w-full max-w-md bg-[#12151c] border border-[#2b3344] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
              WOLF Basecamp Staff Portal
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Brgy. Cumba, Batangas City · Staff Credentials Required
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 text-left mb-1.5">
                Enter Staff Access PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  maxLength={16}
                  value={pinInput}
                  onChange={e => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter PIN (e.g. wolf2026)"
                  className={`w-full bg-[#0a0c10] border ${
                    pinError ? 'border-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                  } rounded-xl px-4 py-3 text-center text-lg text-white font-mono tracking-widest outline-none transition-colors`}
                />
              </div>

              {pinError && (
                <div className="mt-2 text-xs text-red-400 flex items-center justify-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid PIN. Default access code is <strong>wolf2026</strong></span>
                </div>
              )}

              <div className="mt-2.5 p-2 rounded-lg bg-[#181d26] border border-[#252e3d] text-[11px] text-slate-400 font-mono">
                Staff Default PIN: <span className="text-emerald-400 font-bold">wolf2026</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1c222e] hover:bg-[#252e3e] text-slate-300 text-xs font-semibold transition-colors"
              >
                Back to Storefront
              </button>
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unlock Portal</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Authenticated Admin Dashboard Container */
        <div 
          className="relative w-full max-w-7xl bg-[#0e1117] border border-[#262f3f] rounded-2xl shadow-2xl flex flex-col h-[94vh] max-h-[94vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          
          {/* Top Admin Navigation Header */}
          <header className="p-4 sm:p-5 border-b border-[#202735] bg-[#090b0f] flex flex-wrap items-center justify-between gap-4 shrink-0">
            
            {/* Brand / Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wider">
                    WOLF OUTDOOR CMS
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                    Admin Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Batangas City Basecamp · 710 MASL Inventory & Orders
                </p>
              </div>
            </div>

            {/* Quick Metrics & Exit Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={logoutStaff}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181d26] hover:bg-[#252e3d] text-slate-400 hover:text-white border border-[#2b3344] text-xs font-medium transition-colors"
                title="Lock admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Session</span>
              </button>

              <button
                onClick={() => setIsAdminOpen(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </button>
            </div>
          </header>

          {/* Navigation Tabs Bar */}
          <div className="bg-[#12161f] border-b border-[#202735] px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'products'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products & Stock</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#1e2533] text-[10px] text-slate-300 font-mono">
                {products.length}
              </span>
              {outOfStockCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500" title={`${outOfStockCount} out of stock`} />
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'orders'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders & GCash</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#1e2533] text-[10px] text-slate-300 font-mono">
                {orders.length}
              </span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-bold">
                  {pendingOrdersCount} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('campfest')}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'campfest'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Camp Fest Joiners & Rentals</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#1e2533] text-[10px] text-slate-300 font-mono">
                {campRegistrations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'announcements'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Store Announcements</span>
            </button>
          </div>

          {/* Main Tab Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0c10]">
            {activeTab === 'products' && <AdminProductsTab />}
            {activeTab === 'orders' && <AdminOrdersTab />}
            {activeTab === 'campfest' && <AdminCampFestTab />}
            {activeTab === 'announcements' && <AdminAnnouncementTab />}
          </main>

        </div>
      )}

    </div>
  );
};
