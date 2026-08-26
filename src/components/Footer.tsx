import React from 'react';
import { Mail, Phone, MapPin, Shield, RefreshCw, Award, MessageCircle, ExternalLink } from 'lucide-react';
import { ActivePage, ProductCategory } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  setSelectedCategory: (cat: ProductCategory) => void;
  showTrustPillars?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  setActivePage,
  setSelectedCategory,
  showTrustPillars = false,
}) => {
  const handleNav = (page: ActivePage, cat?: ProductCategory) => {
    setActivePage(page);
    if (cat) setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1f1a17] text-[#ded6ca] border-t border-[#38302b]">
      {/* Brand Value Pillars (Only rendered when showTrustPillars is true on Home page) */}
      {showTrustPillars && (
        <div className="border-b border-[#2e2621] bg-[#1a1613]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-[#2d241e] text-[#c19a6b] rounded-xl shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#f5efe6] mb-0.5">
                    Everyday Leather Goods
                  </h4>
                  <p className="text-xs text-[#a89b8d] leading-relaxed">
                    Practical, durable accessories crafted for daily office and personal use.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-[#2d241e] text-[#c19a6b] rounded-xl shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#f5efe6] mb-0.5">
                    Started in 2026
                  </h4>
                  <p className="text-xs text-[#a89b8d] leading-relaxed">
                    A fresh, authentic leather venture based right in Proddatur, Andhra Pradesh.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-[#2d241e] text-[#c19a6b] rounded-xl shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#f5efe6] mb-0.5">
                    All-India Delivery
                  </h4>
                  <p className="text-xs text-[#a89b8d] leading-relaxed">
                    Direct courier dispatch with straightforward tracking to any PIN code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Column 1: Brand & Atelier Address */}
          <div className="sm:col-span-2 space-y-3.5">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#f5efe6] block">
              ALTHAF LEATHERS
            </span>
            <p className="text-xs sm:text-sm text-[#a89b8d] max-w-md leading-relaxed">
              Established in 2026 in Proddatur, Andhra Pradesh. Genuine leather wallets, belts, bags, footwear, and accessories designed for everyday utility.
            </p>
            
            <div className="pt-2 space-y-2 text-xs sm:text-sm text-[#b8ab9d]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c19a6b] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  15/1154, Modampalli Street, Nadminpalli, Proddatur, Andhra Pradesh 516360
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c19a6b] shrink-0" />
                <a href="tel:+917386500505" className="hover:text-[#f5efe6] transition">
                  +91 73865 00505
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c19a6b] shrink-0" />
                <a href="mailto:althafleathers5@gmail.com" className="hover:text-[#f5efe6] transition">
                  althafleathers5@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Collections Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#c19a6b]">
              Collections
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs sm:text-sm">
              <button
                id="footer-link-bags"
                onClick={() => handleNav('shop', 'Bags')}
                className="text-left text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer py-0.5"
              >
                Leather Bags
              </button>
              <button
                id="footer-link-wallets"
                onClick={() => handleNav('shop', 'Wallets')}
                className="text-left text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer py-0.5"
              >
                Bifold Wallets
              </button>
              <button
                id="footer-link-belts"
                onClick={() => handleNav('shop', 'Belts')}
                className="text-left text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer py-0.5"
              >
                Leather Belts
              </button>
              <button
                id="footer-link-shoes"
                onClick={() => handleNav('shop', 'Shoes')}
                className="text-left text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer py-0.5"
              >
                Leather Shoes
              </button>
              <button
                id="footer-link-slippers"
                onClick={() => handleNav('shop', 'Slippers')}
                className="text-left text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer py-0.5"
              >
                Leather Slippers
              </button>
              <button
                id="footer-link-all"
                onClick={() => handleNav('shop', 'All')}
                className="text-left text-[#c19a6b] hover:text-[#f5efe6] transition cursor-pointer py-0.5 font-semibold"
              >
                View All Pieces →
              </button>
            </div>
          </div>

          {/* Column 3: Customer Care & Story */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#c19a6b]">
              Customer Care
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs sm:text-sm">
              <button
                id="footer-link-story"
                onClick={() => handleNav('story')}
                className="text-left text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer py-0.5"
              >
                Our Story
              </button>
              <button
                id="footer-link-contact"
                onClick={() => handleNav('contact')}
                className="text-left text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer py-0.5"
              >
                Showroom Visit
              </button>
              <a
                id="footer-whatsapp-support"
                href="https://api.whatsapp.com/send?phone=917386500505&text=Hello%20Althaf%20Leathers,%20I%20have%20an%20inquiry%20regarding%20leather%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="text-left text-[#25D366] hover:underline transition inline-flex items-center gap-1 py-0.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Help</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-[#2e2621] flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#8c7b6d] gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Althaf Leathers, Proddatur. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[#a89b8d]">
            <span>Proddatur Courier Dispatch</span>
            <span>•</span>
            <span>UPI & WhatsApp Orders</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
