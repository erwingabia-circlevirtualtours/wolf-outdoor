import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { 
  X, CheckCircle2, ShieldCheck, MapPin, Phone, User, Mail, 
  Truck, QrCode, AlertCircle, Copy, Check 
} from 'lucide-react';
import { 
  validateGcashReferenceInput, 
  formatGcashReferenceDisplay, 
  sanitizeGcashReference 
} from '../../lib/validations';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    total,
    subtotal,
    discount,
    shipping,
    isCheckoutOpen,
    setIsCheckoutOpen,
    completeCheckout
  } = useCart();
  const { createOrder } = useStore();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cityRegion, setCityRegion] = useState('Batangas City');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'pickup'>('standard');
  const [paymentOption, setPaymentOption] = useState<'GCash' | 'Maya' | 'Cash on Delivery (COD)'>('GCash');
  
  // GCash Reference & Validation state
  const [gcashRef, setGcashRef] = useState('');
  const [gcashRefError, setGcashRefError] = useState<string | null>(null);
  const [isCopiedGcash, setIsCopiedGcash] = useState(false);

  const [orderId, setOrderId] = useState('');
  const [finalGcashRef, setFinalGcashRef] = useState('');

  if (!isCheckoutOpen) return null;

  const handleGcashRefChange = (val: string) => {
    // Keep only numbers or clean string
    const cleaned = sanitizeGcashReference(val);
    setGcashRef(cleaned);
    if (gcashRefError) {
      setGcashRefError(null);
    }
  };

  const handleCopyGcashNumber = () => {
    navigator.clipboard.writeText('09563695062');
    setIsCopiedGcash(true);
    setTimeout(() => setIsCopiedGcash(false), 2000);
  };

  const handleUseSampleRef = () => {
    const sample = '9021482019481';
    setGcashRef(sample);
    setGcashRefError(null);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || (deliveryMethod === 'standard' && !address.trim())) {
      return;
    }

    let verifiedRef: string | undefined = undefined;

    // Strict GCash Reference Runtime Validation with Zod
    if (paymentOption === 'GCash') {
      const gcashValidation = validateGcashReferenceInput(gcashRef);
      if (!gcashValidation.isValid) {
        setGcashRefError(gcashValidation.error || 'Please enter a valid 13-digit GCash reference number');
        return;
      }
      verifiedRef = gcashValidation.cleaned;
      setFinalGcashRef(verifiedRef);
    }

    const generatedId = `WOLF-PH-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(generatedId);

    // Save order into StoreContext
    createOrder({
      id: generatedId,
      customerName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      cityRegion,
      deliveryMethod,
      paymentOption,
      paymentReference: verifiedRef,
      items: [...cart],
      subtotal,
      discount,
      shipping,
      total,
      staffNotes: `Order submitted via storefront checkout (${deliveryMethod === 'pickup' ? 'Basecamp Pickup' : 'CALABARZON Delivery'}).${
        verifiedRef ? ` Customer submitted GCash Ref: ${verifiedRef}` : ''
      }`
    });

    await completeCheckout({
      orderId: generatedId,
      fullName,
      phone,
      email,
      address,
      cityRegion,
      deliveryMethod,
      paymentOption,
      total
    });

    setStep('success');
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('form');
    setGcashRef('');
    setGcashRefError(null);
  };

  const isGcashValidLength = sanitizeGcashReference(gcashRef).length === 13;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div 
        className="relative w-full max-w-2xl bg-[#141820] border border-[#2b3344] rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#232938] bg-[#0e1015] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-xs">
              ▲
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                WOLF Outdoor Gear Checkout
              </h3>
              <p className="text-xs text-emerald-400 font-mono">
                Direct Dispatch from Batangas City · Deterministic FSM
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1f2633]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          {step === 'form' ? (
            <form onSubmit={handleOrderSubmit} className="space-y-5">
              
              {/* Delivery Option */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('standard')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      deliveryMethod === 'standard'
                        ? 'border-orange-500 bg-orange-950/20 shadow-md ring-1 ring-orange-500'
                        : 'border-[#273040] bg-[#181d27] text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-xs text-white block">Standard Courier</span>
                    <span className="text-[11px] text-slate-400">J&T / LBC to your doorstep</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      deliveryMethod === 'pickup'
                        ? 'border-orange-500 bg-orange-950/20 shadow-md ring-1 ring-orange-500'
                        : 'border-[#273040] bg-[#181d27] text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-xs text-white block">Batangas City Pickup</span>
                    <span className="text-[11px] text-slate-400">Claim at Hub / Basecamp Cumba</span>
                  </button>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Recipient Full Name <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Erwin Dimaculangan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mobile Number <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="0915 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address if Courier */}
              {deliveryMethod === 'standard' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Province / City
                    </label>
                    <select
                      value={cityRegion}
                      onChange={(e) => setCityRegion(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Batangas City">Batangas City (Local Express)</option>
                      <option value="Batangas Province (Other Municipalities)">Batangas Province (Lipa, Tanauan, Bauan, San Pascual, etc.)</option>
                      <option value="CALABARZON (Cavite, Laguna, Rizal, Quezon)">CALABARZON Region</option>
                      <option value="Metro Manila">Metro Manila</option>
                      <option value="Rest of Luzon / Visayas / Mindanao">Rest of Luzon / Visayas / Mindanao</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Street Address & Barangay <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <textarea
                        required
                        rows={2}
                        placeholder="House / Unit No., Street, Barangay, Postal Code"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#181d27] border border-[#273040] rounded-lg text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['GCash', 'Maya', 'Cash on Delivery (COD)'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentOption(method)}
                      className={`p-2.5 rounded-lg border text-center transition-colors text-xs font-medium ${
                        paymentOption === method
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                          : 'border-[#273040] bg-[#181d27] text-slate-400 hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* GCash Verification Card & Input */}
              {paymentOption === 'GCash' && (
                <div className="p-4 rounded-xl bg-[#0e1015] border border-emerald-900/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#222a3a] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                        G
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Official WOLF Outdoor GCash Settlement
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      Amount: ₱{total.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-[#141820] p-3 rounded-lg border border-[#222a3a]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Merchant Name:</span>
                      <strong className="text-white">WOLF OUTDOOR / ERWIN D.</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">GCash Mobile Number:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <strong className="text-emerald-400 tracking-wider">0956 369 5062</strong>
                        <button
                          type="button"
                          onClick={handleCopyGcashNumber}
                          className="p-1 rounded bg-[#202736] hover:bg-[#2b3548] text-slate-300 hover:text-white transition-colors"
                          title="Copy GCash number"
                        >
                          {isCopiedGcash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-slate-200">
                        13-Digit GCash Reference Number <span className="text-orange-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleUseSampleRef}
                        className="text-[10px] text-emerald-400 hover:underline font-mono"
                      >
                        Paste Test Ref
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="e.g. 9021 4820 19481"
                        value={formatGcashReferenceDisplay(gcashRef)}
                        onChange={(e) => handleGcashRefChange(e.target.value)}
                        className={`w-full px-3 py-2 text-xs font-mono bg-[#181d27] border ${
                          gcashRefError 
                            ? 'border-red-500 ring-1 ring-red-500' 
                            : isGcashValidLength 
                              ? 'border-emerald-500 ring-1 ring-emerald-500/50' 
                              : 'border-[#273040] focus:border-emerald-500'
                        } rounded-lg text-white outline-none tracking-widest`}
                      />
                      {isGcashValidLength && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400 text-[11px] font-mono">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>13 Digits</span>
                        </div>
                      )}
                    </div>

                    {gcashRefError ? (
                      <p className="text-[11px] text-red-400 mt-1 font-mono flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{gcashRefError}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">
                        Found in your GCash SMS or in-app payment receipt. Enforced by Zod runtime schema.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#0e1015] border border-[#232938] space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span>Gear Subtotal ({cart.length} lines):</span>
                  <span className="font-bold text-white tabular-nums">₱{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span className="tabular-nums">-₱{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Delivery:</span>
                  <span>{shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₱${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1e2430]">
                  <span>Total Amount Due:</span>
                  <span className="text-emerald-400 tabular-nums">₱{total.toLocaleString()} PHP</span>
                </div>
              </div>

              {/* Support & Submit */}
              <div className="pt-1 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Questions or GCash verification?</span>
                  <a href="tel:09563695062" className="text-emerald-400 hover:underline font-bold">
                    Call / SMS: 0956 369 5062
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 text-xs uppercase font-bold tracking-wider text-white bg-orange-600 hover:bg-orange-500 active:scale-95 rounded-lg transition-all shadow-lg shadow-orange-950/50"
                >
                  Place Order ({paymentOption})
                </button>
              </div>

            </form>
          ) : (
            /* Order Success Receipt */
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-display font-black text-2xl text-white">
                  Order Successfully Placed!
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Salamat! We are packing your WOLF Outdoor gear in Batangas City.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-[#0e1015] border border-emerald-900/60 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-bold text-emerald-400">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="text-white">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile:</span>
                  <span className="text-slate-200">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Settlement:</span>
                  <span className="text-white font-bold">{paymentOption}</span>
                </div>
                {finalGcashRef && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">GCash Ref:</span>
                    <span className="text-emerald-400 font-bold">{finalGcashRef}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Fulfillment:</span>
                  <span className="text-slate-300">{deliveryMethod === 'pickup' ? 'Batangas City Pickup' : `Courier to ${cityRegion}`}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Back to Store
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
