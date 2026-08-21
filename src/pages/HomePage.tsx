import React from 'react';
import { ArrowRight, Sparkles, Shield, Award, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { REVIEWS } from '../data/products';
import { formatINR } from '../utils/format';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, colorName: string, size?: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onNavigateToShop: (category?: ProductCategory) => void;
  onNavigateToStory: () => void;
  onOpenBulkModal: (product?: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  onNavigateToShop,
  onNavigateToStory,
  onOpenBulkModal,
}) => {
  const satchel = products.find((p) => p.id === 'heritage-satchel') || products[0];
  const bifold = products.find((p) => p.id === 'classic-bifold-wallet');
  const belt = products.find((p) => p.id === 'artisan-dress-belt');
  const duffel = products.find((p) => p.id === 'weekender-duffel');
  const folio = products.find((p) => p.id === 'traveler-folio');
  const tote = products.find((p) => p.id === 'signature-tote');

  const categories = [
    {
      name: 'Leather Bags' as ProductCategory,
      cat: 'Bags' as ProductCategory,
      count: 'Satchels, Totes & Duffels',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Bifold Wallets' as ProductCategory,
      cat: 'Wallets' as ProductCategory,
      count: 'Slim Bifolds & Cardholders',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Bridle Belts' as ProductCategory,
      cat: 'Belts' as ProductCategory,
      count: '4mm Solid Steerhide',
      image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Tech & Folios' as ProductCategory,
      cat: 'Folios' as ProductCategory,
      count: 'A4 & Padfolio Sleeves',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Small Accessories' as ProductCategory,
      cat: 'Accessories' as ProductCategory,
      count: 'Coasters & Organizer Rolls',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[640px] sm:min-h-[720px] bg-[#1a1614] flex items-center justify-center overflow-hidden">
        {/* Background Image with Warm Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1800&auto=format&fit=crop"
            alt="Althaf Leathers Handcrafted Satchel in Atelier"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14100e]/95 via-[#1a1614]/80 to-[#14100e]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 py-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c19a6b]/20 border border-[#c19a6b]/40 text-[#f5efe6] text-xs font-semibold tracking-widest uppercase backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-[#c19a6b]" />
            PRODDATUR WORKSHOP • EST. 2026
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#faf8f5] tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Practical Leather for Everyday Life.
          </h1>

          <p className="text-base sm:text-xl text-[#d4c8b8] max-w-2xl mx-auto font-light leading-relaxed">
            Everyday leather goods crafted in Proddatur, Andhra Pradesh. Honest, budget-friendly satchels, wallets, and belts designed for daily utility.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-shop-collection-btn"
              onClick={() => onNavigateToShop('All')}
              className="w-full sm:w-auto px-8 py-4 bg-[#c19a6b] hover:bg-[#d8af7e] text-[#1a1614] rounded-xl font-bold text-sm tracking-wider uppercase transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-read-story-btn"
              onClick={onNavigateToStory}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-[#faf8f5] rounded-xl font-semibold text-sm tracking-wider uppercase border border-white/20 backdrop-blur-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Our Story
            </button>
          </div>

          {/* Quick Badges */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left border-t border-white/10">
            <div className="flex items-center gap-2.5 text-xs text-[#d8c8b4]">
              <CheckCircle2 className="w-4 h-4 text-[#c19a6b] shrink-0" />
              <span>Everyday Leather</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#d8c8b4]">
              <CheckCircle2 className="w-4 h-4 text-[#c19a6b] shrink-0" />
              <span>Brass Hardware</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#d8c8b4]">
              <CheckCircle2 className="w-4 h-4 text-[#c19a6b] shrink-0" />
              <span>Crafted in Proddatur</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#d8c8b4]">
              <CheckCircle2 className="w-4 h-4 text-[#c19a6b] shrink-0" />
              <span>Est. 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED ESSENTIALS (Bento Grid Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">
              Curated Essentials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1614] mt-1">
              Atelier Signatures
            </h2>
          </div>
          <button
            id="view-all-essentials-btn"
            onClick={() => onNavigateToShop('All')}
            className="mt-3 md:mt-0 text-sm font-semibold text-[#8b4513] hover:text-[#5e2d0a] inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            View All Collections <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Large Hero Feature: The Heritage Satchel */}
          <div 
            id="bento-heritage-satchel"
            onClick={() => onSelectProduct(satchel)}
            className="group md:col-span-2 relative bg-white rounded-2xl border border-[#e8dfd3] hover:border-[#c19a6b] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="relative aspect-4/3 sm:aspect-16/9 w-full bg-[#f4eee5] overflow-hidden">
              <img
                src={satchel.images[0]}
                alt={satchel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-[#231f1c] text-[#f5efe6] text-xs uppercase font-bold tracking-wider rounded-md shadow-sm">
                  Signature Bestseller
                </span>
                <span className="px-2.5 py-1 bg-[#8b4513] text-white text-xs font-bold rounded-md shadow-sm">
                  Full-Grain
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8b4513]">
                  Handcrafted Satchel
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1614] group-hover:text-[#8b4513] transition">
                  {satchel.name}
                </h3>
                <p className="text-sm text-[#6b5f54] mt-1 max-w-md">
                  {satchel.tagline} • Fits 15" laptop with solid antiqued brass hardware.
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                <span className="font-serif text-2xl font-bold text-[#1a1614]">
                  {formatINR(satchel.price)}
                </span>
                <button
                  id="bento-satchel-quickview-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(satchel);
                  }}
                  className="px-5 py-2.5 bg-[#231f1c] hover:bg-[#8b4513] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Quick View
                </button>
              </div>
            </div>
          </div>

          {/* Right Bento Column: Wallet & Editorial Card */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Classic Bifold */}
            {bifold && (
              <div
                id="bento-bifold-wallet"
                onClick={() => onSelectProduct(bifold)}
                className="group bg-white rounded-2xl border border-[#e8dfd3] hover:border-[#c19a6b] p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-[#f4eee5] mb-4">
                  <img
                    src={bifold.images[0]}
                    alt={bifold.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#231f1c] text-white text-[10px] uppercase font-bold tracking-wider rounded">
                    New Arrival
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-semibold text-[#8b4513]">Wallets</span>
                    <span className="font-serif text-lg font-bold text-[#1a1614]">{formatINR(bifold.price)}</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#1a1614] group-hover:text-[#8b4513] transition">
                    {bifold.name}
                  </h4>
                  <p className="text-xs text-[#6b5f54] line-clamp-1 mt-0.5">{bifold.tagline}</p>
                </div>
              </div>
            )}

            {/* Editorial Leather Story Card */}
            <div className="bg-[#231f1c] text-[#faf8f5] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-[#c19a6b] font-bold">
                  The Art of Leather
                </span>
                <h4 className="font-serif text-xl font-bold leading-snug">
                  Vegetable Tanned for Patina & Character
                </h4>
                <p className="text-xs text-[#b8ab9d] leading-relaxed">
                  We use tree barks and natural tannins. As you carry your piece through sunshine and rain, it records your personal journey.
                </p>
              </div>
              <button
                id="bento-learn-craft-btn"
                onClick={onNavigateToStory}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#c19a6b] hover:text-white transition cursor-pointer"
              >
                Learn About Our Craft <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Second Row of Featured Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {belt && (
            <ProductCard
              product={belt}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(belt.id)}
              onToggleWishlist={onToggleWishlist}
            />
          )}
          {duffel && (
            <ProductCard
              product={duffel}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(duffel.id)}
              onToggleWishlist={onToggleWishlist}
            />
          )}
          {folio && (
            <ProductCard
              product={folio}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(folio.id)}
              onToggleWishlist={onToggleWishlist}
            />
          )}
        </div>
      </section>

      {/* EXPLORE BY CATEGORIES */}
      <section className="bg-[#f4eee5] py-16 sm:py-20 border-y border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">
              Curated Classifications
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1614] mt-1">
              Explore by Category
            </h2>
            <p className="text-sm text-[#6b5f54] mt-2">
              From spacious executive travel duffels to tailored dress belts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((c) => (
              <div
                key={c.name}
                id={`cat-card-${c.cat.toLowerCase()}`}
                onClick={() => onNavigateToShop(c.cat)}
                className="group bg-white rounded-2xl border border-[#e8dfd3] hover:border-[#c19a6b] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                <div className="aspect-4/3 w-full bg-[#ede5da] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#1a1614] group-hover:text-[#8b4513] transition">
                    {c.name}
                  </h3>
                  <p className="text-[11px] text-[#8c7b6d] mt-0.5">{c.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND HERITAGE SPOTLIGHT: The Proddatur Atelier */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#231f1c] text-[#faf8f5] rounded-3xl overflow-hidden border border-[#3d332b] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Atelier Photo */}
            <div className="relative min-h-[380px] lg:min-h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop"
                alt="Master Craftsman stitching leather in Proddatur Atelier"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#231f1c] via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-6 left-6 bg-[#1a1614]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs text-[#d8c8b4]">
                <span>Proddatur Workshop • Est. 2026</span>
              </div>
            </div>

            {/* Right: Narrative & Highlights */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#c19a6b]">
                  <Award className="w-4 h-4" /> Founded in Proddatur (2026)
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Handmade Everyday Leather from Proddatur.
                </h2>
                <p className="text-sm sm:text-base text-[#b8ab9d] leading-relaxed">
                  Based in Proddatur, Andhra Pradesh, Althaf Leathers started in 2026 to offer everyday bags, bifolds, wallets, and belts designed for real-world functionality and affordable daily use.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 bg-[#2d2520] rounded-xl border border-[#3d332b]">
                    <h4 className="font-serif text-sm font-bold text-[#f5efe6] mb-1">Hand-Assembled</h4>
                    <p className="text-xs text-[#9e9082]">Hand-cut and assembled locally with neat stitching for practical daily durability.</p>
                  </div>
                  <div className="p-3.5 bg-[#2d2520] rounded-xl border border-[#3d332b]">
                    <h4 className="font-serif text-sm font-bold text-[#f5efe6] mb-1">Functional Hardware</h4>
                    <p className="text-xs text-[#9e9082]">Sturdy metal buckles, snap buttons, and smooth zipper closures.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#3d332b]">
                <button
                  id="atelier-story-btn"
                  onClick={onNavigateToStory}
                  className="px-6 py-3.5 bg-[#c19a6b] hover:bg-[#d8af7e] text-[#1a1614] rounded-xl font-bold text-xs tracking-wider uppercase transition cursor-pointer"
                >
                  Read Our Full Story
                </button>
                <button
                  id="atelier-bulk-btn"
                  onClick={() => onOpenBulkModal(satchel)}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-[#faf8f5] rounded-xl font-semibold text-xs tracking-wider uppercase border border-white/20 transition cursor-pointer"
                >
                  Corporate & Bulk Gifting
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COLLECTOR REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">
            Verified Collectors
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1614] mt-1">
            Words from Discerning Owners
          </h2>
          <p className="text-sm text-[#6b5f54] mt-2">
            Read real experiences from patrons across Bengaluru, Hyderabad, Mumbai, and Chennai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-[#e8dfd3] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c19a6b] text-[#c19a6b]" />
                  ))}
                </div>
                <h4 className="font-serif text-base font-bold text-[#1a1614] leading-snug">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-[#6b5f54] leading-relaxed italic">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-[#f0e9df] text-xs">
                <p className="font-bold text-[#1a1614]">{rev.author}</p>
                <p className="text-[#8c7b6d]">{rev.location}</p>
                <div className="flex items-center gap-1 text-[11px] text-[#2b6b3e] font-semibold mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Purchase • {rev.productName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORPORATE / BESPOKE CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#ede5da] rounded-3xl p-8 sm:p-12 border border-[#ded4c6] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8b4513]">
              Bespoke & Wholesale
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1614]">
              Looking for Corporate Gifting or Custom Leather Commissions?
            </h3>
            <p className="text-sm text-[#6b5f54] max-w-xl">
              We offer personalized debossing, gold-foil stamping, bespoke size alterations, and tiered wholesale pricing for executive gifting.
            </p>
          </div>

          <button
            id="home-bulk-inquire-cta-btn"
            onClick={() => onOpenBulkModal()}
            className="px-8 py-4 bg-[#8b4513] hover:bg-[#72370e] text-white rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-md whitespace-nowrap cursor-pointer"
          >
            Inquire for Bulk Orders
          </button>
        </div>
      </section>

    </div>
  );
};
