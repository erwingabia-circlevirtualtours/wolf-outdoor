import { OutdoorProduct } from '../types';

export const OUTDOOR_PRODUCTS: OutdoorProduct[] = [
  {
    id: 'wolf-ripstop-hammock-emerald',
    name: 'WOLF Ultralight Ripstop Hammock',
    subtitle: 'High-tenacity 210T parachute ripstop with tree-friendly straps',
    category: 'hammocks',
    price: 1450,
    originalPrice: 1750,
    rating: 4.95,
    reviewCount: 84,
    badge: 'Signature Gear',
    inStock: true,
    stockCount: 28,
    description: 'Engineered in Batangas City for tropical mountain ridges and sea breeze campsites. Built with breathable diamond-ripstop nylon, reinforced triple interlocking seams, and 10ft multi-loop daisy chain tree straps for lightning-fast pitching between mountain trees.',
    features: [
      '210T High-Tenacity Diamond Ripstop Nylon (holds up to 250kg / 550 lbs)',
      'Includes two 10ft no-stretch daisy chain tree-hugger straps with 16 loops each',
      'Dual 12kN aircraft grade aluminum wiregate carabiners included',
      'Integrated compression stuff sack with dual buckle cinching',
      'Breathable, mildew-resistant, quick drying in tropical rain'
    ],
    specs: {
      material: '210T Diamond Ripstop Nylon',
      weight: '480g (complete system with straps)',
      dimensions: '300cm x 150cm (Single+ Extended)',
      capacity: '250 kg / 550 lbs',
      colorway: 'Forest Emerald & Charcoal Gray',
      weatherRating: 'Tropical High-Humidity & Rain Proof'
    },
    image: '/src/assets/images/wolf_ripstop_hammock_1793274337239.jpg',
    colors: [
      { name: 'Forest Emerald', hex: '#047857' },
      { name: 'Volcanic Charcoal', hex: '#1c222e' },
      { name: 'Signal Orange Edge', hex: '#ea580c' }
    ]
  },
  {
    id: 'wolf-summit-dome-tent-2p',
    name: 'WOLF Summit 2P Expedition Tent',
    subtitle: 'Ultralight 4-season freestanding dome shelter for mountain ridges',
    category: 'tents',
    price: 4800,
    originalPrice: 5400,
    rating: 4.9,
    reviewCount: 42,
    badge: 'Camp Fest Ready',
    inStock: true,
    stockCount: 12,
    description: 'Designed specifically to withstand coastal winds and mountain storms atop Mt. Ulanin (710 MASL). Features 7001-T6 anodized aluminum cross poles, 3000mm hydrostatic head waterproof flysheet, high-density no-see-um mesh inner for tropical airflow, and high-visibility reflective orange guylines.',
    features: [
      '3000mm PU-coated 210T polyester ripstop rainfly with taped seams',
      'Heavy-duty 5000mm Oxford tub-style bathtub floor prevents ground soak',
      'Dual vestibules for muddy hiking boots, mountain bike helmets, and packs',
      'High-visibility signal orange reflective guylines with aluminum tensioners',
      'Freestanding pitch allows rapid repositioning on rocky terrain'
    ],
    specs: {
      material: '210T PU3000mm Ripstop Polyester + 7001 Aluminum Poles',
      weight: '2.15 kg trail weight',
      dimensions: '215cm (L) x 135cm (W) x 110cm (H)',
      capacity: '2 Persons + Gear',
      colorway: 'Stealth Charcoal with Signal Orange Trim',
      weatherRating: 'Gale Resistance up to 60 km/h winds'
    },
    image: '/src/assets/images/wolf_summit_dome_tent_1793274339629.jpg',
    colors: [
      { name: 'Stealth Charcoal', hex: '#1e232d' },
      { name: 'Alpine Moss', hex: '#064e3b' }
    ]
  },
  {
    id: 'wolf-tech-trail-shirt',
    name: 'WOLF Technical Trail Running & Hike Tee',
    subtitle: 'Odor-resistant micro-honeycomb dri-fit performance shirt',
    category: 'apparel',
    price: 650,
    originalPrice: 750,
    rating: 4.88,
    reviewCount: 116,
    badge: 'Best Seller',
    inStock: true,
    stockCount: 65,
    description: 'Crafted for the steep climbs of Brgy. Cumba and fast descents on the Mt. Ulanin trail. Features ultra-breathable moisture-wicking micro-mesh, raglan sleeves that eliminate pack shoulder chafing, UPF 50+ sun protection, and reflective mountain crest chest branding.',
    features: [
      'Micro-Honeycomb Moisture-Wicking 100% Recycled Poly-blend',
      'UPF 50+ certified solar barrier against harsh mountain sun',
      'Flatlock anti-friction stitching preventing shoulder pack irritation',
      'Reflective WOLF mountain icon on chest and rear trail stripe',
      'Quick-drying within 15 minutes of summit sweat or river crossings'
    ],
    specs: {
      material: '100% AeroDry Recycled Polyester',
      weight: '115g (Size M)',
      colorway: 'Charcoal Heather / Deep Emerald Panels',
      weatherRating: 'Tropical High Heat & Humidity'
    },
    image: '/src/assets/images/wolf_trail_apparel_shirt_1793274337408.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Emerald / Charcoal', hex: '#047857' },
      { name: 'Volcanic Gray', hex: '#181b22' },
      { name: 'Signal Orange Accent', hex: '#ea580c' }
    ]
  },
  {
    id: 'wolf-habitat-heavyweight-tee',
    name: 'WOLF "Right Habitat" Heavyweight Organic Tee',
    subtitle: '240 GSM combed cotton vintage outdoor lifestyle shirt',
    category: 'apparel',
    price: 550,
    rating: 4.92,
    reviewCount: 97,
    inStock: true,
    stockCount: 40,
    description: 'Featuring the signature slogan: "Brings You To The Right Habitat" across the back with our geometric mountain sunrise badge on the chest. Made from heavy 240 GSM pre-shrunk cotton for post-trek campfire chillouts and everyday local pride.',
    features: [
      '240 GSM heavy combed organic cotton with relaxed drop-shoulder cut',
      'Screen printed with eco-friendly water-based discharge inks',
      'Double-needle collar that maintains shape after countless laundry cycles',
      'Embroidered woven hem tag with GPS coordinates: 13.7565° N, 121.0583° E'
    ],
    specs: {
      material: '100% Heavy Combed Ring-Spun Cotton',
      weight: '240 GSM',
      colorway: 'Deep Pine Green & Charcoal Black',
      weatherRating: 'Campsite Twilight & Streetwear'
    },
    image: '/wolf_outdoor_logo.jpg',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Pine Forest Green', hex: '#064e3b' },
      { name: 'Washed Charcoal', hex: '#1c202a' }
    ]
  },
  {
    id: 'wolf-cumba-trail-cap',
    name: 'WOLF Cumba Ultralight Packable Trail Cap',
    subtitle: 'Water-repellent nylon with laser-cut breathability and soft eva brim',
    category: 'accessories',
    price: 480,
    originalPrice: 580,
    rating: 4.86,
    reviewCount: 53,
    badge: 'Popular',
    inStock: true,
    stockCount: 35,
    description: 'A 5-panel unstructured runner cap that stuffs into your pack pocket without losing shape. Laser-perforated side ventilation vents heat during grueling uphill pushes in Brgy. Cumba.',
    features: [
      'Weighs only 44 grams; folds effortlessly into hydration vest pockets',
      'Laser-cut ventilation ports allow continuous airflow',
      'Antimicrobial sweatband keeps perspiration out of eyes',
      'Shock-cord cinch buckle adjustment fits all head sizes securely'
    ],
    specs: {
      material: 'Ripstop Quick-Dry Nylon + EVA Brim',
      weight: '44 grams',
      dimensions: 'One Size Fits All (Adjustable 54-62cm)',
      colorway: 'Signal Orange / Charcoal'
    },
    image: '/src/assets/images/mt_ulanin_summit_hero_1793274334661.jpg',
    colors: [
      { name: 'Signal Orange', hex: '#ea580c' },
      { name: 'Deep Emerald', hex: '#047857' },
      { name: 'Stealth Black', hex: '#12151c' }
    ]
  },
  {
    id: 'wolf-7075-trekking-poles',
    name: 'WOLF Pro-Lock 7075 Trekking Poles (Pair)',
    subtitle: 'Aircraft aluminum with speed-flick locks & extended EVA grip',
    category: 'gear',
    price: 1250,
    originalPrice: 1450,
    rating: 4.93,
    reviewCount: 38,
    inStock: true,
    stockCount: 18,
    description: 'Essential stability for the steep ascents and muddy descents of Mt. Ulanin. Built with aerospace 7075 alloy that bends before snapping, paired with durable tungsten carbide tips.',
    features: [
      'Aerospace grade 7075 aluminum shaft absorbs impact shock',
      'Dual metal quick-cam lever locks for instant length adjustment (65-135cm)',
      'High-density EVA foam handle with choke-down grip for steep ridge pitches',
      'Includes mud baskets, snow baskets, and rubber road walking caps'
    ],
    specs: {
      material: '7075 Aircraft Grade Aluminum + Tungsten Carbide',
      weight: '270g per pole',
      dimensions: 'Collapses to 64cm, extends to 135cm',
      capacity: 'Tested to 90kg vertical load per pole'
    },
    image: '/src/assets/images/contest_sea_view_1793274395258.jpg',
    colors: [
      { name: 'Matte Charcoal & Green', hex: '#047857' }
    ]
  },
  {
    id: 'wolf-20l-dry-bag',
    name: 'WOLF StormShield 20L Roll-Top Dry Bag',
    subtitle: '500D PVC heavy tarpaulin with detachable shoulder sling',
    category: 'accessories',
    price: 520,
    rating: 4.9,
    reviewCount: 62,
    inStock: true,
    stockCount: 44,
    description: 'Keep your extra clothes, sleeping bag, and electronics 100% dry when unexpected coastal squalls roll in across Batangas Bay. Floats safely if dropped in mountain streams or sea crossings.',
    features: [
      'Heavy 500D waterproof PVC tarpaulin with high-frequency welded seams',
      'Roll-down top buckle lock forms an airtight, watertight seal',
      'Removable, adjustable shoulder strap for easy crossbody carrying',
      'Transparent phone pocket window with touch-screen capability'
    ],
    specs: {
      material: '500D Heavy Tarpaulin PVC',
      weight: '340g',
      capacity: '20 Liters',
      weatherRating: 'IPX6 Waterproof (Heavy Rain & Brief Immersion)'
    },
    image: '/src/assets/images/contest_city_lights_1793274395372.jpg',
    colors: [
      { name: 'Signal Orange', hex: '#ea580c' },
      { name: 'Deep Emerald', hex: '#047857' },
      { name: 'Charcoal Gray', hex: '#1c202a' }
    ]
  },
  {
    id: 'wolf-500lm-headlamp',
    name: 'WOLF Lumina 500LM USB-C Trail Headlamp',
    subtitle: 'Dual beam spotlight + flood with night vision red light & tilt base',
    category: 'gear',
    price: 890,
    originalPrice: 1050,
    rating: 4.87,
    reviewCount: 46,
    badge: 'Night Hike Essential',
    inStock: true,
    stockCount: 22,
    description: 'The preferred headlamp for Mt. Ulanin 3:00 AM sea-to-summit sunrise assaults. Emits 500 lumens of neutral white light with a dedicated red LED mode to preserve night vision at the summit campsite.',
    features: [
      '500 Max Lumens with 110-meter beam throw',
      'Red LED beam mode for stargazing and campsite etiquette without blinding others',
      'USB-C fast charge built-in with 1200mAh Li-ion battery (up to 30h runtime)',
      'IPX4 weather-resistant against driving rain and trail mud',
      '60-degree tilt bracket allows aiming beam right at foot placement'
    ],
    specs: {
      material: 'Impact-Resistant Polycarbonate',
      weight: '68g (including headband)',
      weatherRating: 'IPX4 Water Resistant',
      capacity: '1200mAh Rechargeable Battery'
    },
    image: '/src/assets/images/camp_fest_event_banner_1793274335544.jpg',
    colors: [
      { name: 'Charcoal / Emerald Accent', hex: '#047857' }
    ]
  }
];
