import React, { useState, useMemo } from 'react';
import { PRODUCTS, matchesCollectionSubCategory } from '../data/products';
import type { ProductCategory } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useNavigation } from '../context/NavigationContext';
import { FilterPanel, DEFAULT_FILTER_VALUES } from '../components/FilterPanel';
import type { FilterValues } from '../components/FilterPanel';
import { SEO, getBreadcrumbSchema } from '../components/SEO';
import { Filter, X, SlidersHorizontal, ArrowUpDown, ChevronRight } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { params, navigateTo, openCategory } = useNavigation();

  // Category & sub-category come from navigation params. App remounts this page
  // whenever params change, so filter state below always starts from the link.
  const selectedCategory = params.category || 'all';
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Active filters managed as a unified structured state
  const [filters, setFilters] = useState<FilterValues>(() => ({
    brands: params.brand ? [params.brand] : [],
    shapes: params.filterShape ? [params.filterShape] : [],
    colors: params.lensColor ? [params.lensColor] : [],
    materials: [],
    rims: [],
    disposabilities: params.disposability ? [params.disposability] : [],
    types: [],
    maxPrice: 15000
  }));

  const decodedSubCategory = params.subCategory || undefined;

  // Calculate active filter count (excluding default maxPrice of 15000)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.brands.length;
    count += filters.shapes.length;
    count += filters.colors.length;
    count += filters.materials.length;
    count += filters.rims.length;
    count += filters.disposabilities.length;
    count += filters.types.length;
    if (filters.maxPrice < 15000) count += 1;
    return count;
  }, [filters]);

  // Filter products by category, subcategory, and all active multi-select filters
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Subcategory filter (Men’s, Women’s, Active, Kids, Toric, Lens Care, etc.)
      if (decodedSubCategory && !matchesCollectionSubCategory(product, decodedSubCategory)) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0) {
        if (!filters.brands.some(b => product.brand.toLowerCase().includes(b.toLowerCase()))) {
          return false;
        }
      }

      // Frame Shape filter
      if (filters.shapes.length > 0) {
        if (!product.frameShape || !filters.shapes.includes(product.frameShape)) {
          return false;
        }
      }

      // Color filter
      if (filters.colors.length > 0) {
        if (selectedCategory === 'color-contacts') {
          if (!product.lensColor || !filters.colors.includes(product.lensColor)) return false;
        } else {
          const hasColor = product.availableColors.some(c => filters.colors.includes(c.name));
          if (!hasColor) return false;
        }
      }

      // Material filter
      if (filters.materials.length > 0) {
        if (!product.frameMaterial || !filters.materials.includes(product.frameMaterial)) {
          return false;
        }
      }

      // Rim filter
      if (filters.rims.length > 0) {
        const pRim = product.rimType || 'Full Rim';
        if (!filters.rims.includes(pRim)) return false;
      }

      // Disposability filter
      if (filters.disposabilities.length > 0) {
        if (!product.disposability || !filters.disposabilities.includes(product.disposability)) {
          return false;
        }
      }

      // Product type filter
      if (filters.types.length > 0) {
        if (!filters.types.includes(product.subCategory)) {
          return false;
        }
      }

      // Price filter
      if (product.price > filters.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, decodedSubCategory, filters, sortBy]);

  // Remove individual filter value
  const removeFilterValue = (key: keyof FilterValues, val: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).filter(item => item !== val)
    }));
  };

  const resetPrice = () => {
    setFilters(prev => ({ ...prev, maxPrice: 15000 }));
  };

  const removeAllFilters = () => {
    setFilters(DEFAULT_FILTER_VALUES);
  };

  // Title calculation
  const getCategoryTitle = () => {
    if (decodedSubCategory) return decodedSubCategory;
    if (selectedCategory === 'eyeglasses') return 'Prescription Eyeglasses';
    if (selectedCategory === 'sunglasses') return 'Polarized & UV400 Sunglasses';
    if (selectedCategory === 'tint-eyeglasses') return 'Federal Tints & Transitions';
    if (selectedCategory === 'clear-contacts') return 'Clear Contact Lenses';
    if (selectedCategory === 'color-contacts') return 'Color Contact Lenses';
    if (selectedCategory === 'accessories') return 'Glasses Care & Accessories';
    return 'Complete Eyewear Collection';
  };

  return (
    <div className="site-container py-8 md:py-12">
      <SEO
        title={`${getCategoryTitle()} Price in Pakistan — Designer Eyewear Collection`}
        description={`Shop ${getCategoryTitle()} online at Federal Optical. Discover authentic branded frames, blue cut computer lenses, UV polarized shades, and contact lenses in Karachi with nationwide cash on delivery across Pakistan.`}
        canonical={decodedSubCategory ? `/catalog/${selectedCategory}?subCategory=${encodeURIComponent(decodedSubCategory)}` : `/catalog/${selectedCategory}`}
        type="website"
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: getCategoryTitle(), url: `/catalog/${selectedCategory}` }
        ])}
      />
      {/* Breadcrumb Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-3">
          <button onClick={() => navigateTo('home')} className="hover:text-black cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-stone-900 font-medium">{getCategoryTitle()}</span>
        </nav>

        {/* Category Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E3D8] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
              Federal Optical Collection
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900 mt-1">
              {getCategoryTitle()}
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Showing {filteredProducts.length} certified optical models. Hand-adjusted and clinic-verified before dispatch.
            </p>
          </div>

          {/* Action Toolbar: Filter Button + Sort selector */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Filter Drawer Toggle Button */}
            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className="px-4 py-2.5 rounded-full border border-[#E8E3D8] bg-white hover:bg-[#F3EFE8] text-xs font-semibold flex items-center gap-2 text-stone-900 transition-colors shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C7048]" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#121316] text-white text-[11px] font-bold flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort selector */}
            <div className="flex items-center gap-2 border border-[#E8E3D8] rounded-full px-4 py-2 bg-white text-xs shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-stone-900 font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Department / Category Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar border-b border-[#E8E3D8]/60 text-xs">
          {([
            { id: 'all', label: 'All Catalog' },
            { id: 'eyeglasses', label: 'Eyeglasses' },
            { id: 'sunglasses', label: 'Sunglasses' },
            { id: 'tint-eyeglasses', label: 'Federal Tints' },
            { id: 'clear-contacts', label: 'Clear Contacts' },
            { id: 'color-contacts', label: 'Color Contacts' },
            { id: 'accessories', label: 'Care & Accessories' }
          ] as const)
            // hide departments that currently have no products (e.g. Federal Tints)
            .filter(dept => dept.id === 'all' || PRODUCTS.some(p => p.category === dept.id))
            .map(dept => (
            <button
              key={dept.id}
              // switching department clears the sub-category and filters
              onClick={() => openCategory(dept.id)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === dept.id
                  ? 'bg-[#121316] text-white font-semibold'
                  : 'bg-white border border-[#E8E3D8] text-stone-700 hover:bg-[#F3EFE8]'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* Active Filters Pill Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs text-stone-500 font-medium">Active Filters:</span>
            
            {/* Brand Pills */}
            {filters.brands.map(brand => (
              <span
                key={brand}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A880]/25 text-xs font-semibold text-stone-900 border border-[#C5A880]/50"
              >
                <span>Brand: {brand}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-700"
                  onClick={() => removeFilterValue('brands', brand)}
                />
              </span>
            ))}

            {/* Shape Pills */}
            {filters.shapes.map(shape => (
              <span
                key={shape}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8E3D8] text-xs font-medium text-stone-800"
              >
                <span className="capitalize">Shape: {shape}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-700"
                  onClick={() => removeFilterValue('shapes', shape)}
                />
              </span>
            ))}

            {/* Color Pills */}
            {filters.colors.map(color => (
              <span
                key={color}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8E3D8] text-xs font-medium text-stone-800"
              >
                <span>Color: {color}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-700"
                  onClick={() => removeFilterValue('colors', color)}
                />
              </span>
            ))}

            {/* Material Pills */}
            {filters.materials.map(mat => (
              <span
                key={mat}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8E3D8] text-xs font-medium text-stone-800"
              >
                <span>Material: {mat}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-700"
                  onClick={() => removeFilterValue('materials', mat)}
                />
              </span>
            ))}

            {/* Rim Pills */}
            {filters.rims.map(rim => (
              <span
                key={rim}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8E3D8] text-xs font-medium text-stone-800"
              >
                <span>Rim: {rim}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-700"
                  onClick={() => removeFilterValue('rims', rim)}
                />
              </span>
            ))}

            {/* Disposability Pills */}
            {filters.disposabilities.map(disp => (
              <span
                key={disp}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8E3D8] text-xs font-medium text-stone-800"
              >
                <span className="capitalize">Disposability: {disp}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-700"
                  onClick={() => removeFilterValue('disposabilities', disp)}
                />
              </span>
            ))}

            {/* Product Type Pills */}
            {filters.types.map(type => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8E3D8] text-xs font-medium text-stone-800"
              >
                <span>Type: {type}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-700"
                  onClick={() => removeFilterValue('types', type)}
                />
              </span>
            ))}

            {/* Price Pill */}
            {filters.maxPrice < 15000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8E3D8] text-xs font-medium text-stone-800">
                <span>≤ Rs. {filters.maxPrice.toLocaleString()}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-700"
                  onClick={resetPrice}
                />
              </span>
            )}

            {/* Remove all action */}
            <button
              onClick={removeAllFilters}
              className="text-xs text-[#8C7048] hover:underline font-semibold ml-2 cursor-pointer"
            >
              Remove all
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULL-WIDTH RESPONSIVE PRODUCT GRID                                        */}
      {/* ========================================================================= */}
      <div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E3D8] p-8 space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F3EFE8] flex items-center justify-center text-stone-400">
              <Filter className="w-8 h-8 text-[#8C7048]" />
            </div>
            <h3 className="font-heading text-2xl font-semibold text-stone-800">
              No matching optical products found
            </h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              Try widening your price range or clearing brand and shape filters to discover available stock.
            </p>
            <button
              onClick={removeAllFilters}
              className="px-6 py-2.5 rounded-full bg-[#121316] text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Remove All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* REUSABLE CATEGORY-SPECIFIC FILTER PANEL                                    */}
      {/* ========================================================================= */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        category={(selectedCategory as ProductCategory | 'all') || 'all'}
        subCategory={decodedSubCategory}
        allProducts={PRODUCTS}
        currentFilters={filters}
        onApplyFilters={setFilters}
        onRemoveAll={removeAllFilters}
      />
    </div>
  );
};

export default CategoryPage;
