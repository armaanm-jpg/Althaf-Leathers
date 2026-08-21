import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ShieldCheck, Sparkles, MapPin, ChevronDown, Wallet, Layers, ArrowRight } from 'lucide-react';
import { ActivePage, ProductCategory } from '../types';

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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(true);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e0d5] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#231f1c] text-[#e8dfd5] text-xs font-medium py-2 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-2 sm:gap-4 overflow-hidden">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[#c19a6b]">
          <MapPin className="w-3.5 h-3.5" /> PRODDATUR WORKSHOP
        </span>
        <span className="hidden sm:inline text-[#7a7268]">|</span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#c19a6b]" />
          NEW IN 2026 • EVERYDAY LEATHER ESSENTIALS FOR DAILY USE
        </span>
        <span className="hidden md:inline text-[#7a7268]">|</span>
        <span className="hidden md:inline-flex items-center gap-1.5 text-[#d8c8b4]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c19a6b]" /> SIMPLE & HONEST VALUE
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
          <nav className="hidden lg:flex items-center space-x-8">
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

            {/* Collections with Dropdown (Bags, Wallets, Belts inside) */}
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
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-80 bg-white rounded-2xl shadow-xl border border-[#e8dfd3] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
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

                  <div className="space-y-1">
                    {/* Bags */}
                    <button
                      id="dropdown-item-bags"
                      onClick={() => handleNavClick('shop', 'Bags')}
                      className="w-full px-3 py-2.5 text-left flex items-center gap-3 group hover:bg-[#faf6f0] transition rounded-xl cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#ede5da] group-hover:bg-[#8b4513] text-[#8b4513] group-hover:text-white transition flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#231f1c] group-hover:text-[#8b4513] transition">
                            Bags
                          </p>
                          <span className="text-[10px] text-[#8c7b6d] group-hover:text-[#8b4513] transition">Satchels & Messengers</span>
                        </div>
                        <p className="text-[11px] text-[#73665a] truncate">
                          Full-grain hide satchels, briefcases & duffels
                        </p>
                      </div>
                    </button>

                    {/* Wallets */}
                    <button
                      id="dropdown-item-wallets"
                      onClick={() => handleNavClick('shop', 'Wallets')}
                      className="w-full px-3 py-2.5 text-left flex items-center gap-3 group hover:bg-[#faf6f0] transition rounded-xl cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#ede5da] group-hover:bg-[#8b4513] text-[#8b4513] group-hover:text-white transition flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#231f1c] group-hover:text-[#8b4513] transition">
                            Wallets
                          </p>
                          <span className="text-[10px] text-[#8c7b6d] group-hover:text-[#8b4513] transition">Bifolds & Cardholders</span>
                        </div>
                        <p className="text-[11px] text-[#73665a] truncate">
                          Slim bifolds, card sleeves & zip organizers
                        </p>
                      </div>
                    </button>

                    {/* Belts */}
                    <button
                      id="dropdown-item-belts"
                      onClick={() => handleNavClick('shop', 'Belts')}
                      className="w-full px-3 py-2.5 text-left flex items-center gap-3 group hover:bg-[#faf6f0] transition rounded-xl cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#ede5da] group-hover:bg-[#8b4513] text-[#8b4513] group-hover:text-white transition flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#231f1c] group-hover:text-[#8b4513] transition">
                            Belts
                          </p>
                          <span className="text-[10px] text-[#8c7b6d] group-hover:text-[#8b4513] transition">Solid Brass & Bridle</span>
                        </div>
                        <p className="text-[11px] text-[#73665a] truncate">
                          Heavy-duty bridle straps & antique brass buckles
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Secondary categories */}
                  <div className="border-t border-[#f2ece2] mt-2 pt-2 grid grid-cols-2 gap-1 px-1">
                    <button
                      id="dropdown-item-folios"
                      onClick={() => handleNavClick('shop', 'Folios')}
                      className="px-2.5 py-1.5 text-left text-[11px] font-medium text-[#52473e] hover:text-[#8b4513] hover:bg-[#faf6f0] rounded-lg transition cursor-pointer"
                    >
                      • Folios & Sleeves
                    </button>
                    <button
                      id="dropdown-item-accessories"
                      onClick={() => handleNavClick('shop', 'Accessories')}
                      className="px-2.5 py-1.5 text-left text-[11px] font-medium text-[#52473e] hover:text-[#8b4513] hover:bg-[#faf6f0] rounded-lg transition cursor-pointer"
                    >
                      • Key & Tech Goods
                    </button>
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

          {/* Action Icons (Search, Wishlist, Cart) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="p-2.5 text-[#3a332d] hover:text-[#8b4513] hover:bg-[#ede5da] rounded-full transition cursor-pointer"
              title="Search Catalog"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2.5 text-[#3a332d] hover:text-[#8b4513] hover:bg-[#ede5da] rounded-full transition cursor-pointer"
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
              className="relative p-2.5 bg-[#231f1c] text-[#faf8f5] hover:bg-[#8b4513] rounded-full transition shadow-sm cursor-pointer"
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

              <div className="grid grid-cols-1 gap-1">
                <button
                  id="mobile-nav-bags"
                  onClick={() => handleNavClick('shop', 'Bags')}
                  className="p-2.5 text-left rounded-xl text-xs font-semibold text-[#3a332d] hover:bg-[#faf6f0] hover:text-[#8b4513] flex items-center gap-2.5 transition"
                >
                  <div className="p-1 rounded-md bg-[#ede5da] text-[#8b4513]">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span>Bags (Satchels & Messengers)</span>
                </button>

                <button
                  id="mobile-nav-wallets"
                  onClick={() => handleNavClick('shop', 'Wallets')}
                  className="p-2.5 text-left rounded-xl text-xs font-semibold text-[#3a332d] hover:bg-[#faf6f0] hover:text-[#8b4513] flex items-center gap-2.5 transition"
                >
                  <div className="p-1 rounded-md bg-[#ede5da] text-[#8b4513]">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <span>Wallets & Cardholders</span>
                </button>

                <button
                  id="mobile-nav-belts"
                  onClick={() => handleNavClick('shop', 'Belts')}
                  className="p-2.5 text-left rounded-xl text-xs font-semibold text-[#3a332d] hover:bg-[#faf6f0] hover:text-[#8b4513] flex items-center gap-2.5 transition"
                >
                  <div className="p-1 rounded-md bg-[#ede5da] text-[#8b4513]">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span>Bridle Leather Belts</span>
                </button>

                <div className="grid grid-cols-2 gap-1 pt-1 border-t border-[#f0e9df]">
                  <button
                    id="mobile-nav-folios"
                    onClick={() => handleNavClick('shop', 'Folios')}
                    className="p-2 text-left rounded-lg text-[11px] font-medium text-[#52473e] hover:bg-[#faf6f0] hover:text-[#8b4513] transition"
                  >
                    • Folios
                  </button>
                  <button
                    id="mobile-nav-accessories"
                    onClick={() => handleNavClick('shop', 'Accessories')}
                    className="p-2 text-left rounded-lg text-[11px] font-medium text-[#52473e] hover:bg-[#faf6f0] hover:text-[#8b4513] transition"
                  >
                    • Accessories
                  </button>
                </div>
              </div>
            </div>

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

