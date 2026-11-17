import React, { useState, useMemo, useEffect } from 'react';
import type { Product, ProductCategory } from '../data/products';
import { matchesCollectionSubCategory } from '../data/products';
import { X, ArrowLeft, ChevronRight, Check } from 'lucide-react';

export type FilterFieldKey = 
  | 'brand' 
  | 'shape' 
  | 'color' 
  | 'material' 
  | 'rim' 
  | 'disposability' 
  | 'type' 
  | 'price';

export interface FilterValues {
  brands: string[];
  shapes: string[];
  colors: string[];
  materials: string[];
  rims: string[];
  disposabilities: string[];
  types: string[];
  maxPrice: number;
}

export const DEFAULT_FILTER_VALUES: FilterValues = {
  brands: [],
  shapes: [],
  colors: [],
  materials: [],
  rims: [],
  disposabilities: [],
  types: [],
  maxPrice: 15000
};

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  category: ProductCategory | 'all';
  subCategory?: string;
  allProducts: Product[];
  currentFilters: FilterValues;
  onApplyFilters: (filters: FilterValues) => void;
  onRemoveAll: () => void;
}

// Config table as specified in requirements:
// - Eyeglasses: Brand, Shape, Color, Material, Rim, Price
// - Sunglasses: Brand, Shape, Color, Material, Rim, Price
// - Federal Tints: Tint Color/Type, Frame Shape, Price
// - Clear Contacts: Brand, Disposability, Price
// - Color Contacts: Brand, Color, Disposability, Price
// - Accessories: Product Type, Price
export function getCategoryFilterFields(category: ProductCategory | 'all'): FilterFieldKey[] {
  switch (category) {
    case 'eyeglasses':
      return ['brand', 'shape', 'color', 'material', 'rim', 'price'];
    case 'sunglasses':
      return ['brand', 'shape', 'color', 'material', 'rim', 'price'];
    case 'tint-eyeglasses':
      return ['color', 'shape', 'price'];
    case 'clear-contacts':
      return ['brand', 'disposability', 'price'];
    case 'color-contacts':
      return ['brand', 'type', 'color', 'disposability', 'price'];
    case 'accessories':
      return ['type', 'price'];
    default:
      return ['brand', 'shape', 'color', 'material', 'rim', 'price'];
  }
}

