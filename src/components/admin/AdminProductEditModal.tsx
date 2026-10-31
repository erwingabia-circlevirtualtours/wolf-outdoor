import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Image, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { OutdoorProduct, ProductCategory } from '../../types';
import { productItemSchema } from '../../lib/validations';

interface AdminProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: OutdoorProduct) => void;
  productToEdit?: OutdoorProduct | null;
}

const CATEGORY_OPTIONS: { id: ProductCategory; label: string }[] = [
  { id: 'hammocks', label: 'WOLF Hammocks' },
  { id: 'tents', label: 'Tents & Shelter' },
  { id: 'apparel', label: 'Apparel Lines' },
  { id: 'gear', label: 'Trek & Trail Gear' },
  { id: 'accessories', label: 'Accessories' },
];

const PRESET_IMAGES = [
  { label: 'WOLF Hammock (Emerald)', url: '/images/wolf_ripstop_hammock_1793274337239.jpg' },
  { label: 'Summit 2P Tent', url: '/images/wolf_summit_2p_dome_tent_1793274381898.jpg' },
  { label: 'Technical Trail Tee', url: '/images/wolf_technical_trail_tee_1793274359670.jpg' },
  { label: 'Expedition Dry Bag', url: '/images/wolf_waterproof_drybag_1793274403061.jpg' },
  { label: 'Logo Badge', url: '/wolf_outdoor_logo.jpg' },
];

