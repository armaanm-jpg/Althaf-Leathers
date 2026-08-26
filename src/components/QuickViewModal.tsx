import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatINR, calculateDiscount, normalizeImageUrl } from '../utils/format';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, colorName: string, size?: string, quantity?: number) => void;
  onViewFullDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onViewFullDetails,
}) => {
  if (!product) return null;

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const discount = calculateDiscount(product.originalPrice || 0, product.price);

  const handleAdd = () => {
    onAddToCart(product, currentColor.name, selectedSize || undefined, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#faf8f5] rounded-2xl max-w-3xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          id="quickview-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6b5f54] hover:text-[#1a1614] hover:bg-[#ede5da] rounded-full z-20 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Gallery */}
          <div className="p-6 bg-[#f4eee5] flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white shadow-xs mb-4">
              <img
                src={normalizeImageUrl(product.images[activeImageIdx] || currentColor.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#231f1c] text-[#f5efe6] text-[10px] uppercase font-bold tracking-wider rounded shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2">
              {product.images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  id={`quickview-thumb-${i}`}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                    activeImageIdx === i ? 'border-[#8b4513] ring-1 ring-[#8b4513]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={normalizeImageUrl(img)} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-[#8c7b6d] mb-1">
                <span className="uppercase tracking-wider font-semibold text-[#8b4513]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#c19a6b] text-[#c19a6b]" />
                  <span className="font-semibold text-[#231f1c]">{product.rating}</span>
                  <span className="text-[11px]">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl font-bold text-[#1a1614] mb-2">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-2xl font-bold text-[#1a1614]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#9c8e82] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2 py-0.5 bg-[#8b4513]/10 text-[#8b4513] text-xs font-bold rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs text-[#6b5f54] leading-relaxed mb-4 line-clamp-3">
                {product.description}
              </p>

              {/* Color Swatches */}
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52473e] mb-2">
                  Color: <span className="text-[#8b4513]">{currentColor.name}</span>
                </label>
                <div className="flex gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      id={`quickview-color-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => {
                        setSelectedColorIdx(idx);
                        setActiveImageIdx(0);
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColorIdx === idx
                          ? 'border-[#8b4513] ring-2 ring-[#8b4513] ring-offset-2 scale-110'
                          : 'border-black/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52473e] mb-1.5">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        id={`quickview-size-${s.replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                          selectedSize === s
                            ? 'bg-[#231f1c] text-white border-[#231f1c]'
                            : 'bg-white text-[#52473e] border-[#d8ccbe] hover:border-[#8b4513]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#d8ccbe] rounded-xl bg-white px-2">
                  <button
                    id="quickview-qty-dec"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-[#6b5f54] hover:text-[#1a1614] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#1a1614]">{quantity}</span>
                  <button
                    id="quickview-qty-inc"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-[#6b5f54] hover:text-[#1a1614] cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  id="quickview-add-to-bag-btn"
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                    addedSuccess
                      ? 'bg-[#2b6b3e] text-white'
                      : 'bg-[#8b4513] hover:bg-[#72370e] text-white'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Bag • {formatINR(product.price * quantity)}
                    </>
                  )}
                </button>
              </div>

              {/* View Full Product Link */}
              <button
                id="quickview-view-full-btn"
                onClick={() => {
                  onClose();
                  onViewFullDetails(product);
                }}
                className="w-full text-center text-xs text-[#8b4513] hover:text-[#5e2d0a] font-semibold py-1 flex items-center justify-center gap-1 transition cursor-pointer"
              >
                View Full Atelier Specifications & Craftsmanship <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8c7b6d]">
                <Shield className="w-3.5 h-3.5 text-[#8b4513]" />
                <span>Handmade in Proddatur • Est. 2026</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