function getFieldLabel(key: FilterFieldKey, category: ProductCategory | 'all'): string {
  switch (key) {
    case 'brand':
      return 'Brand';
    case 'shape':
      return category === 'tint-eyeglasses' ? 'Frame Shape' : 'Shape';
    case 'color':
      if (category === 'tint-eyeglasses') return 'Tint Color / Shade';
      if (category === 'color-contacts') return 'Lens Color';
      return 'Color';
    case 'material':
      return 'Material';
    case 'rim':
      return 'Rim';
    case 'disposability':
      return 'Disposability';
    case 'type':
      if (category === 'color-contacts') return 'Collection / Series';
      return 'Product Type';
    case 'price':
      return 'Price';
  }
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  category,
  subCategory,
  allProducts,
  currentFilters,
  onApplyFilters,
  onRemoveAll
}) => {
  // Working draft state inside the panel (applied only when clicking "Apply")
  const [draftFilters, setDraftFilters] = useState<FilterValues>(currentFilters);
  const [activeSubView, setActiveSubView] = useState<FilterFieldKey | null>(null);

  // Sync draft state with current filters whenever panel opens
  useEffect(() => {
    if (isOpen) {
      setDraftFilters(currentFilters);
      setActiveSubView(null);
    }
  }, [isOpen, currentFilters]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Configured field keys for this category (guaranteed no duplicates)
  const fields = useMemo(() => {
    const raw = getCategoryFilterFields(category);
    return Array.from(new Set(raw));
  }, [category]);

  // The base product set for this specific collection
  const baseCategoryProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      return matchesCollectionSubCategory(p, subCategory);
    });
  }, [allProducts, category, subCategory]);

  // Extract all available values dynamically from the product dataset for this collection
  const availableOptions = useMemo(() => {
    const brands = new Set<string>();
    const shapes = new Set<string>();
    const colors = new Set<string>();
    const materials = new Set<string>();
    const rims = new Set<string>();
    const disposabilities = new Set<string>();
    const types = new Set<string>();
    let minPrice = 1000;
    let maxPrice = 15000;

    baseCategoryProducts.forEach(p => {
      if (p.brand) brands.add(p.brand);
      if (p.frameShape) shapes.add(p.frameShape);
      if (p.frameMaterial) materials.add(p.frameMaterial);
      rims.add(p.rimType || 'Full Rim');
      if (p.disposability) disposabilities.add(p.disposability);
      if (p.subCategory) types.add(p.subCategory);

      if (category === 'color-contacts') {
        if (p.lensColor) colors.add(p.lensColor);
      } else {
        p.availableColors.forEach(c => colors.add(c.name));
      }

      if (p.price < minPrice) minPrice = p.price;
      if (p.price > maxPrice) maxPrice = p.price;
    });

    return {
      brands: Array.from(brands).sort(),
      shapes: Array.from(shapes).sort(),
      colors: Array.from(colors).sort(),
      materials: Array.from(materials).sort(),
      rims: Array.from(rims).sort(),
      disposabilities: Array.from(disposabilities).sort(),
      types: Array.from(types).sort(),
      minPrice,
      maxPrice
    };
  }, [baseCategoryProducts, category]);

  // Calculate live matching count based on current draftFilters
  const liveMatchingProducts = useMemo(() => {
    return baseCategoryProducts.filter(product => {
      // Brand
      if (draftFilters.brands.length > 0) {
        if (!draftFilters.brands.some(b => product.brand.toLowerCase().includes(b.toLowerCase()))) {
          return false;
        }
      }

      // Shape
      if (draftFilters.shapes.length > 0) {
        if (!product.frameShape || !draftFilters.shapes.includes(product.frameShape)) {
          return false;
        }
      }

      // Color
      if (draftFilters.colors.length > 0) {
        if (category === 'color-contacts') {
          if (!product.lensColor || !draftFilters.colors.includes(product.lensColor)) return false;
        } else {
          const hasColor = product.availableColors.some(c => draftFilters.colors.includes(c.name));
          if (!hasColor) return false;
        }
      }

      // Material
      if (draftFilters.materials.length > 0) {
        if (!product.frameMaterial || !draftFilters.materials.includes(product.frameMaterial)) {
          return false;
        }
      }

      // Rim
      if (draftFilters.rims.length > 0) {
        const pRim = product.rimType || 'Full Rim';
        if (!draftFilters.rims.includes(pRim)) return false;
      }

      // Disposability
      if (draftFilters.disposabilities.length > 0) {
        if (!product.disposability || !draftFilters.disposabilities.includes(product.disposability)) {
          return false;
        }
      }

      // Type (accessories)
      if (draftFilters.types.length > 0) {
        if (!draftFilters.types.includes(product.subCategory)) return false;
      }

      // Price
      if (product.price > draftFilters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [baseCategoryProducts, draftFilters, category]);

  // Helper to toggle array values
  const toggleValue = (key: keyof FilterValues, val: string) => {
    setDraftFilters(prev => {
      const currentList = prev[key] as string[];
      const exists = currentList.includes(val);
      const updated = exists ? currentList.filter(item => item !== val) : [...currentList, val];
      return { ...prev, [key]: updated };
    });
  };

  // Helper to get selected summary badge for field row
  const getFieldSummary = (field: FilterFieldKey): string | null => {
    switch (field) {
      case 'brand':
        return draftFilters.brands.length > 0 ? `${draftFilters.brands.length} selected` : null;
      case 'shape':
        return draftFilters.shapes.length > 0 ? `${draftFilters.shapes.length} selected` : null;
      case 'color':
        return draftFilters.colors.length > 0 ? `${draftFilters.colors.length} selected` : null;
      case 'material':
        return draftFilters.materials.length > 0 ? `${draftFilters.materials.length} selected` : null;
      case 'rim':
        return draftFilters.rims.length > 0 ? `${draftFilters.rims.length} selected` : null;
      case 'disposability':
        return draftFilters.disposabilities.length > 0 ? `${draftFilters.disposabilities.length} selected` : null;
      case 'type':
        return draftFilters.types.length > 0 ? `${draftFilters.types.length} selected` : null;
      case 'price':
        return draftFilters.maxPrice < 15000 ? `≤ Rs. ${draftFilters.maxPrice.toLocaleString()}` : null;
    }
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  const handleRemoveAll = () => {
    setDraftFilters(DEFAULT_FILTER_VALUES);
    onRemoveAll();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl z-10 flex flex-col justify-between border-l border-[#E8E3D8]">
        {/* ========================================================================= */}
        {/* DRAWER HEADER: Title + live count + ✕ close                                */}
        {/* ========================================================================= */}
        <div className="p-5 border-b border-[#E8E3D8] bg-white flex items-center justify-between">
          {activeSubView ? (
            <button
              onClick={() => setActiveSubView(null)}
              className="flex items-center gap-2 text-stone-900 font-heading font-semibold text-base hover:text-[#8C7048] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
              <span>{getFieldLabel(activeSubView, category)}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <h3 className="font-heading text-xl font-semibold text-stone-900">
                Filter
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8E3D8] text-stone-700 font-medium">
                {liveMatchingProducts.length} {liveMatchingProducts.length === 1 ? 'product' : 'products'}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-[#F3EFE8] transition-colors"
            aria-label="Close filter panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* DRAWER BODY: Multi-level sliding views                                     */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto">
          {/* ROOT VIEW: List of fields for this category */}
          {!activeSubView && (
            <div className="divide-y divide-[#E8E3D8]">
              {fields.map(field => {
                const summary = getFieldSummary(field);
                return (
                  <button
                    key={field}
                    onClick={() => setActiveSubView(field)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-stone-900 hover:bg-[#F3EFE8]/70 transition-colors group cursor-pointer"
                  >
                    <span className="group-hover:text-[#8C7048] transition-colors">
                      {getFieldLabel(field, category)}
                    </span>
                    <div className="flex items-center gap-2">
                      {summary && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#8C7048]">
                          {summary}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW: Brand value list */}
          {activeSubView === 'brand' && (
            <div className="p-6 space-y-2 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                Select Brands ({availableOptions.brands.length})
              </span>
              {availableOptions.brands.map(brand => {
                const isSelected = draftFilters.brands.includes(brand);
                const count = baseCategoryProducts.filter(p => p.brand === brand).length;
                return (
                  <label
                    key={brand}
                    onClick={() => toggleValue('brands', brand)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#C5A880] text-stone-900 shadow-xs'
                        : 'bg-white/50 border-[#E8E3D8] text-stone-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#121316] border-[#121316] text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{brand}</span>
                    </div>
                    <span className="text-stone-400 text-[11px]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW: Shape value list */}
          {activeSubView === 'shape' && (
            <div className="p-6 space-y-2 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                Select Frame Shapes
              </span>
              {availableOptions.shapes.map(shape => {
                const isSelected = draftFilters.shapes.includes(shape);
                const count = baseCategoryProducts.filter(p => p.frameShape === shape).length;
                return (
                  <label
                    key={shape}
                    onClick={() => toggleValue('shapes', shape)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs capitalize cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#C5A880] text-stone-900 shadow-xs'
                        : 'bg-white/50 border-[#E8E3D8] text-stone-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#121316] border-[#121316] text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{shape}</span>
                    </div>
                    <span className="text-stone-400 text-[11px]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW: Color value list */}
          {activeSubView === 'color' && (
            <div className="p-6 space-y-2 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                Select Colors / Shades
              </span>
              {availableOptions.colors.map(color => {
                const isSelected = draftFilters.colors.includes(color);
                return (
                  <label
                    key={color}
                    onClick={() => toggleValue('colors', color)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#C5A880] text-stone-900 shadow-xs'
                        : 'bg-white/50 border-[#E8E3D8] text-stone-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#121316] border-[#121316] text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{color}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW: Material value list */}
          {activeSubView === 'material' && (
            <div className="p-6 space-y-2 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                Select Frame Materials
              </span>
              {availableOptions.materials.map(material => {
                const isSelected = draftFilters.materials.includes(material);
                const count = baseCategoryProducts.filter(p => p.frameMaterial === material).length;
                return (
                  <label
                    key={material}
                    onClick={() => toggleValue('materials', material)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#C5A880] text-stone-900 shadow-xs'
                        : 'bg-white/50 border-[#E8E3D8] text-stone-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#121316] border-[#121316] text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{material}</span>
                    </div>
                    <span className="text-stone-400 text-[11px]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW: Rim value list */}
          {activeSubView === 'rim' && (
            <div className="p-6 space-y-2 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                Select Rim Type
              </span>
              {availableOptions.rims.map(rim => {
                const isSelected = draftFilters.rims.includes(rim);
                const count = baseCategoryProducts.filter(p => (p.rimType || 'Full Rim') === rim).length;
                return (
                  <label
                    key={rim}
                    onClick={() => toggleValue('rims', rim)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#C5A880] text-stone-900 shadow-xs'
                        : 'bg-white/50 border-[#E8E3D8] text-stone-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#121316] border-[#121316] text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{rim}</span>
                    </div>
                    <span className="text-stone-400 text-[11px]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW: Disposability value list */}
          {activeSubView === 'disposability' && (
            <div className="p-6 space-y-2 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                Select Disposability
              </span>
              {availableOptions.disposabilities.map(disp => {
                const isSelected = draftFilters.disposabilities.includes(disp);
                const count = baseCategoryProducts.filter(p => p.disposability === disp).length;
                const labelMap: Record<string, string> = {
                  daily: 'Daily Disposable',
                  monthly: 'Monthly Disposable',
                  'three-month': '3-Month Extended',
                  'six-month': '6-Month Extended',
                  yearly: 'Yearly Conventional'
                };
                const displayLabel = labelMap[disp] || disp;

                return (
                  <label
                    key={disp}
                    onClick={() => toggleValue('disposabilities', disp)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#C5A880] text-stone-900 shadow-xs'
                        : 'bg-white/50 border-[#E8E3D8] text-stone-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#121316] border-[#121316] text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{displayLabel}</span>
                    </div>
                    <span className="text-stone-400 text-[11px]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW: Product Type value list (accessories) */}
          {activeSubView === 'type' && (
            <div className="p-6 space-y-2 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                Select Product Type
              </span>
              {availableOptions.types.map(type => {
                const isSelected = draftFilters.types.includes(type);
                const count = baseCategoryProducts.filter(p => p.subCategory === type).length;
                return (
                  <label
                    key={type}
                    onClick={() => toggleValue('types', type)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#C5A880] text-stone-900 shadow-xs'
                        : 'bg-white/50 border-[#E8E3D8] text-stone-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#121316] border-[#121316] text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{type}</span>
                    </div>
                    <span className="text-stone-400 text-[11px]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW: Price filter */}
          {activeSubView === 'price' && (
            <div className="p-6 space-y-6 animate-fade-in">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Maximum Budget
                </span>
                <div className="text-2xl font-heading font-semibold text-stone-900 mb-4">
                  Rs. {draftFilters.maxPrice.toLocaleString()}
                </div>
                <input
                  type="range"
                  min={1000}
                  max={15000}
                  step={500}
                  value={draftFilters.maxPrice}
                  onChange={e => setDraftFilters({ ...draftFilters, maxPrice: Number(e.target.value) })}
                  className="w-full accent-[#C5A880] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>Rs. 1,000</span>
                  <span>Rs. 15,000+</span>
                </div>
              </div>

              {/* Quick bracket buttons */}
              <div className="space-y-2 pt-2 border-t border-[#E8E3D8]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Price Brackets
                </span>
                {[
                  { label: 'Under Rs. 5,000', max: 5000 },
                  { label: 'Under Rs. 8,000', max: 8000 },
                  { label: 'Under Rs. 12,000', max: 12000 },
                  { label: 'All Prices (Up to Rs. 15,000)', max: 15000 }
                ].map(bracket => (
                  <button
                    key={bracket.max}
                    onClick={() => setDraftFilters({ ...draftFilters, maxPrice: bracket.max })}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-colors ${
                      draftFilters.maxPrice === bracket.max
                        ? 'bg-white border-[#C5A880] text-stone-900 font-bold'
                        : 'bg-white/50 border-[#E8E3D8] text-stone-700 hover:bg-white'
                    }`}
                  >
                    {bracket.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DRAWER FOOTER: "Remove all" & "Apply" (both always present)                */}
        {/* ========================================================================= */}
        <div className="p-5 border-t border-[#E8E3D8] bg-white flex items-center gap-3">
          <button
            onClick={handleRemoveAll}
            className="flex-1 py-3 px-4 rounded-xl border border-[#E8E3D8] text-stone-700 hover:text-black hover:bg-[#F3EFE8] text-xs font-semibold transition-colors"
          >
            Remove all
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-[#121316] hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Apply ({liveMatchingProducts.length})
          </button>
        </div>
      </div>
    </div>
  );
};
