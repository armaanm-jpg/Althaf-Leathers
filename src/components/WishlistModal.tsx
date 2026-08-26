import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatINR, calculateDiscount, normalizeImageUrl } from '../utils/format';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, colorName: string, size?: string, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToShop?: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
  onNavigateToShop,
}) => {
  if (!isOpen) return null;

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative bg-[#faf8f5] rounded-3xl max-w-2xl w-full border border-[#ded4c6] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e8dfd3] bg-[#f4eee5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ede5da] border border-[#ded4c6] flex items-center justify-center text-[#8b4513]">
              <Heart className="w-5 h-5 fill-[#8b4513]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1a1614]">
                  Saved Pieces
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ede5da] text-[#8b4513] border border-[#ded4c6]">
                  {wishlistItems.length}
                </span>
              </div>
              <p className="text-xs text-[#73665a]">
                Your personal curation of handcrafted full-grain leather goods
              </p>
            </div>
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4 space-y-4">
              <div className="w-16 h-16 bg-[#ede5da] border border-[#ded4c6] rounded-2xl flex items-center justify-center mx-auto text-[#8c7b6d] shadow-xs">
                <Heart className="w-8 h-8 text-[#8c7b6d]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#231f1c]">
                  Your Wishlist is Currently Empty
                </h3>
                <p className="text-xs sm:text-sm text-[#73665a] max-w-sm mx-auto leading-relaxed">
                  Explore our handcrafted leather satchels, bifold wallets, bridle belts, and footwear to save your favorite pieces.
                </p>
              </div>
              <div className="pt-2">
                <button
                  id="wishlist-empty-shop-btn"
                  onClick={() => {
                    onClose();
                    if (onNavigateToShop) onNavigateToShop();
                  }}
                  className="px-6 py-3 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Explore Collections
                </button>
              </div>
            </div>
          ) : (
            wishlistItems.map((product) => {
              const rawPrimaryImage = (product.images && product.images[0]) || (product.colors && product.colors[0]?.image) || '';
              const primaryImage = normalizeImageUrl(rawPrimaryImage);
              const primaryColorName = (product.colors && product.colors[0]?.name) || 'Natural';
              const discount = calculateDiscount(product.originalPrice || 0, product.price);

              return (
                <div
                  key={product.id}
                  id={`wishlist-item-${product.id}`}
                  className="p-4 bg-white rounded-2xl border border-[#e8dfd3] hover:border-[#c19a6b]/70 transition-all duration-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  {/* Left: Thumbnail & Details */}
                  <div
                    className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer w-full sm:w-auto"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                  >
                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-[#f4eee5] border border-[#e8dfd3] shrink-0 shadow-2xs">
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {product.badge && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#231f1c]/90 text-[#f5efe6] text-[9px] font-bold uppercase rounded tracking-wider">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b4513]">
                          {product.category}
                        </span>
                        <span className="text-[#c7baa8]">•</span>
                        <span className="text-[10px] text-[#73665a] font-medium">
                          {product.leatherType || 'Full-Grain'}
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-bold text-[#1a1614] truncate group-hover:text-[#8b4513] transition">
                        {product.name}
                      </h4>

                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="font-serif text-base font-bold text-[#1a1614]">
                          {formatINR(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-xs text-[#8c7b6d] line-through">
                              {formatINR(product.originalPrice)}
                            </span>
                            {discount > 0 && (
                              <span className="text-[10px] font-bold text-[#2b6b3e] bg-[#eef7f0] px-1.5 py-0.5 rounded">
                                {discount}% OFF
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <p className="text-[11px] text-[#2b6b3e] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 shrink-0" /> In Stock • Ready to dispatch
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0e9df] shrink-0">
                    <button
                      id={`wishlist-view-btn-${product.id}`}
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="p-2.5 bg-[#ede5da] hover:bg-[#ded4c6] text-[#3a332d] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      title="View full piece details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="sm:hidden text-xs">View</span>
                    </button>

                    <button
                      id={`wishlist-move-to-cart-${product.id}`}
                      onClick={() => {
                        onAddToCart(product, primaryColorName);
                        onRemoveFromWishlist(product);
                      }}
                      className="flex-1 sm:flex-initial py-2.5 px-4 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                    </button>

                    <button
                      id={`wishlist-remove-btn-${product.id}`}
                      onClick={() => onRemoveFromWishlist(product)}
                      className="p-2.5 text-[#9c8e82] hover:text-[#b83b3b] hover:bg-[#faeee8] rounded-xl transition cursor-pointer"
                      title="Remove from saved pieces"
                      aria-label="Remove from saved pieces"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#f4eee5] border-t border-[#e8dfd3] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-[#73665a] text-center sm:text-left">
              <span>Total Curation Value: </span>
              <strong className="font-serif text-sm font-bold text-[#1a1614] ml-1">
                {formatINR(totalValue)}
              </strong>
            </div>

            <div className="flex items-center gap-4">
              <button
                id="wishlist-continue-shopping-btn"
                onClick={() => {
                  onClose();
                  if (onNavigateToShop) onNavigateToShop();
                }}
                className="text-xs font-bold text-[#8b4513] hover:text-[#5e2d0a] uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
              >
                Continue Browsing Collections <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