export const AdminProductEditModal: React.FC<AdminProductEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit
}) => {
  const isEditing = Boolean(productToEdit);

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('hammocks');
  const [price, setPrice] = useState<number | string>(1450);
  const [originalPrice, setOriginalPrice] = useState<number | string>('');
  const [badge, setBadge] = useState('');
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState<number | string>(20);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/wolf_ripstop_hammock_1793274337239.jpg');
  
  // Features (bullet points)
  const [features, setFeatures] = useState<string[]>(['']);

  // Specs
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [capacity, setCapacity] = useState('');
  const [colorway, setColorway] = useState('');
  const [weatherRating, setWeatherRating] = useState('');

  // Sizes & Colors
  const [sizesInput, setSizesInput] = useState('');

  // Field-level validation errors from Zod
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formErrorSummary, setFormErrorSummary] = useState<string | null>(null);

  useEffect(() => {
    setFieldErrors({});
    setFormErrorSummary(null);

    if (productToEdit) {
      setName(productToEdit.name || '');
      setSubtitle(productToEdit.subtitle || '');
      setCategory(productToEdit.category || 'hammocks');
      setPrice(productToEdit.price || 0);
      setOriginalPrice(productToEdit.originalPrice !== undefined ? productToEdit.originalPrice : '');
      setBadge(productToEdit.badge || '');
      setInStock(productToEdit.inStock ?? true);
      setStockCount(productToEdit.stockCount !== undefined ? productToEdit.stockCount : 0);
      setDescription(productToEdit.description || '');
      setImage(productToEdit.image || '/images/wolf_ripstop_hammock_1793274337239.jpg');
      setFeatures(productToEdit.features && productToEdit.features.length > 0 ? productToEdit.features : ['']);
      setMaterial(productToEdit.specs?.material || '');
      setWeight(productToEdit.specs?.weight || '');
      setDimensions(productToEdit.specs?.dimensions || '');
      setCapacity(productToEdit.specs?.capacity || '');
      setColorway(productToEdit.specs?.colorway || '');
      setWeatherRating(productToEdit.specs?.weatherRating || '');
      setSizesInput(productToEdit.sizes ? productToEdit.sizes.join(', ') : '');
    } else {
      setName('');
      setSubtitle('Engineered for Batangas Ridge & Trail Conditions');
      setCategory('hammocks');
      setPrice(1200);
      setOriginalPrice('');
      setBadge('New Arrival');
      setInStock(true);
      setStockCount(15);
      setDescription('Engineered in Batangas City for tropical mountain ridges and sea breeze campsites.');
      setImage('/images/wolf_ripstop_hammock_1793274337239.jpg');
      setFeatures(['High-durability trail gear tested on Mt. Ulanin', 'Weatherproof construction with reinforced stitching']);
      setMaterial('210T Ripstop Nylon');
      setWeight('450g');
      setDimensions('Standard Trail Fit');
      setCapacity('250 kg');
      setColorway('Charcoal / Emerald');
      setWeatherRating('Tropical Rain Proof');
      setSizesInput('S, M, L, XL');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handleAddFeature = () => {
    setFeatures(prev => [...prev, '']);
  };

  const handleUpdateFeature = (index: number, val: string) => {
    setFeatures(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
    clearFieldError('features');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
    clearFieldError('features');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorSummary(null);

    const parsedSizes = sizesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const filteredFeatures = features.map(f => f.trim()).filter(Boolean);

    const numericPrice = Number(price);
    const numericOriginalPrice = originalPrice !== '' && originalPrice !== undefined ? Number(originalPrice) : undefined;
    const numericStockCount = Number(stockCount);

    const generatedId = productToEdit 
      ? productToEdit.id 
      : `wolf-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'gear'}-${Math.floor(Math.random() * 900 + 100)}`;

    const candidateData = {
      id: generatedId,
      name: name.trim(),
      subtitle: subtitle.trim(),
      category,
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      rating: productToEdit?.rating || 5.0,
      reviewCount: productToEdit?.reviewCount || 1,
      badge: badge.trim() || undefined,
      inStock: inStock && numericStockCount > 0,
      stockCount: numericStockCount,
      description: description.trim(),
      features: filteredFeatures,
      specs: {
        material: material.trim(),
        weight: weight.trim() || undefined,
        dimensions: dimensions.trim() || undefined,
        capacity: capacity.trim() || undefined,
        colorway: colorway.trim() || undefined,
        weatherRating: weatherRating.trim() || undefined,
      },
      image: image.trim(),
      sizes: parsedSizes.length > 0 ? parsedSizes : undefined,
      colors: productToEdit?.colors || [
        { name: 'Forest Emerald', hex: '#047857' },
        { name: 'Volcanic Charcoal', hex: '#1c222e' }
      ]
    };

    // Strict runtime Zod schema validation
    const validationResult = productItemSchema.safeParse(candidateData);

    if (!validationResult.success) {
      const errorsMap: Record<string, string> = {};
      const issues = validationResult.error.issues || [];
      issues.forEach(err => {
        const pathKey = err.path.join('.');
        if (!errorsMap[pathKey]) {
          errorsMap[pathKey] = err.message;
        }
      });
      setFieldErrors(errorsMap);
      setFormErrorSummary(`Please correct the ${issues.length} validation issue(s) highlighted below.`);
      return;
    }

    // Passed Zod validation
    setFieldErrors({});
    setFormErrorSummary(null);
    onSave(validationResult.data as OutdoorProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-slate-100">
      <div 
        className="relative w-full max-w-3xl bg-[#141820] border border-[#2c3547] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222a3a] bg-[#0e1015] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                {isEditing ? `Edit Gear: ${productToEdit?.name}` : 'Add New Equipment to Catalog'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                WOLF Basecamp Inventory Management · Strict Schema Enforced
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1f2633] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {formErrorSummary && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{formErrorSummary}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold border-b border-[#222a3a] pb-1">
              General Gear Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    clearFieldError('name');
                  }}
                  placeholder="e.g. WOLF Ultralight Ripstop Hammock"
                  className={`w-full bg-[#0c0e12] border ${
                    fieldErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                  } rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors`}
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={e => {
                    setCategory(e.target.value as ProductCategory);
                    clearFieldError('category');
                  }}
                  className={`w-full bg-[#0c0e12] border ${
                    fieldErrors.category ? 'border-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                  } rounded-lg px-3 py-2 text-sm text-white outline-none`}
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <p className="text-[11px] text-red-400 mt-1">{fieldErrors.category}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Subtitle / One-line Description *
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={e => {
                  setSubtitle(e.target.value);
                  clearFieldError('subtitle');
                }}
                placeholder="e.g. High-tenacity 210T parachute ripstop with tree-friendly straps"
                className={`w-full bg-[#0c0e12] border ${
                  fieldErrors.subtitle ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                } rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none`}
              />
              {fieldErrors.subtitle && (
                <p className="text-[11px] text-red-400 mt-1 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.subtitle}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Price (₱ PHP) *
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={price}
                  onChange={e => {
                    setPrice(e.target.value === '' ? '' : Number(e.target.value));
                    clearFieldError('price');
                  }}
                  className={`w-full bg-[#0c0e12] border ${
                    fieldErrors.price ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                  } rounded-lg px-3 py-2 text-sm text-white font-mono font-semibold outline-none`}
                />
                {fieldErrors.price && (
                  <p className="text-[11px] text-red-400 mt-1 font-mono">{fieldErrors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Original Price (₱) <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={originalPrice}
                  onChange={e => {
                    setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value));
                    clearFieldError('originalPrice');
                  }}
                  placeholder="e.g. 1750"
                  className={`w-full bg-[#0c0e12] border ${
                    fieldErrors.originalPrice ? 'border-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                  } rounded-lg px-3 py-2 text-sm text-slate-300 font-mono outline-none`}
                />
                {fieldErrors.originalPrice && (
                  <p className="text-[11px] text-red-400 mt-1 font-mono">{fieldErrors.originalPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Badge / Tag
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={e => setBadge(e.target.value)}
                  placeholder="e.g. Signature Gear, Camp Fest Ready"
                  className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Available Units *
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={stockCount}
                  onChange={e => {
                    setStockCount(e.target.value === '' ? '' : Number(e.target.value));
                    clearFieldError('stockCount');
                  }}
                  className={`w-full bg-[#0c0e12] border ${
                    fieldErrors.stockCount ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                  } rounded-lg px-3 py-2 text-sm text-white font-mono font-semibold outline-none`}
                />
                {fieldErrors.stockCount && (
                  <p className="text-[11px] text-red-400 mt-1 font-mono">{fieldErrors.stockCount}</p>
                )}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0c0e12] border border-[#222a3a]">
              <div>
                <span className="text-sm font-medium text-white block">Stock Availability Status</span>
                <span className="text-xs text-slate-400">Controls whether customers can add this gear to cart</span>
              </div>
              <button
                type="button"
                onClick={() => setInStock(!inStock)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  inStock ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    inStock ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Image & Description */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold border-b border-[#222a3a] pb-1">
              Image & Story
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Image Path or URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={e => {
                    setImage(e.target.value);
                    clearFieldError('image');
                  }}
                  placeholder="/images/gear.jpg"
                  className={`flex-1 bg-[#0c0e12] border ${
                    fieldErrors.image ? 'border-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                  } rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none`}
                />
                {image && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#2b3344] shrink-0 bg-black">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {fieldErrors.image && (
                <p className="text-[11px] text-red-400 mt-1 font-mono">{fieldErrors.image}</p>
              )}

              {/* Quick image presets */}
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-400">Presets:</span>
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImage(preset.url);
                      clearFieldError('image');
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#1f2633] text-slate-300 hover:text-white hover:bg-emerald-950 hover:border-emerald-500 border border-transparent transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Description / Field Notes *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  clearFieldError('description');
                }}
                placeholder="Engineered in Batangas City for tropical mountain ridges..."
                className={`w-full bg-[#0c0e12] border ${
                  fieldErrors.description ? 'border-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                } rounded-lg p-3 text-sm text-white placeholder-slate-500 outline-none resize-none`}
              />
              {fieldErrors.description && (
                <p className="text-[11px] text-red-400 mt-1 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.description}</span>
                </p>
              )}
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#222a3a] pb-1">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Key Features (Bullet Points) *
                </h4>
                {fieldErrors.features && (
                  <span className="text-[11px] text-red-400 font-mono block mt-0.5">
                    {fieldErrors.features}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            {features.map((feat, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-slate-500 font-mono text-xs w-4">#{idx + 1}</span>
                <input
                  type="text"
                  value={feat}
                  onChange={e => handleUpdateFeature(idx, e.target.value)}
                  placeholder="e.g. Holds up to 250kg with reinforced triple interlocking seams"
                  className="flex-1 bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Technical Specs & Sizes */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold border-b border-[#222a3a] pb-1">
              Technical Specifications & Sizing
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Material *
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={e => {
                    setMaterial(e.target.value);
                    clearFieldError('specs.material');
                  }}
                  placeholder="e.g. 210T Ripstop Nylon"
                  className={`w-full bg-[#0c0e12] border ${
                    fieldErrors['specs.material'] ? 'border-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                  } rounded-lg px-3 py-1.5 text-xs text-white outline-none`}
                />
                {fieldErrors['specs.material'] && (
                  <p className="text-[11px] text-red-400 mt-1 font-mono">{fieldErrors['specs.material']}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 480g"
                  className="w-full bg-[#0c0e12] border border-[#2b3344] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dimensions</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={e => setDimensions(e.target.value)}
                  placeholder="e.g. 300cm x 150cm"
                  className="w-full bg-[#0c0e12] border border-[#2b3344] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Capacity</label>
                <input
                  type="text"
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  placeholder="e.g. 250 kg / 550 lbs"
                  className="w-full bg-[#0c0e12] border border-[#2b3344] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Colorway</label>
                <input
                  type="text"
                  value={colorway}
                  onChange={e => setColorway(e.target.value)}
                  placeholder="e.g. Forest Emerald / Charcoal"
                  className="w-full bg-[#0c0e12] border border-[#2b3344] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Weather Rating</label>
                <input
                  type="text"
                  value={weatherRating}
                  onChange={e => setWeatherRating(e.target.value)}
                  placeholder="e.g. Tropical Rain Proof"
                  className="w-full bg-[#0c0e12] border border-[#2b3344] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Sizes (Comma separated, e.g. S, M, L, XL, 2XL)
              </label>
              <input
                type="text"
                value={sizesInput}
                onChange={e => setSizesInput(e.target.value)}
                placeholder="S, M, L, XL, 2XL"
                className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#222a3a] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1f2633] hover:bg-[#2b3547] text-slate-300 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Equipment Changes' : 'Add to WOLF Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
