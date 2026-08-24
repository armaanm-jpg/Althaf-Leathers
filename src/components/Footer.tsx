import React, { useState } from 'react';
import { Mail, Phone, MapPin, Shield, RefreshCw, Award, ArrowRight, Check } from 'lucide-react';
import { ActivePage, ProductCategory } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  setSelectedCategory: (cat: ProductCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, setSelectedCategory }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  const handleNav = (page: ActivePage, cat?: ProductCategory) => {
    setActivePage(page);
    if (cat) setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1f1a17] text-[#ded6ca] border-t border-[#38302b]">
      {/* Brand Value Pillars */}
      <div className="border-b border-[#2e2621]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#2d241e] text-[#c19a6b] rounded-lg shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#f5efe6] mb-1">Everyday Leather Goods</h4>
                <p className="text-sm text-[#a89b8d] leading-relaxed">
                  Practical, functional leather accessories crafted for daily commute and everyday utility.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#2d241e] text-[#c19a6b] rounded-lg shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#f5efe6] mb-1">Started in 2026</h4>
                <p className="text-sm text-[#a89b8d] leading-relaxed">
                  A fresh, local leather venture based right in Proddatur, Andhra Pradesh.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#2d241e] text-[#c19a6b] rounded-lg shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#f5efe6] mb-1">All-India Delivery</h4>
                <p className="text-sm text-[#a89b8d] leading-relaxed">
                  Direct courier dispatch from Proddatur with simple flat delivery across all PIN codes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Atelier */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#f5efe6] block">
              ALTHAF LEATHERS
            </span>
            <p className="text-sm text-[#a89b8d] max-w-sm leading-relaxed">
              Established in 2026 in Proddatur, Andhra Pradesh. We bring functional, accessible leather accessories, bags, wallets, and belts designed for everyday utility.
            </p>
            <div className="pt-2 space-y-2 text-sm text-[#b8ab9d]">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#c19a6b] shrink-0" />
                <span>Atelier: Gandhi Road, Proddatur, Andhra Pradesh 516360</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c19a6b] shrink-0" />
                <span>+91 82476 77511</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c19a6b] shrink-0" />
                <span>atelier@althafleathers.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c19a6b]">Collections</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-link-bags"
                  onClick={() => handleNav('shop', 'Bags')}
                  className="text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer"
                >
                  Leather Bags
                </button>
              </li>
              <li>
                <button
                  id="footer-link-wallets"
                  onClick={() => handleNav('shop', 'Wallets')}
                  className="text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer"
                >
                  Bifold Wallets
                </button>
              </li>
              <li>
                <button
                  id="footer-link-belts"
                  onClick={() => handleNav('shop', 'Belts')}
                  className="text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer"
                >
                  Bridle Belts
                </button>
              </li>
              <li>
                <button
                  id="footer-link-shoes"
                  onClick={() => handleNav('shop', 'Shoes')}
                  className="text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer"
                >
                  Leather Shoes
                </button>
              </li>
              <li>
                <button
                  id="footer-link-slippers"
                  onClick={() => handleNav('shop', 'Slippers')}
                  className="text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer"
                >
                  Leather Slippers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: The Atelier */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c19a6b]">The Atelier</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-link-story"
                  onClick={() => handleNav('story')}
                  className="text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer"
                >
                  Our Heritage & Story
                </button>
              </li>
              <li>
                <button
                  id="footer-link-craftsmanship"
                  onClick={() => handleNav('story')}
                  className="text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer"
                >
                  Vegetable Tanning & Craft
                </button>
              </li>
              <li>
                <button
                  id="footer-link-contact"
                  onClick={() => handleNav('contact')}
                  className="text-[#a89b8d] hover:text-[#f5efe6] transition cursor-pointer"
                >
                  Visit the Workshop
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c19a6b]">Join The Circle</h4>
            <p className="text-xs text-[#a89b8d] leading-relaxed">
              Subscribe for private atelier batch releases, leather care insights, and 10% off your first order.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  id="footer-newsletter-input"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-[#2a221d] border border-[#443830] text-sm text-[#f5efe6] rounded-md px-3.5 py-2.5 placeholder-[#7d6f62] focus:outline-none focus:border-[#c19a6b]"
                />
                <button
                  id="footer-newsletter-btn"
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 bg-[#c19a6b] text-[#1f1a17] hover:bg-[#d8af7e] rounded transition"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check className="w-4 h-4 text-[#1f1a17]" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-[#82c98d] flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Welcome to the Atelier Circle!
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-12 pt-8 border-t border-[#2e2621] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8c7b6d] gap-4">
          <p>© {new Date().getFullYear()} Althaf Leathers. Handcrafted with pride in Proddatur, Andhra Pradesh. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Secure 256-Bit Encrypted Payments</span>
            <span>UPI • Cards • NetBanking • COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
