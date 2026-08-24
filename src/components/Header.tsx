import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ShieldCheck, Sparkles, MapPin, ChevronDown, Wallet, Layers, ArrowRight, Sliders, Footprints, Tag, Building2 } from 'lucide-react';
import { ActivePage, ProductCategory, CategoryMeta, HomePageConfig } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenBulkModal: () => void;
  categories?: CategoryMeta[];
  homeConfig?: HomePageConfig;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  setSelectedCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenBulkModal,
  categories = DEFAULT_CATEGORIES,
  homeConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const announcementText = homeConfig?.announcementText || 'NEW IN 2026 • EVERYDAY LEATHER ESSENTIALS FOR DAILY USE';
  const announcementLocation = homeConfig?.announcementLocation || 'PRODDATUR WORKSHOP';
  const announcementBadge = homeConfig?.announcementBadge || 'SIMPLE & HONEST VALUE';

  const handleMouseEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    setCollectionsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setCollectionsDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  const handleNavClick = (page: ActivePage, category?: ProductCategory) => {
    setActivePage(page);
    if (category) {
      setSelectedCategory(category);
    }
    setCollectionsDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (id: string) => {
    const lower = id.toLowerCase();
    if (lower.includes('bag') || lower.includes('tote') || lower.includes('satchel')) {
      return <ShoppingBag className="w-4 h-4" />;
    }
    if (lower.includes('wallet') || lower.includes('card') || lower.includes('money')) {
      return <Wallet className="w-4 h-4" />;
    }
    if (lower.includes('belt') || lower.includes('strap')) {
      return <Layers className="w-4 h-4" />;
    }
    if (lower.includes('shoe') || lower.includes('boot') || lower.includes('slipper') || lower.includes('footwear')) {
      return <Footprints className="w-4 h-4" />;
    }
    return <Tag className="w-4 h-4" />;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e0d5] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#231f1c] text-[#e8dfd5] py-1.5 sm:py-2 px-3 sm:px-4 text-center uppercase flex items-center justify-center gap-2 sm:gap-4 overflow-hidden">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#c19a6b] font-medium tracking-widest shrink-0">
          <MapPin className="w-3.5 h-3.5" /> {announcementLocation}
        </span>
        <span className="hidden sm:inline text-[#7a7268]">|</span>
        <span className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-semibold sm:font-medium tracking-wider sm:tracking-widest text-[#f5efe6] truncate max-w-full">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#c19a6b] shrink-0" />
          <span className="truncate">{announcementText}</span>
        </span>
        <span className="hidden md:inline text-[#7a7268]">|</span>
        <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#d8c8b4] font-medium tracking-widest shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c19a6b]" /> {announcementBadge}
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#231f1c] hover:text-[#8b4513] hover:bg-[#ede5da] transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Heritage Subtitle */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="inline-flex flex-col items-center lg:items-start group text-left cursor-pointer"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1614] group-hover:text-[#8b4513] transition">
                ALTHAF LEATHERS
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#8c7b6d] font-semibold uppercase -mt-0.5">
                EST. 2026 • PRODDATUR
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <button
              id="nav-home-btn"
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium tracking-wide transition pb-1 border-b-2 cursor-pointer ${
                activePage === 'home'
                  ? 'text-[#8b4513] border-[#8b4513]'
                  : 'text-[#4a423b] border-transparent hover:text-[#1a1614] hover:border-[#c19a6b]'
              }`}
            >
              Home
            </button>

            {/* Collections with Dropdown (Bags, Wallets, Belts, Shoes, Slippers inside) */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-collections-dropdown-btn"
                onClick={() => handleNavClick('shop', 'All')}
                className={`inline-flex items-center gap-1.5 text-sm font-medium tracking-wide transition pb-1 border-b-2 cursor-pointer ${
                  activePage === 'shop'
                    ? 'text-[#8b4513] border-[#8b4513]'
                    : 'text-[#4a423b] border-transparent hover:text-[#1a1614] hover:border-[#c19a6b]'
                }`}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    collectionsDropdownOpen ? 'rotate-180 text-[#8b4513]' : 'text-[#8c7b6d]'
                  }`}
                />
              </button>

              {/* Collections Dropdown Menu */}
              {collectionsDropdownOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-84 bg-white rounded-2xl shadow-xl border border-[#e8dfd3] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3 py-2 border-b border-[#f2ece2] flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8c7b6d]">
                      Handcrafted Collections
                    </span>
                    <button
                      id="dropdown-view-all-link"
                      onClick={() => handleNavClick('shop', 'All')}
                      className="text-[11px] font-bold text-[#8b4513] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        id={`dropdown-item-${cat.id.toLowerCase()}`}
                        onClick={() => handleNavClick('shop', cat.id)}
                        className="w-full px-3 py-2 text-left flex items-center gap-3 group hover:bg-[#faf6f0] transition rounded-xl cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#ede5da] group-hover:bg-[#8b4513] text-[#8b4513] group-hover:text-white transition flex items-center justify-center shrink-0">
                          {getCategoryIcon(cat.id)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-[#231f1c] group-hover:text-[#8b4513] transition">
                              {cat.name}
                            </p>
                            <span className="text-[10px] text-[#8c7b6d] group-hover:text-[#8b4513] transition">
                              Explore
                            </span>
                          </div>
                          <p className="text-[11px] text-[#73665a] truncate">
                            {cat.tagline || 'Handcrafted atelier goods'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-story-btn"
              onClick={() => handleNavClick('story')}
              className={`text-sm font-medium tracking-wide transition pb-1 border-b-2 cursor-pointer ${
                activePage === 'story'
                  ? 'text-[#8b4513] border-[#8b4513]'
                  : 'text-[#4a423b] border-transparent hover:text-[#1a1614] hover:border-[#c19a6b]'
              }`}
            >
              Our Story
            </button>
            <button
              id="nav-contact-btn"
              onClick={() => handleNavClick('contact')}
              className={`text-sm font-medium tracking-wide transition pb-1 border-b-2 cursor-pointer ${
                activePage === 'contact'
                  ? 'text-[#8b4513] border-[#8b4513]'
                  : 'text-[#4a423b] border-transparent hover:text-[#1a1614] hover:border-[#c19a6b]'
              }`}
            >
              Atelier & Contact
            </button>
          </nav>

          {/* Action Icons (Bulk Buy, Search, Wishlist, Cart) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="navbar-bulk-buy-btn"
              onClick={onOpenBulkModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#8b4513]/10 hover:bg-[#8b4513] text-[#8b4513] hover:text-white border border-[#8b4513]/30 transition shadow-2xs cursor-pointer"
              title="Bulk Buy & Wholesale Inquiries"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bulk Buy</span>
            </button>

            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 text-[#3a332d] hover:text-[#8b4513] hover:bg-[#ede5da] rounded-full transition cursor-pointer"
              title="Search Catalog"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 text-[#3a332d] hover:text-[#8b4513] hover:bg-[#ede5da] rounded-full transition cursor-pointer"
              title="View Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#8b4513] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 bg-[#231f1c] text-[#faf8f5] hover:bg-[#8b4513] rounded-full transition shadow-sm cursor-pointer"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c19a6b] text-[#1a1614] text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e8e0d5] bg-[#faf8f5] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-2 pt-2">
            <button
              id="mobile-nav-home"
              onClick={() => handleNavClick('home')}
              className={`w-full p-3 text-left rounded-xl text-sm font-medium transition ${
                activePage === 'home' ? 'bg-[#ede5da] text-[#8b4513] font-semibold' : 'text-[#3a332d] hover:bg-[#f2ece2]'
              }`}
            >
              Home
            </button>

            {/* Mobile Nested Collections Section */}
            <div className="bg-white rounded-2xl border border-[#e8dfd3] p-2 space-y-1">
              <div className="flex items-center justify-between p-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a1614]">Collections</span>
                <button
                  id="mobile-view-all-btn"
                  onClick={() => handleNavClick('shop', 'All')}
                  className="text-xs font-semibold text-[#8b4513] hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    id={`mobile-nav-${cat.id.toLowerCase()}`}
                    onClick={() => handleNavClick('shop', cat.id)}
                    className="p-2.5 text-left rounded-xl text-xs font-semibold text-[#3a332d] hover:bg-[#faf6f0] hover:text-[#8b4513] flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <div className="p-1 rounded-md bg-[#ede5da] text-[#8b4513] shrink-0">
                      {getCategoryIcon(cat.id)}
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              id="mobile-nav-bulk-buy"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBulkModal();
              }}
              className="w-full p-3 text-left rounded-xl text-sm font-semibold transition bg-[#8b4513]/10 text-[#8b4513] hover:bg-[#8b4513] hover:text-white flex items-center gap-2.5 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#8b4513]" />
              <span>Bulk Buy & Corporate Orders</span>
            </button>

            <button
              id="mobile-nav-story"
              onClick={() => handleNavClick('story')}
              className={`w-full p-3 text-left rounded-xl text-sm font-medium transition ${
                activePage === 'story' ? 'bg-[#ede5da] text-[#8b4513] font-semibold' : 'text-[#3a332d] hover:bg-[#f2ece2]'
              }`}
            >
              Our Story
            </button>
            <button
              id="mobile-nav-contact"
              onClick={() => handleNavClick('contact')}
              className={`w-full p-3 text-left rounded-xl text-sm font-medium transition ${
                activePage === 'contact' ? 'bg-[#ede5da] text-[#8b4513] font-semibold' : 'text-[#3a332d] hover:bg-[#f2ece2]'
              }`}
            >
              Atelier & Contact
            </button>
          </div>

          <div className="pt-3 border-t border-[#e8e0d5] flex items-center justify-between text-xs text-[#8c7b6d]">
            <span>Crafted in Proddatur, AP</span>
            <span>Est. 2026</span>
          </div>
        </div>
      )}
    </header>
  );
};


