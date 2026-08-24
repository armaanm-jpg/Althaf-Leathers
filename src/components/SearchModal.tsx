import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight, Tag, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { formatINR } from '../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToAdmin?: () => void;
  products?: Product[];
}

const SECRET_ADMIN_KEYWORDS = [
  'qwertyadmin123!@#',
  'qwertyadmin123',
  'admin',
  '//admin',
  '/admin',
  ':admin',
  'atelier',
  'secret',
  'sudo',
  'portal',
  'master',
  'althaf',
  'manage',
  'proddatur2026',
  'atelier-admin'
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onNavigateToAdmin,
  products = PRODUCTS,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Check if current search query matches any secret admin trigger
  const isSecretAdminQuery =
    Boolean(normalizedQuery) &&
    (SECRET_ADMIN_KEYWORDS.some((kw) => normalizedQuery === kw || normalizedQuery.startsWith(kw)) ||
      normalizedQuery.startsWith('//') ||
      normalizedQuery.startsWith('/admin'));

  const handleAdminTrigger = () => {
    onClose();
    if (onNavigateToAdmin) {
      onNavigateToAdmin();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSecretAdminQuery) {
      handleAdminTrigger();
      return;
    }
    if (filteredProducts.length > 0) {
      onClose();
      onSelectProduct(filteredProducts[0]);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = normalizedQuery;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.leatherType.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const popularSearches = ['Satchel', 'Bifold Wallet', 'Bridle Belt', 'Folio', 'Full-Grain', 'Tote'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-3 sm:pt-16 px-3 sm:px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#faf8f5] rounded-3xl max-w-2xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden z-10 animate-in fade-in slide-in-from-top-4 duration-200 my-auto sm:my-0">
        
        {/* Search Header */}
        <form
          onSubmit={handleFormSubmit}
          className="p-4 sm:p-5 border-b border-[#e8dfd3] bg-[#f4eee5] flex items-center gap-3"
        >
          <Search className="w-5 h-5 text-[#8b4513] shrink-0" />
          <input
            ref={inputRef}
            id="search-catalog-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search handcrafted bags, wallets, belts, leather..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1a1614] placeholder-[#9c8e82] focus:outline-none min-w-0"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {query && (
            <button
              type="button"
              id="search-clear-btn"
              onClick={() => setQuery('')}
              className="p-2 text-[#8c7b6d] hover:text-[#1a1614] transition cursor-pointer shrink-0"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            id="search-modal-close-btn"
            onClick={onClose}
            className="px-3 py-1.5 bg-[#ede5da] text-xs font-semibold text-[#52473e] hover:bg-[#ded4c6] rounded-lg transition cursor-pointer shrink-0"
          >
            ESC
          </button>
        </form>

        {/* Quick search suggestions */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#ede5da]/50 border-b border-[#e8dfd3] flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[#8c7b6d] shrink-0 flex items-center gap-1 font-medium">
            <Tag className="w-3.5 h-3.5 text-[#8b4513]" /> Suggestions:
          </span>
          {popularSearches.map((term) => (
            <button
              key={term}
              type="button"
              id={`search-tag-${term.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setQuery(term)}
              className="px-3 py-1 bg-white hover:bg-[#8b4513] hover:text-white text-[#52473e] rounded-full border border-[#d8ccbe] shrink-0 transition cursor-pointer text-xs"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[62vh] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-5 space-y-2.5 sm:space-y-3">
          
          {/* Hidden Secret Admin Portal Trigger */}
          {isSecretAdminQuery && (
            <div
              id="search-secret-admin-trigger"
              onClick={handleAdminTrigger}
              className="group p-4 bg-[#231f1c] hover:bg-[#2d2520] text-[#faf8f5] rounded-2xl border border-[#c19a6b]/50 shadow-lg flex items-center justify-between transition-all cursor-pointer animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#c19a6b]/20 border border-[#c19a6b]/40 text-[#c19a6b] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-[#c19a6b] font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Workshop Administration</span>
                  </div>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-[#faf8f5] group-hover:text-[#c19a6b] transition truncate">
                    Atelier Admin Console
                  </h4>
                  <p className="text-xs text-[#a89b8d] truncate">
                    Tap or press Enter to unlock the admin panel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pl-3">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-[#3d332b] text-[11px] font-mono text-[#c19a6b] border border-[#524439]">
                  Enter ↵
                </span>
                <div className="w-8 h-8 rounded-full bg-[#c19a6b] text-[#1a1614] flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {filteredProducts.length === 0 && !isSecretAdminQuery ? (
            <div className="text-center py-10 sm:py-12 text-[#8c7b6d]">
              <p className="font-serif text-base sm:text-lg text-[#231f1c] mb-1">
                No leather goods found for "{query}"
              </p>
              <p className="text-xs text-[#73665a]">
                Try searching for 'satchel', 'wallet', 'belt', or browse our collections.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                id={`search-result-${product.id}`}
                onClick={() => {
                  onClose();
                  onSelectProduct(product);
                }}
                className="group p-3 sm:p-3.5 bg-white hover:bg-[#f4eee5] rounded-2xl border border-[#e8dfd3] hover:border-[#c19a6b] flex items-center justify-between transition cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl bg-[#f5efe6] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#8c7b6d]">
                      <span className="font-semibold uppercase text-[#8b4513]">{product.category}</span>
                      <span>•</span>
                      <span className="truncate">{product.leatherType}</span>
                    </div>
                    <h4 className="font-serif text-xs sm:text-base font-bold text-[#1a1614] group-hover:text-[#8b4513] transition truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#6b5f54]">
                      <Star className="w-3 h-3 fill-[#c19a6b] text-[#c19a6b]" />
                      <span>{product.rating}</span>
                      <span>({product.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2 sm:pl-3 flex items-center gap-2 sm:gap-3">
                  <span className="font-serif text-xs sm:text-base font-bold text-[#1a1614]">
                    {formatINR(product.price)}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ede5da] group-hover:bg-[#8b4513] group-hover:text-white flex items-center justify-center transition">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f4eee5] border-t border-[#e8dfd3] text-center text-xs text-[#8c7b6d] flex items-center justify-between px-4">
          <span className="truncate">Proddatur Workshop Collection</span>
          <span className="font-semibold text-[#52473e]">{filteredProducts.length} items</span>
        </div>

      </div>
    </div>
  );
};
