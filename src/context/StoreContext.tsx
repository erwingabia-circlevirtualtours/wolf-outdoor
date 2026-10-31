import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OutdoorProduct, StoreOrder, CampRegistration, StoreAnnouncement, OrderStatus } from '../types';
import { OUTDOOR_PRODUCTS } from '../data/products';
import { validateOrderTransition, sanitizeGcashReference, productItemSchema } from '../lib/validations';

interface StoreContextType {
  // Products
  products: OutdoorProduct[];
  addProduct: (product: OutdoorProduct) => void;
  updateProduct: (product: OutdoorProduct) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  resetProductsToDefault: () => void;
  importProducts: (newProducts: OutdoorProduct[]) => boolean;

  // Orders
  orders: StoreOrder[];
  createOrder: (orderData: Omit<StoreOrder, 'id' | 'createdAt' | 'status'> & { id?: string }) => StoreOrder;
  updateOrderStatus: (
    orderId: string, 
    status: OrderStatus, 
    options?: { gcashRef?: string; force?: boolean }
  ) => { success: boolean; error?: string };
  updateOrderNotes: (orderId: string, notes: string) => void;
  deleteOrder: (orderId: string) => void;

  // Camp Registrations
  campRegistrations: CampRegistration[];
  createRegistration: (registration: CampRegistration) => void;
  updateRegistrationStatus: (id: string, status: 'Confirmed' | 'Pending Basecamp Verification') => void;
  deleteRegistration: (id: string) => void;

  // Store Announcement
  announcement: StoreAnnouncement;
  updateAnnouncement: (updates: Partial<StoreAnnouncement>) => void;

  // Admin Access
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isStaffAuthenticated: boolean;
  authenticateStaff: (pin: string) => boolean;
  logoutStaff: () => void;
}

const DEFAULT_ANNOUNCEMENT: StoreAnnouncement = {
  badge: 'Mt. Ulanin Camp Fest 2026',
  headline: 'Nov 14–15, 2026 · 710 MASL · Brgy. Cumba, Batangas City',
  subtext: 'Brings you to the right habitat. Official mountain ridge basecamp gear & rentals.',
  highlightText: 'Free delivery on gear orders ₱2,500+',
  contactNumber: '0956 369 5062',
  promoCode: 'HABITAT10',
  freeShippingThreshold: 2500,
  isActive: true,
};

const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: 'WOLF-PH-84210',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    customerName: 'Marcus Aldrin Reyes',
    phone: '0917 842 1993',
    email: 'marcus.reyes@gmail.com',
    address: 'Block 4 Lot 12, Tierra Verde Subd., Pallocan West',
    cityRegion: 'Batangas City',
    deliveryMethod: 'standard',
    paymentOption: 'GCash',
    paymentReference: '902148201948',
    items: [
      {
        id: 'wolf-ripstop-hammock-emerald',
        productId: 'wolf-ripstop-hammock-emerald',
        name: 'WOLF Ultralight Ripstop Hammock',
        price: 1450,
        image: '/images/wolf_ripstop_hammock_1793274337239.jpg',
        quantity: 2,
        selectedColor: 'Forest Emerald'
      },
      {
        id: 'wolf-quickdry-trail-tee',
        productId: 'wolf-quickdry-trail-tee',
        name: 'WOLF "Right Habitat" Technical Trail Tee',
        price: 680,
        image: '/images/wolf_technical_trail_tee_1793274359670.jpg',
        quantity: 1,
        selectedSize: 'L',
        selectedColor: 'Charcoal Black'
      }
    ],
    subtotal: 3580,
    discount: 358,
    shipping: 0,
    total: 3222,
    status: 'verified',
    staffNotes: 'GCash payment confirmed with mobile wallet. Packed with sticker pack.'
  },
  {
    id: 'WOLF-PH-84195',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    customerName: 'Janice De Castro',
    phone: '0928 554 9120',
    email: 'janice.decastro@yahoo.com',
    address: 'Store Pickup at Brgy. Cumba Basecamp Trailhead',
    cityRegion: 'Batangas City',
    deliveryMethod: 'pickup',
    paymentOption: 'Cash on Delivery (COD)',
    items: [
      {
        id: 'wolf-summit-dome-tent-2p',
        productId: 'wolf-summit-dome-tent-2p',
        name: 'WOLF Summit 2P Expedition Tent',
        price: 4800,
        image: '/images/wolf_summit_2p_dome_tent_1793274381898.jpg',
        quantity: 1,
        selectedColor: 'Signal Orange / Charcoal'
      }
    ],
    subtotal: 4800,
    discount: 0,
    shipping: 0,
    total: 4800,
    status: 'preparing',
    staffNotes: 'Customer will test pitch at basecamp on Friday 3:00 PM.'
  },
  {
    id: 'WOLF-PH-83902',
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
    customerName: 'Engr. Paulo Mendoza',
    phone: '0995 120 4481',
    email: 'pmendoza.eng@gmail.com',
    address: 'Ayala Highway, Brgy. Mataas na Lupa',
    cityRegion: 'Lipa City, Batangas',
    deliveryMethod: 'standard',
    paymentOption: 'GCash',
    paymentReference: '782910384910',
    items: [
      {
        id: 'wolf-expedition-drybag-25l',
        productId: 'wolf-expedition-drybag-25l',
        name: 'WOLF 500D PVC Waterproof Dry Bag 25L',
        price: 890,
        image: '/images/wolf_waterproof_drybag_1793274403061.jpg',
        quantity: 2,
        selectedColor: 'Signal Orange'
      }
    ],
    subtotal: 1780,
    discount: 0,
    shipping: 150,
    total: 1930,
    status: 'completed',
    staffNotes: 'Delivered via J&T Express tracking #JT6391024. Customer acknowledged receipt.'
  }
];

