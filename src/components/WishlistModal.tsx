import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/format';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, colorName: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#faf8f5] rounded-2xl max-w-2xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#e8dfd3] bg-[#f4eee5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#8b4513] fill-[#8b4513]" />
            <h2 className="font-serif text-xl font-bold text-[#1a1614]">
              Saved Pieces ({wishlistItems.length})
            </h2>
          </div>
          <button
            id="wishlist-close-btn"
            onClick={onClose}
            className="p-2 text-[#6b5f54] hover:text-[#1a1614] hover:bg-[#ede5da] rounded-full transition cursor-pointer"
            aria-label="Close Wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-3">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 bg-[#ede5da] rounded-full flex items-center justify-center mx-auto text-[#8c7b6d]">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#231f1c]">
                No items saved to your wishlist yet
              </h3>
              <p className="text-xs text-[#73665a] max-w-xs mx-auto">
                Explore our collections and tap the heart icon on any leather product to save it for later.
              </p>
            </div>
          ) : (
            wishlistItems.map((product) => (
              <div
                key={product.id}
                id={`wishlist-item-${product.id}`}
                className="p-4 bg-white rounded-xl border border-[#e8dfd3] flex items-center justify-between gap-4 shadow-xs"
              >
                <div 
                  className="flex items-center gap-3.5 min-w-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-[#f5efe6] shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b4513]">
                      {product.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#1a1614] truncate hover:text-[#8b4513] transition">
                      {product.name}
                    </h4>
                    <p className="font-serif text-sm font-semibold text-[#1a1614] mt-0.5">
                      {formatINR(product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id={`wishlist-move-to-cart-${product.id}`}
                    onClick={() => {
                      onAddToCart(product, product.colors[0].name);
                      onRemoveFromWishlist(product);
                    }}
                    className="py-2 px-3 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                  </button>
                  <button
                    id={`wishlist-remove-btn-${product.id}`}
                    onClick={() => onRemoveFromWishlist(product)}
                    className="p-2 text-[#9c8e82] hover:text-[#b83b3b] hover:bg-[#faeee8] rounded-lg transition cursor-pointer"
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="p-4 bg-[#f4eee5] border-t border-[#e8dfd3] flex justify-end">
            <button
              id="wishlist-continue-shopping-btn"
              onClick={onClose}
              className="text-xs text-[#8b4513] hover:text-[#5e2d0a] font-semibold flex items-center gap-1 cursor-pointer"
            >
              Continue Browsing Collection <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
