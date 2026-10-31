import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Camera, Tent, Mountain, Compass, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

interface NavbarProps {
  onOpenCampFestRegistration: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCampFestRegistration,
  onNavigateSection,
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { setIsAdminOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A opens Admin Portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminOpen]);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0e1015]/95 backdrop-blur-md border-b border-[#222733] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Single element Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('hero');
              }}
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            >
              <img
                src="/wolf_outdoor_logo.jpg"
                alt="WOLF Outdoor Batangas City"
                width={40}
                height={40}
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain rounded-md border border-emerald-900/60 bg-emerald-950/40 p-0.5 group-hover:border-emerald-500 transition-colors"
              />
              <div className="flex flex-col">
                <span className="font-display font-black text-lg tracking-wider text-slate-100 group-hover:text-emerald-400 transition-colors uppercase whitespace-nowrap">
                  WOLF OUTDOOR
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-0.5 whitespace-nowrap">
                  BATANGAS CITY · 710 MASL
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('trail-info')}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap py-1 focus:outline-none"
            >
              Mt. Ulanin 710 MASL
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap py-1 focus:outline-none"
            >
              Apparel & Gear
            </button>
            <button
              onClick={() => handleNavClick('camp-fest')}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap py-1 focus:outline-none flex items-center gap-1.5"
            >
              <Tent className="w-4 h-4 text-emerald-400" />
              <span>Camp Fest 2026</span>
            </button>
            <button
              onClick={() => handleNavClick('photo-contest')}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap py-1 focus:outline-none flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-orange-400" />
              <span>Photo Contest</span>
            </button>
            <button
              onClick={() => handleNavClick('recommendations')}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap py-1 focus:outline-none"
            >
              Reviews
            </button>
            <button
              onClick={() => handleNavClick('sponsors')}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap py-1 focus:outline-none"
            >
              Sponsors
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Cart trigger + Staff CMS */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Staff CMS Portal Trigger */}
            <button
              onClick={() => setIsAdminOpen(true)}
              title="WOLF Basecamp Staff Portal (PIN: wolf2026)"
              className="p-2.5 rounded-lg text-slate-400 hover:text-emerald-400 bg-[#161a22] hover:bg-[#1f2532] border border-[#2b3344] hover:border-emerald-500/50 transition-colors focus:outline-none"
              aria-label="Staff Admin CMS Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>

            {/* Gear Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping bag"
              className="relative p-2.5 rounded-lg text-slate-300 hover:text-white bg-[#161a22] hover:bg-[#1f2532] border border-[#2b3344] transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-white font-mono font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-[#0e1015] animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Primary CTA Button (Signal Orange) */}
            <button
              onClick={onOpenCampFestRegistration}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-xs uppercase font-bold tracking-wider text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-all shadow-lg shadow-orange-950/40 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-95"
            >
              Join Camp Fest
            </button>

            {/* Mobile hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white bg-[#161a22] border border-[#2b3344] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#12151c] border-b border-[#262c3b] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => handleNavClick('trail-info')}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-[#1a202c] rounded-md text-left"
            >
              <Mountain className="w-4 h-4 text-emerald-400" />
              <span>Mt. Ulanin 710 MASL Guide</span>
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-[#1a202c] rounded-md text-left"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Outdoor Apparel & Gear Catalog</span>
            </button>
            <button
              onClick={() => handleNavClick('camp-fest')}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-[#1a202c] rounded-md text-left"
            >
              <Tent className="w-4 h-4 text-emerald-400" />
              <span>Mt. Ulanin Camp Fest 2026</span>
            </button>
            <button
              onClick={() => handleNavClick('photo-contest')}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-[#1a202c] rounded-md text-left"
            >
              <Camera className="w-4 h-4 text-orange-400" />
              <span>Sea / Summit / City Photo Contest</span>
            </button>
            <button
              onClick={() => handleNavClick('recommendations')}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-[#1a202c] rounded-md text-left"
            >
              <span>Community Reviews & Proof</span>
            </button>
            <button
              onClick={() => handleNavClick('sponsors')}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-[#1a202c] rounded-md text-left"
            >
              <span>Event Sponsors</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-mono text-emerald-400 hover:bg-[#1a202c] rounded-md text-left border border-emerald-900/50 mt-1"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Staff Admin Portal (PIN: wolf2026)</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCampFestRegistration();
              }}
              className="w-full py-3 text-center text-xs uppercase font-bold tracking-wider text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
            >
              Register for Mt. Ulanin Camp Fest
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
