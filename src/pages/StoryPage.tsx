import React from 'react';
import { ArrowRight, CheckCircle2, Award, Sparkles, Shield, Heart, MapPin, Scissors, Flame, Compass, Package } from 'lucide-react';
import { ProductCategory } from '../types';

interface StoryPageProps {
  onNavigateToShop: (cat?: ProductCategory) => void;
  onNavigateToContact: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ onNavigateToShop, onNavigateToContact }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* STORY HERO */}
      <section className="relative min-h-[500px] sm:min-h-[580px] bg-[#1a1614] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1800&auto=format&fit=crop"
            alt="Proddatur Leather Workshop"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14100e] via-[#1a1614]/75 to-[#14100e]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 py-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c19a6b]/20 border border-[#c19a6b]/40 text-[#f5efe6] text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#c19a6b]" />
            PRODDATUR, ANDHRA PRADESH • EST. 2026
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#faf8f5] tracking-tight leading-tight">
            Everyday Leather, Built for Real Life.
          </h1>

          <p className="text-base sm:text-xl text-[#d4c8b8] max-w-2xl mx-auto font-light leading-relaxed">
            Started fresh in 2026 in Proddatur, we assemble simple, accessible, and functional leather accessories designed for your daily routine.
          </p>
        </div>
      </section>

      {/* CHAPTER 1: THE PRODDATUR STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">
              Chapter I • The Beginning
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1614] leading-tight">
              A Fresh Start in Proddatur.
            </h2>
            <p className="text-sm sm:text-base text-[#6b5f54] leading-relaxed">
              Althaf Leathers is a new workshop established in 2026 in Proddatur, Kadapa district, Andhra Pradesh. We started with a clear aim: to make simple, practical leather bags, wallets, and belts that are accessible for everyday use.
            </p>
            <p className="text-sm sm:text-base text-[#6b5f54] leading-relaxed">
              As a young local business, we focus on straightforward utility, reliable assembly, and fair pricing without unnecessary markups.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-[#e8dfd3] shadow-xs">
                <p className="font-serif text-2xl font-bold text-[#8b4513]">2026</p>
                <p className="text-xs text-[#73665a] mt-0.5">Founded in Proddatur, AP</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#e8dfd3] shadow-xs">
                <p className="font-serif text-2xl font-bold text-[#8b4513]">Daily Utility</p>
                <p className="text-xs text-[#73665a] mt-0.5">Bags, Wallets & Belts</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#e8dfd3]">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop"
              alt="Crafting leather goods in Proddatur"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#1a1614]/85 backdrop-blur-md p-4 rounded-xl text-xs text-[#d8c8b4] border border-white/10">
              <span className="font-semibold text-white">Workshop Focus:</span> "Providing honest, everyday leather goods directly from our local workshop."
            </div>
          </div>

        </div>
      </section>

      {/* CHAPTER 2: PRACTICAL MATERIALS */}
      <section className="bg-[#f4eee5] py-16 sm:py-20 border-y border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden shadow-xl border border-[#ded4c6]">
              <img
                src="https://images.unsplash.com/photo-1524498250077-390f9e378fc0?q=80&w=1000&auto=format&fit=crop"
                alt="Leather materials"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">
                Chapter II • Everyday Design
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1614] leading-tight">
                Functional & Budget-Friendly.
              </h2>
              <p className="text-sm sm:text-base text-[#6b5f54] leading-relaxed">
                We design our products for real-world daily commute and utility. Rather than making exaggerated claims, we prioritize practical features and affordable prices.
              </p>
              
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8b4513] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#3a332d]">
                    <strong>Practical Layouts:</strong> Dedicated card slots, comfortable handles, and easy-access zip compartments.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8b4513] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#3a332d]">
                    <strong>Standard Hardware:</strong> Metal rivets, sturdy buckles, and smooth zippers for everyday reliability.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8b4513] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#3a332d]">
                    <strong>Direct Dispatch:</strong> Packed and shipped directly from our Proddatur workshop across India.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CHAPTER 3: BY THE NUMBERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">
            About Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1614] mt-1">
            Althaf Leathers at a Glance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 bg-white rounded-2xl border border-[#e8dfd3] shadow-xs text-center space-y-2">
            <div className="w-12 h-12 bg-[#ede5da] text-[#8b4513] rounded-full flex items-center justify-center mx-auto mb-2">
              <Compass className="w-6 h-6" />
            </div>
            <p className="font-serif text-4xl font-bold text-[#1a1614]">2026</p>
            <h4 className="font-serif text-sm font-bold text-[#8b4513]">Year Started</h4>
            <p className="text-xs text-[#73665a]">Established in Proddatur, Andhra Pradesh.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-[#e8dfd3] shadow-xs text-center space-y-2">
            <div className="w-12 h-12 bg-[#ede5da] text-[#8b4513] rounded-full flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="font-serif text-4xl font-bold text-[#1a1614]">AP</p>
            <h4 className="font-serif text-sm font-bold text-[#8b4513]">Proddatur Location</h4>
            <p className="text-xs text-[#73665a]">Local assembly and direct courier dispatch.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-[#e8dfd3] shadow-xs text-center space-y-2">
            <div className="w-12 h-12 bg-[#ede5da] text-[#8b4513] rounded-full flex items-center justify-center mx-auto mb-2">
              <Scissors className="w-6 h-6" />
            </div>
            <p className="font-serif text-4xl font-bold text-[#1a1614]">3+</p>
            <h4 className="font-serif text-sm font-bold text-[#8b4513]">Core Categories</h4>
            <p className="text-xs text-[#73665a]">Bags, Wallets, Belts & Everyday Accessories.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-[#e8dfd3] shadow-xs text-center space-y-2">
            <div className="w-12 h-12 bg-[#ede5da] text-[#8b4513] rounded-full flex items-center justify-center mx-auto mb-2">
              <Package className="w-6 h-6" />
            </div>
            <p className="font-serif text-4xl font-bold text-[#1a1614]">All-India</p>
            <h4 className="font-serif text-sm font-bold text-[#8b4513]">Direct Delivery</h4>
            <p className="text-xs text-[#73665a]">Standard flat courier delivery to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* 4-STEP WORKSHOP PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#231f1c] text-[#faf8f5] rounded-3xl p-8 sm:p-14 border border-[#3d332b]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#c19a6b]">
              Our Workshop
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              How Our Products Are Made
            </h2>
            <p className="text-xs sm:text-sm text-[#b8ab9d]">
              Carefully cut, stitched, and inspected in our Proddatur workshop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-[#2d2520] rounded-2xl border border-[#3d332b] space-y-3">
              <span className="font-serif text-3xl font-bold text-[#c19a6b]">01</span>
              <h4 className="font-serif text-base font-bold text-[#f5efe6]">Material Sourcing</h4>
              <p className="text-xs text-[#9e9082] leading-relaxed">
                Selecting leather sheets and hardware suited for everyday functional accessories.
              </p>
            </div>

            <div className="p-5 bg-[#2d2520] rounded-2xl border border-[#3d332b] space-y-3">
              <span className="font-serif text-3xl font-bold text-[#c19a6b]">02</span>
              <h4 className="font-serif text-base font-bold text-[#f5efe6]">Pattern Cutting</h4>
              <p className="text-xs text-[#9e9082] leading-relaxed">
                Cutting wallet card slots, belt straps, and bag panels to accurate dimensions.
              </p>
            </div>

            <div className="p-5 bg-[#2d2520] rounded-2xl border border-[#3d332b] space-y-3">
              <span className="font-serif text-3xl font-bold text-[#c19a6b]">03</span>
              <h4 className="font-serif text-base font-bold text-[#f5efe6]">Stitching & Assembly</h4>
              <p className="text-xs text-[#9e9082] leading-relaxed">
                Stitching with durable thread and securing metal rivets and buckles.
              </p>
            </div>

            <div className="p-5 bg-[#2d2520] rounded-2xl border border-[#3d332b] space-y-3">
              <span className="font-serif text-3xl font-bold text-[#c19a6b]">04</span>
              <h4 className="font-serif text-base font-bold text-[#f5efe6]">Final Inspection</h4>
              <p className="text-xs text-[#9e9082] leading-relaxed">
                Cleaning edges, checking zippers, and packing securely for courier dispatch.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center pt-8 border-t border-[#3d332b] flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="story-explore-collection-btn"
              onClick={() => onNavigateToShop('All')}
              className="px-8 py-3.5 bg-[#c19a6b] hover:bg-[#d8af7e] text-[#1a1614] rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-md cursor-pointer"
            >
              Explore Collection
            </button>
            <button
              id="story-visit-workshop-btn"
              onClick={onNavigateToContact}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-[#faf8f5] rounded-xl font-semibold text-xs tracking-wider uppercase border border-white/20 transition cursor-pointer"
            >
              Contact Our Proddatur Workshop
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
