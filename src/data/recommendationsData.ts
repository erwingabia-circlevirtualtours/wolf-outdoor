export interface CustomerRecommendation {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  verifiedSource: 'Facebook Page' | 'Mt. Ulanin Joiner' | 'Verified Buyer';
  gearTagged: string;
  recommended: boolean;
  content: string;
  trailLocation?: string;
  rating?: number;
}

export const OFFICIAL_RECOMMENDATIONS: CustomerRecommendation[] = [
  {
    id: 'rec-kirk-dimatatac',
    author: 'Kirk Villegas Dimatatac',
    avatar: '/images/kirk_dimatatac_review.png',
    date: 'May 21, 2025',
    verifiedSource: 'Facebook Page',
    gearTagged: 'WOLF Technical Trail Apparel',
    recommended: true,
    content: 'good quality outdoor apparel\nhighly recommended..',
    trailLocation: 'Batangas City, PH',
    rating: 5
  },
  {
    id: 'rec-joshua-cumba',
    author: 'Joshua Hernandez',
    date: 'July 14, 2025',
    verifiedSource: 'Mt. Ulanin Joiner',
    gearTagged: 'WOLF Ultralight Ripstop Hammock',
    recommended: true,
    content: 'Pitched this on the ridge of Mt. Ulanin (710 MASL) during heavy sea gusts. The 210T ripstop and 10ft daisy straps held strong without stretching overnight. Best hammock in Batangas.',
    trailLocation: 'Brgy. Cumba Summit Ridge',
    rating: 5
  },
  {
    id: 'rec-althea-rider',
    author: 'Althea Grace Mendoza (Ride Plus)',
    date: 'August 02, 2025',
    verifiedSource: 'Facebook Page',
    gearTagged: 'WOLF Cumba Trail Running Cap',
    recommended: true,
    content: 'Lightweight and super breathable for uphill pedal pushes. You barely feel it on your head. Legit local gear that matches international brand quality.',
    trailLocation: 'Cumba MTB Trailhead',
    rating: 5
  },
  {
    id: 'rec-mark-camper',
    author: 'Mark Angelo Castillo (Kamp 043)',
    date: 'September 19, 2025',
    verifiedSource: 'Facebook Page',
    gearTagged: 'WOLF Summit 2P Expedition Tent',
    recommended: true,
    content: 'Solid weatherproofing! Survived an unexpected coastal thunderstorm atop Mt. Ulanin with zero leaks. Batangas outdoor pride.',
    trailLocation: 'Camp 1 Overlook, Mt. Ulanin',
    rating: 5
  }
];
