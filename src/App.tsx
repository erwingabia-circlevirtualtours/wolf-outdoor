import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { MtUlaninOverview } from './components/trail/MtUlaninOverview';
import { ProductCatalog } from './components/products/ProductCatalog';
import { CampFestCenter } from './components/campfest/CampFestCenter';
import { CampFestRegistrationModal } from './components/campfest/CampFestRegistrationModal';
import { PhotoContestModule } from './components/contest/PhotoContestModule';
import { RecommendationsSection } from './components/recommendations/RecommendationsSection';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';

export const AppContent: React.FC = () => {
  const [isCampFestModalOpen, setIsCampFestModalOpen] = useState(false);

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Announcement Bar */}
      <AnnouncementBar
        onRegisterClick={() => setIsCampFestModalOpen(true)}
      />

      {/* Sticky Main Navigation */}
      <Navbar
        onOpenCampFestRegistration={() => setIsCampFestModalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* 1. Hero Section: Mt. Ulanin 710 MASL & "Brings you to the right habitat" */}
        <HeroSection
          onExploreGear={() => handleNavigateSection('catalog')}
          onJoinCampFest={() => setIsCampFestModalOpen(true)}
          onViewTrailInfo={() => handleNavigateSection('trail-info')}
        />

        {/* Trail Profile & Sea-to-Summit Breakdown in Brgy. Cumba */}
        <MtUlaninOverview />

        {/* 2. Product Catalog: Apparel Lines & Gear (WOLF Hammocks, Tents) in PHP */}
        <ProductCatalog />

        {/* 3. Camp Fest Event Center: Mt. Ulanin Camp Fest 2026 & Sponsors */}
        <CampFestCenter
          isRegistrationModalOpen={isCampFestModalOpen}
          onOpenRegistration={() => setIsCampFestModalOpen(true)}
          onCloseRegistration={() => setIsCampFestModalOpen(false)}
        />

        {/* 4. Photo Contest Module: Sea / Summit / City Shot Gallery & Upvoting */}
        <PhotoContestModule />

        {/* 5. Community Recommendations: Facebook & Trail Field Reviews */}
        <RecommendationsSection />

      </main>

      {/* Footer with Official Facebook Link & Habitat Coordinates */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenCampFestRegistration={() => setIsCampFestModalOpen(true)}
      />

      {/* Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <CampFestRegistrationModal
        isOpen={isCampFestModalOpen}
        onClose={() => setIsCampFestModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
