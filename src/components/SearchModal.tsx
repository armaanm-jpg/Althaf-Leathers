import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight, Tag } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { formatINR } from '../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = PRODUCTS.filter((p) => {
    const q = query.toLowerCase().trim();
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#faf8f5] rounded-2xl max-w-2xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden z-10 animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-[#e8dfd3] bg-[#f4eee5] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8b4513] shrink-0" />
          <input
            ref={inputRef}
            id="search-catalog-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search handcrafted bags, wallets, belts, leather types..."
            className="flex-1 bg-transparent text-base sm:text-lg text-[#1a1614] placeholder-[#9c8e82] focus:outline-none"
          />
          {query && (
            <button
              id="search-clear-btn"
              onClick={() => setQuery('')}
              className="p-1 text-[#8c7b6d] hover:text-[#1a1614] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            id="search-modal-close-btn"
            onClick={onClose}
            className="px-2.5 py-1 bg-[#ede5da] text-xs font-semibold text-[#52473e] hover:bg-[#ded4c6] rounded-md transition cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Quick search tags */}
        <div className="px-5 py-3 bg-[#ede5da]/50 border-b border-[#e8dfd3] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#8c7b6d] shrink-0 flex items-center gap-1 font-medium">
            <Tag className="w-3.5 h-3.5" /> Suggestions:
          </span>
          {popularSearches.map((term) => (
            <button
              key={term}
              id={`search-tag-${term.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 bg-white hover:bg-[#8b4513] hover:text-white text-[#52473e] rounded-full border border-[#d8ccbe] shrink-0 transition cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-[#8c7b6d]">
              <p className="font-serif text-lg text-[#231f1c] mb-1">No leather goods found for "{query}"</p>
              <p className="text-xs text-[#73665a]">Try searching for 'satchel', 'wallet', 'belt', or 'accessories'.</p>
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
                className="group p-3 bg-white hover:bg-[#f4eee5] rounded-xl border border-[#e8dfd3] hover:border-[#c19a6b] flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg bg-[#f5efe6] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-[#8c7b6d]">
                      <span className="font-semibold uppercase text-[#8b4513]">{product.category}</span>
                      <span>•</span>
                      <span>{product.leatherType}</span>
                    </div>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#1a1614] group-hover:text-[#8b4513] transition truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-[#6b5f54]">
                      <Star className="w-3 h-3 fill-[#c19a6b] text-[#c19a6b]" />
                      <span>{product.rating}</span>
                      <span>({product.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3 flex items-center gap-3">
                  <span className="font-serif text-sm sm:text-base font-bold text-[#1a1614]">
                    {formatINR(product.price)}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#ede5da] group-hover:bg-[#8b4513] group-hover:text-white flex items-center justify-center transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f4eee5] border-t border-[#e8dfd3] text-center text-xs text-[#8c7b6d]">
          Showing {filteredProducts.length} items from Proddatur Atelier Collection
        </div>

      </div>
    </div>
  );
};
