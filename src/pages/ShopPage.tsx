import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Search, X, Check, ArrowUpDown, ChevronDown, Sparkles } from 'lucide-react';
import { Product, ProductCategory, CategoryMeta } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatINR } from '../utils/format';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { LEATHER_COLOR_PALETTE } from '../data/colors';

interface ShopPageProps {
  products: Product[];
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, colorName: string, size?: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  categories?: CategoryMeta[];
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  categories = DEFAULT_CATEGORIES,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeatherTypes, setSelectedLeatherTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const categoryOptions = useMemo(() => {
    const list: ProductCategory[] = ['All', ...categories.map((c) => c.id)];
    return list;
  }, [categories]);

  const leatherTypes = ['Full-Grain', 'Vegetable-Tanned', 'Top-Grain'];

  // Top leather colors for quick filtering
  const filterColors = useMemo(() => {
    return [
      { name: 'Tan', hex: '#C19A6B' },
      { name: 'Dark Brown', hex: '#3B2F2F' },
      { name: 'Black', hex: '#1C1B1A' },
      { name: 'Cognac', hex: '#9E472A' },
      { name: 'Mahogany', hex: '#4E2728' },
      { name: 'Burgundy', hex: '#632837' },
    ];
  }, []);

  const toggleLeatherType = (type: string) => {
    setSelectedLeatherTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedLeatherTypes([]);
    setSelectedColors([]);
    setMaxPrice(25000);
    setSortBy('featured');
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchTagline && !matchDesc) return false;
        }

        // Leather Type
        if (selectedLeatherTypes.length > 0 && !selectedLeatherTypes.includes(p.leatherType)) {
          return false;
        }

        // Color
        if (selectedColors.length > 0) {
          const hasColor = p.colors.some((c) =>
            selectedColors.some(
              (selected) =>
                c.name.toLowerCase().includes(selected.toLowerCase()) ||
                selected.toLowerCase().includes(c.name.toLowerCase())
            )
          );
          if (!hasColor) return false;
        }

        // Price
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.badge === 'New Arrival' ? 1 : 0) - (a.badge === 'New Arrival' ? 1 : 0);
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, selectedLeatherTypes, selectedColors, maxPrice, sortBy]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0) +
    selectedLeatherTypes.length +
    selectedColors.length +
    (maxPrice < 25000 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10">
      
      {/* Mobile Top Header (Compact & Clean) */}
      <div className="mb-4 sm:mb-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#8b4513]">
              Proddatur Leather Workshop
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1a1614] leading-tight">
              {selectedCategory === 'All' ? 'Our Collections' : selectedCategory}
            </h1>
          </div>

          {/* Quick Search Toggle for Mobile */}
          <div className="sm:hidden flex items-center gap-1.5">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Search items"
              className={`p-2 rounded-xl border transition cursor-pointer ${
                mobileSearchOpen || searchQuery
                  ? 'bg-[#8b4513] text-white border-[#8b4513]'
                  : 'bg-white text-[#52473e] border-[#ded4c6]'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Search input dropdown */}
        {mobileSearchOpen && (
          <div className="sm:hidden mt-3 pt-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9c8e82]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bags, wallets, belts, shoes..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-[#8b4513] rounded-xl text-xs placeholder-[#9c8e82] focus:outline-none shadow-xs"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[#8c7b6d] hover:text-[#1a1614]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        <p className="hidden sm:block text-xs sm:text-sm text-[#6b5f54] mt-1 max-w-2xl">
          Everyday genuine leather bags, bifold wallets, belts, shoes, and handcrafted accessories dispatching directly from Proddatur.
        </p>
      </div>

      {/* Category Chips (Clean Multi-Row Wrapping - No Horizontal Scrollbar) */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                id={`shop-cat-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#231f1c] text-white shadow-xs ring-1 ring-black/10'
                    : 'bg-white text-[#52473e] border border-[#e0d6c9] hover:border-[#8b4513] hover:text-[#8b4513]'
                }`}
              >
                <span>{cat === 'All' ? 'All Items' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#ede5da] text-[#73665a]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Sticky Control Bar (Filter & Sort) */}
      <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-white rounded-xl sm:rounded-2xl border border-[#e8dfd3] shadow-xs mb-4">
        {/* Filter Trigger Button */}
        <button
          id="mobile-filters-trigger"
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f4eee5] hover:bg-[#ede5da] text-[#1a1614] rounded-lg text-xs font-bold transition cursor-pointer lg:hidden"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#8b4513]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 bg-[#8b4513] text-white rounded-full text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Results count */}
        <span className="text-[11px] sm:text-xs text-[#73665a] font-medium">
          Showing <strong className="text-[#1a1614] font-bold">{filteredProducts.length}</strong> items
        </span>

        {/* Sort Select */}
        <div className="flex items-center gap-1 sm:gap-2">
          <label htmlFor="shop-sort-select" className="hidden sm:inline text-xs text-[#8c7b6d] font-semibold whitespace-nowrap">
            Sort:
          </label>
          <select
            id="shop-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#f8f5f0] sm:bg-white border border-[#ded4c6] rounded-lg px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-[#231f1c] focus:outline-none focus:border-[#8b4513] cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        
        {/* DESKTOP SIDEBAR FILTERS (Hidden on Mobile) */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-[#e8dfd3] shadow-xs h-fit sticky top-24">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#f0e9df]">
            <h3 className="font-serif text-base font-bold text-[#1a1614] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#8b4513]" /> Filter Pieces
            </h3>
            {hasActiveFilters && (
              <button
                id="reset-filters-btn"
                onClick={resetAllFilters}
                className="text-xs text-[#8b4513] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Search within catalog */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#52473e] mb-2">
              Search by Name
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9c8e82]" />
              <input
                id="shop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pieces..."
                className="w-full pl-9 pr-3 py-2 bg-[#faf8f5] border border-[#d8ccbe] rounded-lg text-xs placeholder-[#9c8e82] focus:outline-none focus:border-[#8b4513]"
              />
            </div>
          </div>

          {/* Leather Type Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#52473e] mb-2.5">
              Material & Tannage
            </label>
            <div className="space-y-2">
              {leatherTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2.5 text-xs text-[#3a332d] hover:text-[#1a1614] cursor-pointer"
                >
                  <input
                    id={`filter-leather-${type.toLowerCase()}`}
                    type="checkbox"
                    checked={selectedLeatherTypes.includes(type)}
                    onChange={() => toggleLeatherType(type)}
                    className="rounded text-[#8b4513] focus:ring-[#8b4513] accent-[#8b4513]"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Swatch Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#52473e] mb-2.5">
              Leather Color
            </label>
            <div className="grid grid-cols-2 gap-2">
              {filterColors.map((color) => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    id={`filter-color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => toggleColor(color.name)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 text-xs transition cursor-pointer ${
                      isSelected
                        ? 'border-[#8b4513] bg-[#ede5da] font-bold text-[#1a1614]'
                        : 'border-[#d8ccbe] bg-[#faf8f5] text-[#52473e] hover:border-[#b8ab9d]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="truncate text-[11px]">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#52473e] mb-2">
              <span>Max Budget</span>
              <span className="text-[#8b4513] font-bold">{formatINR(maxPrice)}</span>
            </div>
            <input
              id="shop-price-slider"
              type="range"
              min="1500"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#8b4513] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8c7b6d] mt-1">
              <span>₹1,500</span>
              <span>₹25,000+</span>
            </div>
          </div>

        </div>

        {/* PRODUCTS GRID CONTAINER */}
        <div className="lg:col-span-3">
          
          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 p-2.5 sm:p-3 bg-[#ede5da]/70 rounded-xl border border-[#ded4c6]">
              <span className="text-[11px] sm:text-xs font-bold text-[#52473e]">Filters:</span>
              
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#d8ccbe] rounded-full text-[11px] font-medium text-[#231f1c]">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="text-[#9c8e82] hover:text-[#1a1614] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#d8ccbe] rounded-full text-[11px] font-medium text-[#231f1c]">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="text-[#9c8e82] hover:text-[#1a1614] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedLeatherTypes.map((type) => (
                <span key={type} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#d8ccbe] rounded-full text-[11px] font-medium text-[#231f1c]">
                  {type}
                  <button onClick={() => toggleLeatherType(type)} className="text-[#9c8e82] hover:text-[#1a1614] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {selectedColors.map((color) => (
                <span key={color} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#d8ccbe] rounded-full text-[11px] font-medium text-[#231f1c]">
                  {color}
                  <button onClick={() => toggleColor(color)} className="text-[#9c8e82] hover:text-[#1a1614] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {maxPrice < 25000 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#d8ccbe] rounded-full text-[11px] font-medium text-[#231f1c]">
                  ≤ {formatINR(maxPrice)}
                  <button onClick={() => setMaxPrice(25000)} className="text-[#9c8e82] hover:text-[#1a1614] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-[11px] sm:text-xs text-[#8b4513] hover:underline font-bold ml-auto cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Products Grid (Mobile 2-column, Desktop 3-column) */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e8dfd3] p-8 sm:p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-[#ede5da] rounded-full flex items-center justify-center mx-auto text-[#8c7b6d]">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1614]">
                No items match your selected filters
              </h3>
              <p className="text-xs text-[#73665a] max-w-sm mx-auto">
                Try widening your price range, choosing another category, or clearing color filters.
              </p>
              <button
                id="empty-grid-reset-btn"
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-xl text-xs font-bold tracking-wide transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* MOBILE BOTTOM SHEET / DRAWER FILTERS */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#faf8f5] shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
              
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#e8dfd3]">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1a1614]">Refine Catalog</h3>
                    <p className="text-[11px] text-[#8c7b6d]">{filteredProducts.length} items matching</p>
                  </div>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 rounded-full bg-white border border-[#ded4c6] text-[#6b5f54]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories Quick Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#52473e] mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {categoryOptions.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-2 rounded-lg text-xs font-semibold text-left truncate transition ${
                            isSelected
                              ? 'bg-[#231f1c] text-white'
                              : 'bg-white text-[#3a332d] border border-[#e0d6c9]'
                          }`}
                        >
                          {cat === 'All' ? 'All Pieces' : cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Leather Materials */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#52473e] mb-2">
                    Leather Type
                  </label>
                  <div className="space-y-1.5">
                    {leatherTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#e0d6c9] text-xs text-[#3a332d] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLeatherTypes.includes(type)}
                          onChange={() => toggleLeatherType(type)}
                          className="accent-[#8b4513] rounded"
                        />
                        <span className="font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Swatches */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#52473e] mb-2">
                    Leather Color
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {filterColors.map((color) => {
                      const isSelected = selectedColors.includes(color.name);
                      return (
                        <button
                          key={color.name}
                          onClick={() => toggleColor(color.name)}
                          className={`p-1.5 rounded-lg border text-left flex items-center gap-2 text-xs transition ${
                            isSelected
                              ? 'border-[#8b4513] bg-[#ede5da] font-bold text-[#1a1614]'
                              : 'border-[#e0d6c9] bg-white text-[#52473e]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="truncate text-[11px]">{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Max Price Slider & Quick Presets */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#52473e] mb-1.5">
                    <span>Max Price</span>
                    <span className="text-[#8b4513]">{formatINR(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="25000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#8b4513]"
                  />
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    {[3000, 6000, 25000].map((p) => (
                      <button
                        key={p}
                        onClick={() => setMaxPrice(p)}
                        className={`py-1 rounded text-[10px] font-semibold border ${
                          maxPrice === p ? 'bg-[#8b4513] text-white border-[#8b4513]' : 'bg-white text-[#52473e] border-[#e0d6c9]'
                        }`}
                      >
                        {p === 25000 ? 'Any Price' : `Under ${formatINR(p)}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-4 mt-4 border-t border-[#e8dfd3] space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#8b4513] hover:bg-[#72370e] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition"
                >
                  Show {filteredProducts.length} Results
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="w-full py-2 bg-[#ede5da] text-[#231f1c] rounded-xl text-xs font-bold transition"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
