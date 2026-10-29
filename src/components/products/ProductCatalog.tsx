import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Eye, SlidersHorizontal, Check } from 'lucide-react';
import { OUTDOOR_PRODUCTS } from '../../data/products';
import { OutdoorProduct, ProductCategory } from '../../types';
import { useCart } from '../../context/CartContext';
import { ProductQuickViewModal } from './ProductQuickViewModal';

interface ProductCatalogProps {
  initialCategory?: ProductCategory;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialCategory = 'all' }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<OutdoorProduct | null>(null);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Gear' },
    { id: 'apparel', label: 'Apparel Lines' },
    { id: 'hammocks', label: 'WOLF Hammocks' },
    { id: 'tents', label: 'Tents & Shelter' },
    { id: 'gear', label: 'Trek & Trail Gear' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredProducts = useMemo(() => {
    return OUTDOOR_PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product: OutdoorProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      selectedSize: product.sizes ? product.sizes[0] : undefined,
      selectedColor: product.colors ? product.colors[0].name : undefined
    });
  };

  return (
    <section id="catalog" className="py-20 bg-[#0c0e12] border-t border-[#1d222e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
              <span>Brings You To The Right Habitat</span>
              <span className="text-slate-600">/</span>
              <span>Batangas City Craft</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Apparel & Outdoor Gear
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Authentic outdoor equipment engineered for Philippine mountain ridges, tropical humidity, and rugged trail explorations.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search gear or apparel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs bg-[#141820] border border-[#273040] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-[#141820] border border-[#273040] rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs (Zero-Pill: Clean Segmented Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 border-b border-[#1d222e] scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141820]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#141820] rounded-2xl border border-[#232938]">
            <p className="text-slate-400 text-sm">No gear matches your search filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 text-xs font-medium text-emerald-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setQuickViewProduct(product)}
                className="group cursor-pointer rounded-xl bg-[#141820] border border-[#232938] hover:border-emerald-700/60 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20"
              >
                {/* Product Image Slot */}
                <div className="relative aspect-[4/3] bg-[#0c0e12] overflow-hidden">
                  <picture>
                    <source srcSet={product.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')} type="image/webp" />
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={300}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </picture>

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-emerald-800 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded">
                      {product.badge}
                    </span>
                  )}

                  {/* Hover Quick View Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="px-3 py-1.5 bg-[#12151c]/90 text-white hover:bg-emerald-700 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors mt-0.5 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Price Baseline and Add Button */}
                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#1e2430]">
                    <div>
                      <span className="font-display font-bold text-lg text-white tabular-nums">
                        ₱{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through ml-2 tabular-nums">
                          ₱{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      aria-label={`Add ${product.name} to cart`}
                      className="p-2 text-slate-200 bg-[#1c222e] hover:bg-orange-600 hover:text-white rounded-lg transition-colors focus:outline-none"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
