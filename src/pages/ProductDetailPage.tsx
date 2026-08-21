import React, { useState } from 'react';
import {
  Star,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingBag,
  ArrowLeft,
  Building2,
  Check,
  Award
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatINR, calculateDiscount } from '../utils/format';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBackToShop: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, colorName: string, size?: string, monogram?: string, qty?: number) => void;
  onBuyNow: (product: Product, colorName: string, size?: string, monogram?: string, qty?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenBulkModal: (product: Product) => void;
  wishlistIds: string[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBackToShop,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  onOpenBulkModal,
  wishlistIds,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : '');
  const [monogram, setMonogram] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const discount = calculateDiscount(product.originalPrice || 0, product.price);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, currentColor.name, selectedSize || undefined, monogram || undefined, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, currentColor.name, selectedSize || undefined, monogram || undefined, quantity);
  };

  // Recommended related items
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      
      {/* Breadcrumbs & Back button */}
      <div className="flex items-center justify-between text-xs text-[#8c7b6d] border-b border-[#e8dfd3] pb-4">
        <button
          id="pdp-back-btn"
          onClick={onBackToShop}
          className="inline-flex items-center gap-1 text-[#8b4513] hover:text-[#5e2d0a] font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Collections
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span>Home</span>
          <span>/</span>
          <span>Collections</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-[#231f1c] font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Multi-Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-[#f4eee5] border border-[#e8dfd3] shadow-sm">
            <img
              src={product.images[activeImageIdx] || currentColor.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#231f1c] text-[#f5efe6] text-xs uppercase font-bold tracking-wider rounded shadow-md">
                {product.badge}
              </span>
            )}
            <button
              id="pdp-wishlist-btn"
              onClick={() => onToggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition cursor-pointer ${
                isWishlisted ? 'bg-[#8b4513] text-white' : 'bg-white/80 text-[#231f1c] hover:bg-white hover:text-[#8b4513]'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                id={`pdp-thumb-${i}`}
                onClick={() => setActiveImageIdx(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer bg-[#f4eee5] ${
                  activeImageIdx === i
                    ? 'border-[#8b4513] ring-2 ring-[#8b4513]/30 opacity-100 scale-102'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.name} angle ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Workshop Badge */}
          <div className="p-3.5 bg-[#ede5da] rounded-xl border border-[#ded4c6] flex items-center justify-between text-xs text-[#52473e]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#8b4513]" />
              <span>Handmade in Proddatur, AP</span>
            </div>
            <span className="font-semibold text-[#8b4513]">Est. 2026</span>
          </div>
        </div>

        {/* Right Column: Purchasing & Specifications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            {/* Category & Ratings */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="uppercase tracking-widest font-bold text-[#8b4513]">
                {product.category} • {product.leatherType}
              </span>
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#e8dfd3]">
                <Star className="w-3.5 h-3.5 fill-[#c19a6b] text-[#c19a6b]" />
                <span className="font-bold text-[#1a1614]">{product.rating}</span>
                <span className="text-[#8c7b6d]">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1614] tracking-tight">
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-sm text-[#6b5f54] mt-1.5 leading-relaxed">
              {product.tagline}
            </p>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-serif text-3xl font-bold text-[#1a1614]">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-[#9c8e82] line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="px-2.5 py-1 bg-[#8b4513]/10 text-[#8b4513] text-xs font-bold rounded-md">
                  SAVE {discount}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#8c7b6d] mt-1">
              Inclusive of all GST taxes. Complimentary express courier dispatch.
            </p>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5 pt-2">
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#52473e]">
              <span>Color / Hide: <span className="text-[#8b4513]">{currentColor.name}</span></span>
              <span className="text-[11px] text-[#8c7b6d] font-normal">Natural vegetable dye</span>
            </label>
            <div className="flex items-center gap-3">
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  id={`pdp-color-swatch-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setSelectedColorIdx(idx);
                    setActiveImageIdx(0);
                  }}
                  className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                    selectedColorIdx === idx
                      ? 'border-[#8b4513] ring-2 ring-[#8b4513] ring-offset-2 scale-110'
                      : 'border-black/20 hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={c.name}
                >
                  {selectedColorIdx === idx && (
                    <Check className={`w-4 h-4 ${c.name === 'Midnight Black' || c.name === 'Espresso Brown' ? 'text-white' : 'text-[#1a1614]'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection (if available) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#52473e]">
                <span>Select Dimensions / Size</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    id={`pdp-size-${s.replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      selectedSize === s
                        ? 'bg-[#231f1c] text-white border-[#231f1c] shadow-xs'
                        : 'bg-white text-[#52473e] border-[#d8ccbe] hover:border-[#8b4513]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Complimentary Hot-Stamp Monogram Customization */}
          <div className="p-4 bg-[#f2ece2] rounded-2xl border border-[#ded4c6] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#231f1c] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#c19a6b]" /> Complimentary Monogramming
              </span>
              <span className="text-[11px] text-[#8c7b6d]">Blind Deboss or Foil</span>
            </div>
            <p className="text-[11px] text-[#6b5f54]">
              Personalize with up to 3 initials hand-stamped on the leather flap by our artisans in Proddatur.
            </p>
            <input
              id="pdp-monogram-input"
              type="text"
              maxLength={3}
              value={monogram}
              onChange={(e) => setMonogram(e.target.value.toUpperCase())}
              placeholder="e.g. A.L."
              className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-xs uppercase tracking-widest text-[#1a1614] placeholder-[#9c8e82] focus:outline-none focus:border-[#8b4513]"
            />
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#d8ccbe] rounded-xl bg-white px-3">
                <button
                  id="pdp-qty-dec"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-[#6b5f54] hover:text-[#1a1614] cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#1a1614]">{quantity}</span>
                <button
                  id="pdp-qty-inc"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-[#6b5f54] hover:text-[#1a1614] cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                id="pdp-add-to-bag-btn"
                onClick={handleAddToCartClick}
                className={`flex-1 py-3.5 px-5 rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  addedAnimation
                    ? 'bg-[#2b6b3e] text-white'
                    : 'bg-[#231f1c] hover:bg-[#8b4513] text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Your Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Bag • {formatINR(product.price * quantity)}
                  </>
                )}
              </button>
            </div>

            {/* Buy Now Immediate Checkout */}
            <button
              id="pdp-buy-now-btn"
              onClick={handleBuyNowClick}
              className="w-full py-3.5 bg-[#8b4513] hover:bg-[#72370e] text-white rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-md cursor-pointer"
            >
              Buy Now with 1-Click Checkout
            </button>

            {/* Corporate / Bulk Order CTA */}
            <button
              id="pdp-bulk-inquiry-btn"
              onClick={() => onOpenBulkModal(product)}
              className="w-full py-2.5 bg-white border border-[#d8ccbe] hover:border-[#8b4513] text-[#52473e] hover:text-[#8b4513] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" /> Corporate Gifting / Bulk Orders (10+ Units)
            </button>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#e8dfd3] text-center text-[11px] text-[#73665a]">
            <div className="space-y-1">
              <Truck className="w-4 h-4 mx-auto text-[#8b4513]" />
              <p className="font-semibold text-[#231f1c]">Direct Dispatch</p>
              <p>From Proddatur, AP</p>
            </div>
            <div className="space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-[#8b4513]" />
              <p className="font-semibold text-[#231f1c]">7-Day Exchange</p>
              <p>Simple support</p>
            </div>
            <div className="space-y-1">
              <Shield className="w-4 h-4 mx-auto text-[#8b4513]" />
              <p className="font-semibold text-[#231f1c]">New in 2026</p>
              <p>Local craftsmanship</p>
            </div>
          </div>

          {/* ACCORDIONS FOR DETAILED SPECS */}
          <div className="border-t border-[#e8dfd3] pt-4 space-y-2">
            
            {/* 1. Specs & Dimensions */}
            <div className="border border-[#e8dfd3] rounded-xl overflow-hidden bg-white">
              <button
                id="accordion-specs-btn"
                onClick={() => toggleAccordion('specs')}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#231f1c] hover:bg-[#faf8f5] transition cursor-pointer"
              >
                <span>Dimensions & Hardware Specifications</span>
                {openAccordion === 'specs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'specs' && (
                <div className="p-4 pt-0 text-xs text-[#6b5f54] space-y-2 border-t border-[#f0e9df] mt-2">
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div><strong>Dimensions:</strong> {product.dimensions}</div>
                    <div><strong>Weight:</strong> {product.weight}</div>
                    <div><strong>Hardware:</strong> {product.hardware}</div>
                    <div><strong>Lining:</strong> {product.lining}</div>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 pt-2">
                    {product.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Materials & Craftsmanship */}
            <div className="border border-[#e8dfd3] rounded-xl overflow-hidden bg-white">
              <button
                id="accordion-craft-btn"
                onClick={() => toggleAccordion('craft')}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#231f1c] hover:bg-[#faf8f5] transition cursor-pointer"
              >
                <span>Materials & Vegetable Tanning</span>
                {openAccordion === 'craft' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'craft' && (
                <div className="p-4 pt-0 text-xs text-[#6b5f54] space-y-2 border-t border-[#f0e9df] mt-2">
                  <p className="leading-relaxed pt-2">
                    {product.description}
                  </p>
                  <ul className="list-disc pl-4 space-y-1 pt-1">
                    {product.craftsmanshipNotes.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 3. Leather Care & Patina Evolution */}
            <div className="border border-[#e8dfd3] rounded-xl overflow-hidden bg-white">
              <button
                id="accordion-care-btn"
                onClick={() => toggleAccordion('care')}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#231f1c] hover:bg-[#faf8f5] transition cursor-pointer"
              >
                <span>Leather Care & Patina Guide</span>
                {openAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'care' && (
                <div className="p-4 pt-0 text-xs text-[#6b5f54] space-y-2 border-t border-[#f0e9df] mt-2">
                  <p className="leading-relaxed pt-2">
                    Vegetable-tanned full-grain leather is an organic, breathing material. With age and natural exposure to oils and sunlight, it develops a deep, rich, golden-brown patina unique to your habits.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 pt-1">
                    {product.careInstructions.map((ci, idx) => (
                      <li key={idx}>{ci}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* COMPLETE THE LOOK / YOU MAY ALSO LIKE */}
      <section className="pt-10 border-t border-[#e8dfd3]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">Pairing Recommendations</span>
            <h3 className="font-serif text-2xl font-bold text-[#1a1614]">Complete the Look</h3>
          </div>
          <button
            id="pdp-view-all-similar"
            onClick={onBackToShop}
            className="text-xs font-semibold text-[#8b4513] hover:underline cursor-pointer"
          >
            View Entire Atelier Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((relProduct) => (
            <ProductCard
              key={relProduct.id}
              product={relProduct}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(relProduct.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
