import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { formatINR, calculateDiscount } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, colorName: string, size?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const displayImage = isHovered && currentColor.secondaryImage
    ? currentColor.secondaryImage
    : currentColor.image;

  const discount = calculateDiscount(product.originalPrice || 0, product.price);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, currentColor.name, product.sizes ? product.sizes[0] : undefined);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-[#ffffff] rounded-xl border border-[#e8dfd3] hover:border-[#c19a6b] hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div 
        className="relative aspect-square w-full bg-[#f5efe6] overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 bg-[#231f1c] text-[#f5efe6] text-[10px] uppercase font-bold tracking-wider rounded shadow-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-[#8b4513] text-[#ffffff] text-[10px] font-bold tracking-wider rounded shadow-sm">
              SAVE {discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm z-10 cursor-pointer ${
            isWishlisted
              ? 'bg-[#8b4513] text-white scale-110'
              : 'bg-white/80 text-[#3a332d] hover:bg-white hover:text-[#8b4513]'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Trigger */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-10">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={handleQuickViewClick}
            className="flex-1 py-2.5 px-3 bg-white/95 text-[#231f1c] hover:bg-[#231f1c] hover:text-white rounded-lg text-xs font-semibold tracking-wide shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
          
          <button
            id={`quick-add-btn-${product.id}`}
            onClick={handleQuickAdd}
            className={`p-2.5 rounded-lg text-xs font-semibold shadow-md transition flex items-center justify-center cursor-pointer ${
              justAdded
                ? 'bg-[#2b6b3e] text-white'
                : 'bg-[#231f1c] text-white hover:bg-[#8b4513]'
            }`}
            title="Quick Add to Bag"
            aria-label="Quick Add to Bag"
          >
            {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#8c7b6d] mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#8b4513]">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#c19a6b] text-[#c19a6b]" />
              <span className="font-semibold text-[#231f1c]">{product.rating}</span>
              <span className="text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-serif text-base sm:text-lg font-bold text-[#1a1614] group-hover:text-[#8b4513] transition cursor-pointer line-clamp-1 mb-1"
          >
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-[#6b5f54] line-clamp-1 mb-3">
            {product.tagline}
          </p>
        </div>

        <div>
          {/* Color Swatches */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.colors.map((color, idx) => (
                <button
                  key={color.name}
                  id={`swatch-${product.id}-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColorIdx(idx);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                    selectedColorIdx === idx
                      ? 'ring-2 ring-[#8b4513] ring-offset-1 scale-110 border-white'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
              <span className="text-[10px] text-[#8c7b6d] ml-1">
                {currentColor.name}
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="pt-2 border-t border-[#f0e9df] flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-base sm:text-lg font-bold text-[#1a1614]">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#9c8e82] line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#8c7b6d] font-medium">
              {product.leatherType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
