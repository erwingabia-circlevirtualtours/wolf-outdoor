import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Copy, AlertCircle, CheckCircle2, 
  Download, Upload, RefreshCw, Eye, ArrowUpDown, Package, Tag, ShieldCheck
} from 'lucide-react';
import { OutdoorProduct, ProductCategory } from '../../types';
import { useStore } from '../../context/StoreContext';
import { AdminProductEditModal } from './AdminProductEditModal';

export const AdminProductsTab: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleStock, 
    adjustStock, 
    resetProductsToDefault,
    importProducts
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');
  
  // Modals
  const [editingProduct, setEditingProduct] = useState<OutdoorProduct | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<OutdoorProduct | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Category filters
  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'hammocks', label: 'Hammocks' },
    { id: 'tents', label: 'Tents' },
    { id: 'apparel', label: 'Apparel' },
    { id: 'gear', label: 'Trail Gear' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      let matchesStock = true;
      if (stockFilter === 'inStock') {
        matchesStock = p.inStock && (p.stockCount ?? 0) > 0;
      } else if (stockFilter === 'lowStock') {
        matchesStock = p.inStock && (p.stockCount ?? 0) > 0 && (p.stockCount ?? 0) <= 5;
      } else if (stockFilter === 'outOfStock') {
        matchesStock = !p.inStock || (p.stockCount ?? 0) === 0;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  const handleDuplicate = (product: OutdoorProduct) => {
    const duplicated: OutdoorProduct = {
      ...product,
      id: `${product.id}-copy-${Math.floor(Math.random() * 900 + 100)}`,
      name: `${product.name} (Copy)`,
      reviewCount: 0,
      stockCount: 10,
      inStock: true
    };
    addProduct(duplicated);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(products, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wolf_outdoor_products_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    const code = `import { OutdoorProduct } from '../types';\n\nexport const OUTDOOR_PRODUCTS: OutdoorProduct[] = ${JSON.stringify(products, null, 2)};\n`;
    navigator.clipboard.writeText(code);
    setCopyStatus('Copied TypeScript code to clipboard!');
    setTimeout(() => setCopyStatus(null), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const success = importProducts(parsed);
        if (success) {
          alert('Successfully imported products!');
        } else {
          alert('Import failed: invalid product JSON structure.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#12151c] p-4 rounded-xl border border-[#222a3a]">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search gear by name, subtitle, ID..."
            className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a202c] hover:bg-[#252e3e] text-slate-300 hover:text-white border border-[#2e3747] text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export / Sync</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a202c] hover:bg-[#252e3e] text-slate-300 hover:text-white border border-[#2e3747] text-xs font-medium transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-orange-400" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Reset catalog back to initial Mt. Ulanin default gear? Any unsaved edits will be lost.')) {
                resetProductsToDefault();
              }
            }}
            title="Reset to initial products list"
            className="p-2 rounded-lg bg-[#1a202c] hover:bg-[#252e3e] text-slate-400 hover:text-white border border-[#2e3747] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Equipment</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-[#141820] text-slate-400 border-[#222a3a] hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stock Filter */}
        <div className="flex items-center gap-1.5 bg-[#141820] p-1 rounded-lg border border-[#222a3a]">
          <span className="text-slate-500 px-2 font-mono text-[11px]">Stock:</span>
          {(['all', 'inStock', 'lowStock', 'outOfStock'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setStockFilter(mode)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                stockFilter === mode
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'all' && 'All'}
              {mode === 'inStock' && 'In Stock'}
              {mode === 'lowStock' && 'Low Stock (≤5)'}
              {mode === 'outOfStock' && 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#12151c] border border-[#222a3a] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0e1015] border-b border-[#222a3a] text-slate-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Gear Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (PHP)</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-center">Available Units</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2533]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-sm font-medium">No equipment found matching criteria</p>
                    <p className="text-xs text-slate-600 mt-1">Try clearing search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isOutOfStock = !product.inStock || (product.stockCount ?? 0) === 0;
                  const isLowStock = product.inStock && (product.stockCount ?? 0) > 0 && (product.stockCount ?? 0) <= 5;

                  return (
                    <tr key={product.id} className="hover:bg-[#161a23] transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#2b3344] bg-black shrink-0 relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            {product.badge && (
                              <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[8px] font-bold text-center py-0.5 truncate px-0.5">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div className="max-w-xs">
                            <h4 className="font-semibold text-white text-sm line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-slate-400 text-[11px] line-clamp-1">
                              {product.subtitle}
                            </p>
                            <span className="text-slate-500 font-mono text-[10px]">
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#1e2533] text-slate-300 font-medium capitalize text-[11px] border border-[#2b3446]">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-white text-sm">
                          ₱{product.price.toLocaleString()}
                        </div>
                        {product.originalPrice && (
                          <div className="text-[11px] text-slate-500 line-through font-mono">
                            ₱{product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Stock Status Toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleStock(product.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                            isOutOfStock
                              ? 'bg-red-950/40 text-red-400 border-red-800/40 hover:bg-red-900/50'
                              : isLowStock
                              ? 'bg-amber-950/40 text-amber-300 border-amber-800/40 hover:bg-amber-900/50'
                              : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900/50'
                          }`}
                          title="Click to toggle In-Stock / Out-of-Stock"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                          <span>
                            {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'Active / In Stock'}
                          </span>
                        </button>
                      </td>

                      {/* Stock Stepper */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5 bg-[#0e1015] border border-[#2b3344] rounded-lg p-1">
                          <button
                            onClick={() => adjustStock(product.id, -1)}
                            className="w-6 h-6 rounded bg-[#1f2633] text-slate-300 hover:text-white hover:bg-red-900/60 flex items-center justify-center font-bold text-xs transition-colors"
                            title="Decrease by 1"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-mono font-semibold text-white text-xs">
                            {product.stockCount ?? 0}
                          </span>
                          <button
                            onClick={() => adjustStock(product.id, 1)}
                            className="w-6 h-6 rounded bg-[#1f2633] text-slate-300 hover:text-white hover:bg-emerald-900/60 flex items-center justify-center font-bold text-xs transition-colors"
                            title="Increase by 1"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 rounded-lg bg-[#1a202c] hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-400 border border-[#2b3344] hover:border-emerald-600 transition-colors"
                            title="Edit gear specifications"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(product)}
                            className="p-1.5 rounded-lg bg-[#1a202c] hover:bg-[#252e3e] text-slate-400 hover:text-white border border-[#2b3344] transition-colors"
                            title="Duplicate gear"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded-lg bg-[#1a202c] hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-[#2b3344] hover:border-red-600 transition-colors"
                            title="Delete gear"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="p-3 bg-[#0e1015] border-t border-[#222a3a] text-slate-400 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span>Showing <strong className="text-white">{filteredProducts.length}</strong> of <strong className="text-white">{products.length}</strong> equipment items</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-medium">
              {products.filter(p => p.inStock && (p.stockCount ?? 0) > 0).length} in stock
            </span>
            <span className="text-red-400 font-medium">
              {products.filter(p => !p.inStock || (p.stockCount ?? 0) === 0).length} out of stock
            </span>
          </div>

          <span className="text-slate-500 font-mono text-[11px]">
            Changes save to client basecamp cache in real time
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <AdminProductEditModal
          isOpen={true}
          productToEdit={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(updated) => updateProduct(updated)}
        />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <AdminProductEditModal
          isOpen={true}
          productToEdit={null}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newProd) => addProduct(newProd)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-slate-100">
          <div className="bg-[#141820] border border-red-900/60 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Remove "{productToDelete.name}" from catalog?
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              This will remove the item from the storefront catalog and prevent customers from purchasing it. You can restore it later by re-importing or resetting defaults.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg bg-[#1f2633] text-slate-300 text-xs font-medium hover:bg-[#2c3648] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-950 transition-colors"
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export / Sync Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-slate-100">
          <div className="bg-[#141820] border border-[#2c3547] rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222a3a] pb-3">
              <div className="flex items-center gap-2.5">
                <Download className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Export Catalog for S3 / Git Deployment</h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f2633]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your modifications are active right now in the browser. When you are ready to make these changes permanent across the AWS S3 static build or GitHub repository, you can download the JSON or copy the TypeScript code directly into <code className="text-emerald-400 font-mono">src/data/products.ts</code>:
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleExportJSON}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a202c] hover:bg-[#252e3e] text-white border border-[#2e3747] text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download products.json</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy src/data/products.ts</span>
              </button>
            </div>

            {copyStatus && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{copyStatus}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
