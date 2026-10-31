export type ProductCategory = 'all' | 'apparel' | 'hammocks' | 'tents' | 'gear' | 'accessories';

export interface OutdoorProduct {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number; // in PHP ₱
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
  specs: {
    material: string;
    weight?: string;
    dimensions?: string;
    capacity?: string;
    colorway?: string;
    weatherRating?: string;
  };
  image: string;
  sizes?: string[];
  colors?: {
    name: string;
    hex: string;
  }[];
}

export type CampCategory = 'Hiker' | 'Mountain Biker' | 'Camper';

export interface CampRegistration {
  id: string;
  joinerName: string;
  contactNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  category: CampCategory;
  trailExperience: string;
  gearRental: {
    hammock: boolean;
    tent: boolean;
  };
  registrationDate: string;
  registrationFeePhp: number;
  qrCodeId: string;
  paymentMethod: 'GCash' | 'Maya' | 'Cash at Basecamp';
  dietaryNotes?: string;
  status: 'Confirmed' | 'Pending Basecamp Verification';
}

export type PhotoContestCategory = 'Sea View' | 'Summit Vista' | 'City Lights';

export interface PhotoSubmission {
  id: string;
  title: string;
  photographerName: string;
  category: PhotoContestCategory;
  imageUrl: string;
  votes: number;
  userVoted?: boolean;
  caption: string;
  timestamp: string;
  trailSpot: string;
}

export interface EventSponsor {
  name: string;
  role: string;
  description: string;
  tagline: string;
  accentColor: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus = 'pending_payment' | 'verified' | 'preparing' | 'dispatched' | 'completed' | 'cancelled';

export interface StoreOrder {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  cityRegion: string;
  deliveryMethod: 'standard' | 'pickup';
  paymentOption: 'GCash' | 'Maya' | 'Cash on Delivery (COD)';
  paymentReference?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  staffNotes?: string;
}

export interface StoreAnnouncement {
  badge: string;
  headline: string;
  subtext: string;
  highlightText: string;
  contactNumber: string;
  promoCode: string;
  freeShippingThreshold: number;
  isActive: boolean;
}
