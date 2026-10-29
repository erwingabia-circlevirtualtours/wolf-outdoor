import { PhotoSubmission } from '../types';

export const INITIAL_PHOTO_SUBMISSIONS: PhotoSubmission[] = [
  {
    id: 'photo-summit-01',
    title: 'The Golden Ridge to 710 MASL',
    photographerName: 'Erwin Gabia',
    category: 'Summit Vista',
    imageUrl: '/src/assets/images/mt_ulanin_summit_hero_1793274334661.jpg',
    votes: 248,
    caption: 'Standing tall on the Mt. Ulanin ridge trail overlooking both the lush rolling Batangas mountains and the golden sunrise reflecting across Batangas Bay.',
    timestamp: 'Oct 28, 2026',
    trailSpot: 'Mt. Ulanin Summit Marker, Brgy. Cumba'
  },
  {
    id: 'photo-sea-01',
    title: 'Verde Island Passage from Coastal Ridge',
    photographerName: 'Alyssa Dimaculangan',
    category: 'Sea View',
    imageUrl: '/src/assets/images/contest_sea_view_1793274395258.jpg',
    votes: 195,
    caption: 'Crystal turquoise waters and lush emerald headlands visible along the scenic sea-to-summit corridor. Unmatched coastal hiking scenery.',
    timestamp: 'Oct 27, 2026',
    trailSpot: 'Verde Passage Overlook Trail'
  },
  {
    id: 'photo-city-01',
    title: 'Batangas Port & Cityscape at Blue Hour',
    photographerName: 'Mark Angelo Malabanan',
    category: 'City Lights',
    imageUrl: '/src/assets/images/contest_city_lights_1793274395372.jpg',
    votes: 214,
    caption: 'Night falls over Batangas City as cargo ships anchor in the bay and street lights create a winding river of gold seen from our pitch at Camp 1.',
    timestamp: 'Oct 26, 2026',
    trailSpot: 'Camp 1 Ridge Overlook'
  },
  {
    id: 'photo-campfest-01',
    title: 'Twilight Fellowship by the Lanterns',
    photographerName: 'Carlos Mendoza (Kamp 043)',
    category: 'City Lights',
    imageUrl: '/src/assets/images/camp_fest_event_banner_1793274335544.jpg',
    votes: 178,
    caption: 'Bikers and hikers resting after conquering the uphill climb of Brgy. Cumba, sharing warm coffee and stories under a star-filled evening sky.',
    timestamp: 'Oct 25, 2026',
    trailSpot: 'Summit Campsite, Mt. Ulanin'
  },
  {
    id: 'photo-sea-02',
    title: 'Morning Calm over Batangas Bay',
    photographerName: 'Bianca Ramos',
    category: 'Sea View',
    imageUrl: '/src/assets/images/wolf_ripstop_hammock_1793274337239.jpg',
    votes: 122,
    caption: 'Pitching my WOLF Ultralight Hammock right between high mountain trees with a refreshing sea breeze wafting in from the bay.',
    timestamp: 'Oct 24, 2026',
    trailSpot: 'West Pine Grove, Cumba'
  },
  {
    id: 'photo-summit-02',
    title: 'Gear on the Granite Ridge',
    photographerName: 'Joshua Dimaano (Ride Plus)',
    category: 'Summit Vista',
    imageUrl: '/src/assets/images/wolf_trail_apparel_shirt_1793274337408.jpg',
    votes: 145,
    caption: 'Testing the breathable WOLF trail shirt and navigation compass after a punishing singletrack pedal push uphill to 710 MASL.',
    timestamp: 'Oct 23, 2026',
    trailSpot: 'North Lookout Rock'
  }
];
