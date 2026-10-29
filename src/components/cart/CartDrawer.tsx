import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    shipping,
    freeShippingThreshold,
    total,
    setIsCheckoutOpen,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoStatus(res);
    if (res.success) {
      setPromoInput('');
    }
  };

  const progressToFreeShip = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141820] border-l border-[#273040] shadow-2xl flex flex-col justify-between overflow-hidden text-slate-100">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#232938] bg-[#0e1015] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
                  Your Gear Bag
                </h3>
                <p className="text-xs font-mono text-slate-400">{cart.length} gear items selected</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a202c] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-[#11141b] border-b border-[#232938]">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                {amountNeeded === 0 ? (
                  <span className="text-emerald-400 font-bold">Free Philippine delivery unlocked!</span>
                ) : (
                  <span>Add <b className="text-emerald-400">₱{amountNeeded.toLocaleString()}</b> for Free Shipping</span>
                )}
              </span>
              <span className="text-slate-400 font-bold tabular-nums">{progressToFreeShip}%</span>
            </div>
            
            <div className="w-full h-1.5 bg-[#1e2430] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-orange-500 transition-all duration-500"
                style={{ width: `${progressToFreeShip}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181d27] border border-[#273040] flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Your gear bag is empty.</p>
                  <p className="text-xs text-slate-400 mt-1">Explore WOLF Ripstop Hammocks, technical trail tees, and summit tents.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Browse Gear Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#0e1015] border border-[#232938] rounded-xl space-y-3 relative group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg bg-[#141820] border border-[#273040] flex items-center justify-center p-1 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-white leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span>· {item.selectedColor}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1e2430] text-xs font-mono">
                    <div className="flex items-center bg-[#141820] rounded-md border border-[#273040]">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-white text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-display font-bold text-sm text-emerald-400 tabular-nums">
                      ₱{(item.price * item.quantity).toLocaleString()} PHP
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#0e1015] border-t border-[#232938] space-y-4">
              
              {/* Promo Code */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-950/40 border border-emerald-800 rounded-lg text-xs font-mono">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Code '{appliedPromo}' applied
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-slate-400 hover:text-white text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. HABITAT10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#141820] border border-[#273040] rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1c222e] hover:bg-emerald-700 text-white text-xs font-mono font-bold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {promoStatus && !appliedPromo && (
                  <p className={`text-[11px] font-mono mt-1 ${promoStatus.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {promoStatus.message}
                  </p>
                )}
              </div>

              {/* Order Calculations */}
              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-bold tabular-nums">₱{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="tabular-nums">-₱{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₱${shipping}`}</span>
                </div>

                <div className="flex items-center justify-between text-base font-display font-black text-white pt-2 border-t border-[#1e2430]">
                  <span>TOTAL</span>
                  <span className="text-emerald-400 tabular-nums">₱{total.toLocaleString()} PHP</span>
                </div>
              </div>

              {/* Master Checkout Trigger */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>WOLF Outdoor Batangas City Verified Order</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
