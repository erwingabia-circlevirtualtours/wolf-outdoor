import { EventSponsor } from '../types';

export interface EventScheduleItem {
  day: string;
  time: string;
  title: string;
  location: string;
  description: string;
  categoryTag: 'All Joiners' | 'Hike' | 'Bike' | 'Camp';
}

export const CAMP_FEST_CONFIG = {
  title: 'Mt. Ulanin Camp Fest 2026',
  subtitle: 'Hike, Bike & Camp Under the Stars at 710 MASL',
  location: 'Brgy. Cumba, Batangas City, Philippines',
  coordinates: '13.7565° N, 121.0583° E',
  elevation: '710 MASL (Meters Above Sea Level)',
  trailClass: 'Class 1-2 (Moderate Ridge Climb / Technical Singletrack for MTB)',
  dates: 'November 14 - 15, 2026 (Saturday - Sunday)',
  bannerImage: '/images/camp_fest_event_banner.jpg',
  trailHeroImage: '/images/mt_ulanin_summit_hero.jpg',
  registrationFees: {
    Hiker: 650,
    'Mountain Biker': 750,
    Camper: 850
  },
  inclusions: [
    'Official WOLF Outdoor Camp Fest Event Dri-Fit Jersey',
    'Brgy. Cumba Barangay Registration & Environmental Fees',
    'Certified Local Guide & Trail Marshal Escort',
    'Designated Ridge Campsite Pitch Slot (Hammock / Tent)',
    'Official Joiner Waterproof Bag Tag & Sticker Pack',
    'Entry into the "Sea / Summit / City" Photo Contest',
    'Coffee&GoodFlow Morning Camp Brew voucher',
    'Raffle Entry for WOLF Hammocks & Outdoor Gear',
    'Certificate of Summit Completion (710 MASL)'
  ],
  gearRentalPrices: {
    hammock: 250, // ₱250 for WOLF Ripstop Hammock + Tree Straps rental
    tent: 450     // ₱450 for WOLF Summit 2P Dome Tent rental
  }
};

export const EVENT_SPONSORS: EventSponsor[] = [
  {
    name: 'Ride Plus',
    role: 'Official Cycling & MTB Partner',
    description: 'Premier cycling and adventure gear hub in Batangas, providing free mountain bike trail checkups and technical mechanical support at Basecamp Cumba.',
    tagline: 'Fueling Your Hardest Climbs',
    accentColor: '#f97316'
  },
  {
    name: 'Batangas Backpackers Inc',
    role: 'Trail Marshall & LNT Safety Partner',
    description: 'The pioneering outdoor community of Batangas mountaineers, deploying experienced trail marshals, medical first responders, and Leave No Trace educators.',
    tagline: 'Leave Nothing But Footprints',
    accentColor: '#10b981'
  },
  {
    name: 'Kamp 043',
    role: 'Camp Lifestyle & Bushcraft Partner',
    description: 'Batangas outdoor lifestyle collective hosting outdoor survival workshops, fire-making demonstrations, and evening acoustic jam sessions around the camp lanterns.',
    tagline: 'Where Wild Meets Community',
    accentColor: '#eab308'
  },
  {
    name: 'Coffee&GoodFlow',
    role: 'Official Specialty Camp Barista',
    description: 'Artisanal local pour-over coffee cart serving freshly roasted Batangas Kapeng Barako and specialty arabica blends at sunrise on the Mt. Ulanin ridge.',
    tagline: 'Peak Flavor at High Altitude',
    accentColor: '#b45309'
  }
];

export const CAMP_FEST_SCHEDULE: EventScheduleItem[] = [
  {
    day: 'Day 1 · Saturday',
    time: '01:00 PM - 02:30 PM',
    title: 'Basecamp Assembly & Gear Check-in',
    location: 'Brgy. Cumba Covered Court / Trailhead',
    description: 'Claim your event kit, jersey, trail tags, and undergo mandatory safety briefing with Batangas Backpackers Inc and Ride Plus mechanics.',
    categoryTag: 'All Joiners'
  },
  {
    day: 'Day 1 · Saturday',
    time: '02:45 PM - 05:00 PM',
    title: 'The Assault: Hike & Bike Uphill to 710 MASL',
    location: 'Cumba Ulanin Trail',
    description: 'Hikers take the scenic cogon ridge path while mountain bikers tackle the challenging rocky singletrack switchbacks guided by Ride Plus marshals.',
    categoryTag: 'Hike'
  },
  {
    day: 'Day 1 · Saturday',
    time: '05:15 PM - 06:15 PM',
    title: 'Sunset Camp Pitch & Sea Horizon Chill',
    location: 'Mt. Ulanin Summit Ridge Campsite',
    description: 'Pitch your WOLF Hammocks and tents along the ridge while enjoying panoramic golden hour views over Batangas Bay and Isla Verde.',
    categoryTag: 'Camp'
  },
  {
    day: 'Day 1 · Saturday',
    time: '07:00 PM - 09:30 PM',
    title: 'Campfire Gathering, Kamp 043 Acoustics & Stargazing',
    location: 'Summit Amphitheater',
    description: 'Community camp feast, bushcraft stories by Kamp 043, acoustic music under a blanket of stars overlooking the glittering city lights below.',
    categoryTag: 'All Joiners'
  },
  {
    day: 'Day 2 · Sunday',
    time: '05:15 AM - 06:30 AM',
    title: 'Sea-to-Summit Sunrise Assault & Coffee&GoodFlow Brew',
    location: 'Highest Peak Rock (710 MASL)',
    description: 'Watch the sun rise over Verde Island Passage with a hot steaming cup of freshly brewed Barako coffee from Coffee&GoodFlow.',
    categoryTag: 'All Joiners'
  },
  {
    day: 'Day 2 · Sunday',
    time: '07:30 AM - 09:00 AM',
    title: 'Sea / Summit / City Photo Contest Live Judging & Awards',
    location: 'Camp Center',
    description: 'Submit your best captures to the digital gallery; live voting results and awarding of WOLF Outdoor gear packages to the top winners.',
    categoryTag: 'All Joiners'
  },
  {
    day: 'Day 2 · Sunday',
    time: '09:30 AM - 11:30 AM',
    title: 'Leave No Trace Cleanup Trek & Downhill Ride',
    location: 'Descent Trail to Brgy. Cumba',
    description: 'Ridge campsite sweep ensuring zero trash left behind, followed by an exhilarating descent back to the trailhead.',
    categoryTag: 'All Joiners'
  }
];
