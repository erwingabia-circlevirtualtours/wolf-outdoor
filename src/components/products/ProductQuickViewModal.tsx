import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { OutdoorProduct } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductQuickViewModalProps {
  product: OutdoorProduct | null;
  onClose: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors ? product.colors[0].name : undefined
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      selectedSize,
      selectedColor
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-[#141820] border border-[#2b3344] rounded-2xl overflow-hidden shadow-2xl text-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-[#0e1015]/80 hover:bg-[#1a202c] rounded-full transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Image Preview */}
            <div className="rounded-xl overflow-hidden bg-[#0c0e12] border border-[#232938] aspect-[4/3] relative">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-700 text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="space-y-5">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">
                  {product.category}
                </span>
                <h3 className="font-display font-black text-2xl text-white mt-1">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {product.subtitle}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-display font-bold text-2xl text-emerald-400 tabular-nums">
                    ₱{product.price.toLocaleString()} PHP
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-500 line-through tabular-nums">
                      ₱{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-slate-300 mb-2">
                    Color: <span className="text-slate-400 font-normal">{selectedColor}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          selectedColor === color.name ? 'border-orange-500 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-slate-300 mb-2">
                    Size
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md border transition-colors ${
                          selectedSize === size
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-[#181d27] border-[#2c3446] text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-[#2c3446] rounded-lg bg-[#181d27]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-300 hover:text-white focus:outline-none"
                  >
                    -
                  </button>
                  <span className="px-3 font-mono text-sm tabular-nums text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-300 hover:text-white focus:outline-none"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Gear Bag · ₱{(product.price * quantity).toLocaleString()}</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#232938] text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Batangas City & Luzon Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WOLF Outdoor Trail Warranty</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