const INITIAL_REGISTRATIONS: CampRegistration[] = [
  {
    id: 'WOLF-CF26-7101',
    joinerName: 'Danilo ‘Bong’ Hernandez',
    contactNumber: '0919 722 8419',
    emergencyContactName: 'Maria Hernandez (Spouse)',
    emergencyContactPhone: '0919 722 8420',
    category: 'Hiker',
    trailExperience: 'Advanced (Done Mt. Maculot, Mt. Gulugod Baboy & Mt. Banahaw)',
    gearRental: {
      hammock: true,
      tent: false
    },
    registrationDate: 'Oct 24, 2026',
    registrationFeePhp: 1100,
    qrCodeId: 'WOLF-ULANIN-710M-DH01',
    paymentMethod: 'GCash',
    dietaryNotes: 'No pork, trail vegan meals preferred',
    status: 'Confirmed'
  },
  {
    id: 'WOLF-CF26-7102',
    joinerName: 'Celine Santos',
    contactNumber: '0920 441 9302',
    emergencyContactName: 'Roberto Santos (Father)',
    emergencyContactPhone: '0917 555 8311',
    category: 'Mountain Biker',
    trailExperience: 'Intermediate (Cross-country singletracks in Lobo & Cumba)',
    gearRental: {
      hammock: false,
      tent: true
    },
    registrationDate: 'Oct 26, 2026',
    registrationFeePhp: 1450,
    qrCodeId: 'WOLF-ULANIN-710M-CS02',
    paymentMethod: 'GCash',
    dietaryNotes: '',
    status: 'Confirmed'
  },
  {
    id: 'WOLF-CF26-7103',
    joinerName: 'Ramon ‘Mon’ Villanueva',
    contactNumber: '0956 812 7701',
    emergencyContactName: 'Grace Villanueva (Sister)',
    emergencyContactPhone: '0956 812 7702',
    category: 'Camper',
    trailExperience: 'Beginner (First mountain ridge overnight camp)',
    gearRental: {
      hammock: true,
      tent: true
    },
    registrationDate: 'Oct 29, 2026',
    registrationFeePhp: 1550,
    qrCodeId: 'WOLF-ULANIN-710M-RV03',
    paymentMethod: 'Cash at Basecamp',
    dietaryNotes: 'Nut allergy',
    status: 'Pending Basecamp Verification'
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load products from localStorage or fallback to default
  const [products, setProducts] = useState<OutdoorProduct[]>(() => {
    try {
      const saved = localStorage.getItem('wolf_outdoor_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading products from storage:', e);
    }
    return OUTDOOR_PRODUCTS;
  });

  // Load orders
  const [orders, setOrders] = useState<StoreOrder[]>(() => {
    try {
      const saved = localStorage.getItem('wolf_outdoor_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading orders from storage:', e);
    }
    return INITIAL_ORDERS;
  });

  // Load camp registrations
  const [campRegistrations, setCampRegistrations] = useState<CampRegistration[]>(() => {
    try {
      const saved = localStorage.getItem('wolf_outdoor_registrations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading registrations from storage:', e);
    }
    return INITIAL_REGISTRATIONS;
  });

  // Load announcement
  const [announcement, setAnnouncement] = useState<StoreAnnouncement>(() => {
    try {
      const saved = localStorage.getItem('wolf_outdoor_announcement');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return { ...DEFAULT_ANNOUNCEMENT, ...parsed };
      }
    } catch (e) {
      console.error('Error loading announcement:', e);
    }
    return DEFAULT_ANNOUNCEMENT;
  });

  // Admin UI State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('wolf_staff_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wolf_outdoor_products', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('wolf_outdoor_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('wolf_outdoor_registrations', JSON.stringify(campRegistrations));
    } catch (e) {
      console.error('Error saving registrations:', e);
    }
  }, [campRegistrations]);

  useEffect(() => {
    try {
      localStorage.setItem('wolf_outdoor_announcement', JSON.stringify(announcement));
    } catch (e) {
      console.error('Error saving announcement:', e);
    }
  }, [announcement]);

  // Staff Authentication PIN: Default 'wolf2026' or 'wolf'
  const authenticateStaff = (pin: string): boolean => {
    const cleanPin = pin.trim().toLowerCase();
    if (cleanPin === 'wolf2026' || cleanPin === 'wolf' || cleanPin === '710') {
      setIsStaffAuthenticated(true);
      try {
        sessionStorage.setItem('wolf_staff_auth', 'true');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const logoutStaff = () => {
    setIsStaffAuthenticated(false);
    try {
      sessionStorage.removeItem('wolf_staff_auth');
    } catch (e) {
      console.error(e);
    }
  };

  // Product Operations
  const addProduct = (product: OutdoorProduct) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (updated: OutdoorProduct) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleStock = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextInStock = !p.inStock;
        return {
          ...p,
          inStock: nextInStock,
          stockCount: nextInStock ? Math.max(1, p.stockCount || 5) : 0
        };
      }
      return p;
    }));
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const currentCount = p.stockCount || 0;
        const nextCount = Math.max(0, currentCount + delta);
        return {
          ...p,
          stockCount: nextCount,
          inStock: nextCount > 0
        };
      }
      return p;
    }));
  };

  const resetProductsToDefault = () => {
    setProducts(OUTDOOR_PRODUCTS);
  };

  const importProducts = (newProducts: OutdoorProduct[]): boolean => {
    if (!Array.isArray(newProducts) || newProducts.length === 0) return false;
    const validatedList: OutdoorProduct[] = [];
    for (const raw of newProducts) {
      const parsed = productItemSchema.safeParse(raw);
      if (!parsed.success) {
        console.warn('Imported product failed schema validation:', parsed.error);
        return false;
      }
      validatedList.push(parsed.data as OutdoorProduct);
    }
    setProducts(validatedList);
    return true;
  };

  // Order Operations
  const createOrder = (orderData: Omit<StoreOrder, 'id' | 'createdAt' | 'status'> & { id?: string }): StoreOrder => {
    const newOrder: StoreOrder = {
      ...orderData,
      id: orderData.id || `WOLF-PH-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending_payment',
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    status: OrderStatus, 
    options?: { gcashRef?: string; force?: boolean }
  ): { success: boolean; error?: string } => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      return { success: false, error: 'Order not found in Basecamp database.' };
    }

    if (!options?.force) {
      const transitionResult = validateOrderTransition(targetOrder, status, options?.gcashRef);
      if (!transitionResult.allowed) {
        return { 
          success: false, 
          error: transitionResult.reason || 'Invalid order status transition.' 
        };
      }
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: StoreOrder = { ...o, status };
        if (options?.gcashRef) {
          updated.paymentReference = sanitizeGcashReference(options.gcashRef);
        }
        return updated;
      }
      return o;
    }));

    return { success: true };
  };

  const updateOrderNotes = (orderId: string, notes: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, staffNotes: notes } : o));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Camp Registration Operations
  const createRegistration = (registration: CampRegistration) => {
    setCampRegistrations(prev => [registration, ...prev]);
  };

  const updateRegistrationStatus = (id: string, status: 'Confirmed' | 'Pending Basecamp Verification') => {
    setCampRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteRegistration = (id: string) => {
    setCampRegistrations(prev => prev.filter(r => r.id !== id));
  };

  // Announcement Operations
  const updateAnnouncement = (updates: Partial<StoreAnnouncement>) => {
    setAnnouncement(prev => ({ ...prev, ...updates }));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        adjustStock,
        resetProductsToDefault,
        importProducts,

        orders,
        createOrder,
        updateOrderStatus,
        updateOrderNotes,
        deleteOrder,

        campRegistrations,
        createRegistration,
        updateRegistrationStatus,
        deleteRegistration,

        announcement,
        updateAnnouncement,

        isAdminOpen,
        setIsAdminOpen,
        isStaffAuthenticated,
        authenticateStaff,
        logoutStaff,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
