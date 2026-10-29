import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import confetti from 'canvas-confetti';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'> & { id?: string; quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  subtotal: number;
  discount: number;
  promoCode: string;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  shipping: number;
  freeShippingThreshold: number;
  total: number;
  totalItems: number;
  completeCheckout: (details: any) => Promise<boolean>;
  toastMessage: string | null;
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('wolf_outdoor_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('wolf_outdoor_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3500);
  };

  const hideToast = () => setToastMessage(null);

  const addToCart = (item: Omit<CartItem, 'quantity' | 'id'> & { id?: string; quantity?: number }) => {
    const qty = item.quantity || 1;
    const itemId = item.id || `${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}`;

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(
        i => i.productId === item.productId && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [{ ...item, id: itemId, quantity: qty }, ...prevCart];
      }
    });

    showToast(`Added "${item.name}" to your gear bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 2500; // ₱2,500 PHP free delivery threshold

  // Promo code calculation
  let discount = 0;
  if (appliedPromo === 'HABITAT10' || appliedPromo === 'WOLF10') {
    discount = Math.round(subtotal * 0.10);
  } else if (appliedPromo === 'ULANIN2026') {
    discount = Math.round(subtotal * 0.15);
  } else if (appliedPromo === 'CAMPFEST') {
    discount = Math.min(subtotal, 350);
  }

  const shipping = subtotal >= freeShippingThreshold || appliedPromo === 'FREESHIP' || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'HABITAT10' || clean === 'WOLF10') {
      setAppliedPromo(clean);
      return { success: true, message: '10% Habitat Welcome discount applied!' };
    } else if (clean === 'ULANIN2026') {
      setAppliedPromo(clean);
      return { success: true, message: '15% Mt. Ulanin Camp Fest discount applied!' };
    } else if (clean === 'CAMPFEST') {
      if (subtotal < 1500) {
        return { success: false, message: 'CAMPFEST voucher requires a minimum gear order of ₱1,500.' };
      }
      setAppliedPromo(clean);
      return { success: true, message: '₱350 Camp Fest gear credit applied!' };
    } else if (clean === 'FREESHIP') {
      setAppliedPromo(clean);
      return { success: true, message: 'Free Batangas & CALABARZON Shipping applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try HABITAT10 or ULANIN2026' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const completeCheckout = async (_details: any) => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#047857', '#ea580c', '#f97316', '#10b981', '#ffffff']
      });
    } catch {
      // fallback
    }
    clearCart();
    return true;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        subtotal,
        discount,
        promoCode,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        shipping,
        freeShippingThreshold,
        total,
        totalItems,
        completeCheckout,
        toastMessage,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
