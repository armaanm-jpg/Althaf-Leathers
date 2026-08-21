import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Search, X, Check } from 'lucide-react';
import { Product, ProductCategory, FilterState } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatINR } from '../utils/format';

interface ShopPageProps {
  products: Product[];
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, colorName: string, size?: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeatherTypes, setSelectedLeatherTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories: ProductCategory[] = ['All', 'Bags', 'Wallets', 'Belts', 'Folios', 'Accessories'];
  const leatherTypes = ['Full-Grain', 'Vegetable-Tanned', 'Top-Grain'];
  const availableColors = [
    { name: 'Heritage Tan', hex: '#c19a6b' },
    { name: 'Espresso Brown', hex: '#3b2f2f' },
    { name: 'Midnight Black', hex: '#1a1a1a' },
    { name: 'Oxblood Burgundy', hex: '#592329' },
  ];

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
          const hasColor = p.colors.some((c) => selectedColors.includes(c.name));
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

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    selectedLeatherTypes.length > 0 ||
    selectedColors.length > 0 ||
    maxPrice < 25000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Catalog Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">
          Proddatur Atelier Showcase
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1a1614]">
          Our Collections
        </h1>
        <p className="text-sm sm:text-base text-[#6b5f54] leading-relaxed">
          Discover our everyday leather goods. Practical satchels, wallets, belts, and accessories handcrafted in Proddatur for your daily routine.
        </p>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`shop-pill-${cat.toLowerCase()}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#231f1c] text-[#faf8f5] shadow-md'
                : 'bg-white text-[#52473e] border border-[#e8dfd3] hover:border-[#8b4513] hover:text-[#8b4513]'
            }`}
          >
            {cat === 'All' ? 'All Pieces' : cat}
          </button>
        ))}
      </div>

      {/* Active Bar: Results count, Sort & Mobile filter button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#e8dfd3]">
        <div className="flex items-center gap-3">
          <button
            id="mobile-filters-trigger"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 bg-white border border-[#d8ccbe] rounded-lg text-xs font-semibold text-[#231f1c] flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#8b4513]" /> Filters
          </button>

          <span className="text-xs sm:text-sm text-[#73665a] font-medium">
            Showing <strong className="text-[#1a1614]">{filteredProducts.length}</strong> handcrafted pieces
          </span>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs text-[#8c7b6d] font-semibold whitespace-nowrap">Sort By:</label>
          <select
            id="shop-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-xs font-medium text-[#231f1c] focus:outline-none focus:border-[#8b4513] cursor-pointer"
          >
            <option value="featured">Featured Atelier Pieces</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Additions</option>
          </select>
        </div>
      </div>

      {/* Main Catalog Layout (Sidebar + Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-[#e8dfd3] shadow-xs h-fit sticky top-28">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#f0e9df]">
            <h3 className="font-serif text-base font-bold text-[#1a1614] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#8b4513]" /> Refine Collection
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#52473e] mb-2">
              Search Pieces
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9c8e82]" />
              <input
                id="shop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-9 pr-3 py-2 bg-[#faf8f5] border border-[#d8ccbe] rounded-lg text-xs placeholder-[#9c8e82] focus:outline-none focus:border-[#8b4513]"
              />
            </div>
          </div>

          {/* Leather Type Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#52473e] mb-2.5">
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#52473e] mb-2.5">
              Leather Hue
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableColors.map((color) => {
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

        {/* PRODUCT GRID CONTAINER */}
        <div className="lg:col-span-3">
          
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#ede5da]/60 rounded-xl border border-[#ded4c6]">
              <span className="text-xs font-bold text-[#52473e]">Active:</span>
              
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#d8ccbe] rounded-full text-xs font-medium text-[#231f1c]">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="text-[#9c8e82] hover:text-[#1a1614] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedLeatherTypes.map((type) => (
                <span key={type} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#d8ccbe] rounded-full text-xs font-medium text-[#231f1c]">
                  {type}
                  <button onClick={() => toggleLeatherType(type)} className="text-[#9c8e82] hover:text-[#1a1614] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {selectedColors.map((color) => (
                <span key={color} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#d8ccbe] rounded-full text-xs font-medium text-[#231f1c]">
                  Color: {color}
                  <button onClick={() => toggleColor(color)} className="text-[#9c8e82] hover:text-[#1a1614] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {maxPrice < 25000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#d8ccbe] rounded-full text-xs font-medium text-[#231f1c]">
                  Max: {formatINR(maxPrice)}
                  <button onClick={() => setMaxPrice(25000)} className="text-[#9c8e82] hover:text-[#1a1614] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-xs text-[#8b4513] hover:underline font-semibold ml-auto cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e8dfd3] p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-[#ede5da] rounded-full flex items-center justify-center mx-auto text-[#8c7b6d]">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1a1614]">
                No handcrafted pieces match your criteria
              </h3>
              <p className="text-xs text-[#73665a] max-w-sm mx-auto">
                Try widening your price range or clearing color and category filters.
              </p>
              <button
                id="empty-grid-reset-btn"
                onClick={resetAllFilters}
                className="px-6 py-2.5 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* MOBILE DRAWER FILTERS */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#faf8f5] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#e8dfd3]">
                  <h3 className="font-serif text-lg font-bold text-[#1a1614]">Refine Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-[#6b5f54]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52473e] mb-2">
                    Category
                  </label>
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                          selectedCategory === cat ? 'bg-[#231f1c] text-white' : 'hover:bg-[#ede5da] text-[#3a332d]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leather types */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52473e] mb-2">
                    Material
                  </label>
                  <div className="space-y-2">
                    {leatherTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2 text-xs text-[#3a332d]">
                        <input
                          type="checkbox"
                          checked={selectedLeatherTypes.includes(type)}
                          onChange={() => toggleLeatherType(type)}
                          className="accent-[#8b4513]"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#52473e] mb-2">
                    <span>Max Price</span>
                    <span>{formatINR(maxPrice)}</span>
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
                </div>
              </div>

              <div className="pt-6 border-t border-[#e8dfd3] space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#8b4513] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Apply ({filteredProducts.length} results)
                </button>
                <button
                  onClick={resetAllFilters}
                  className="w-full py-2 bg-[#ede5da] text-[#231f1c] rounded-xl text-xs font-semibold"
                >
                  Reset
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
