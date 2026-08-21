import React, { useState } from 'react';
import { X, Building2, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/format';

interface BulkInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
}

export const BulkInquiryModal: React.FC<BulkInquiryModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
}) => {
  if (!isOpen) return null;

  const [quantity, setQuantity] = useState(25);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [embossingRequired, setEmbossingRequired] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Pricing tier calculator
  const basePrice = initialProduct ? initialProduct.price : 4500;
  let discountPercent = 0.15; // default 15% for 10-25
  if (quantity >= 50) discountPercent = 0.25;
  else if (quantity >= 25) discountPercent = 0.20;

  const discountedUnit = Math.round(basePrice * (1 - discountPercent));
  const estimatedTotal = discountedUnit * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#faf8f5] rounded-2xl max-w-xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#e8dfd3] bg-[#f4eee5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#8b4513]" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1a1614]">
              Corporate Gifting & Bulk Order Atelier
            </h2>
          </div>
          <button
            id="bulk-inquiry-close-btn"
            onClick={onClose}
            className="p-1.5 text-[#6b5f54] hover:text-[#1a1614] hover:bg-[#ede5da] rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-[#e5f0e8] text-[#2b6b3e] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1a1614]">
              Inquiry Sent to Proddatur Workshop
            </h3>
            <p className="text-xs text-[#6b5f54] max-w-md mx-auto">
              Our lead craftsman will prepare your custom wholesale quote, leather swatch booklet, and corporate embossing mockup within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {initialProduct && (
              <div className="p-3 bg-white rounded-xl border border-[#e8dfd3] flex items-center gap-3">
                <img
                  src={initialProduct.images[0]}
                  alt={initialProduct.name}
                  className="w-12 h-12 rounded-lg object-cover bg-[#f5efe6]"
                />
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#1a1614]">{initialProduct.name}</h4>
                  <p className="text-[11px] text-[#6b5f54]">Retail Price: {formatINR(initialProduct.price)}</p>
                </div>
              </div>
            )}

            {/* Quantity Slider & Dynamic Tier Calculator */}
            <div className="p-4 bg-[#ede5da] rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#231f1c]">
                <span>Quantity: {quantity} units</span>
                <span className="text-[#8b4513]">{discountPercent * 100}% Wholesale Volume Discount</span>
              </div>
              <input
                id="bulk-quantity-range"
                type="range"
                min="10"
                max="250"
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-[#8b4513]"
              />
              <div className="flex justify-between text-[11px] text-[#52473e] pt-1">
                <span>Est. Unit Price: <strong>{formatINR(discountedUnit)}</strong></span>
                <span>Est. Total: <strong>{formatINR(estimatedTotal)}</strong></span>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#52473e] mb-1">Company / Organization</label>
                <input
                  id="bulk-company-name"
                  type="text"
                  required
                  placeholder="e.g. Apex Consulting Ltd."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#52473e] mb-1">Contact Person</label>
                <input
                  id="bulk-contact-person"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#52473e] mb-1">Business Email</label>
                <input
                  id="bulk-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#52473e] mb-1">Phone / WhatsApp</label>
                <input
                  id="bulk-phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    id="bulk-embossing-checkbox"
                    type="checkbox"
                    checked={embossingRequired}
                    onChange={(e) => setEmbossingRequired(e.target.checked)}
                    className="accent-[#8b4513]"
                  />
                  <span className="text-[#3a332d] flex items-center gap-1 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#c19a6b]" /> Include Custom Logo Debossing / Gold Foil Hot Stamping
                  </span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#52473e] mb-1">Specific Requirements or Target Deadline</label>
                <textarea
                  id="bulk-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Color preferences, custom packaging requirements, delivery date..."
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg p-2.5 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>
            </div>

            <button
              id="bulk-submit-btn"
              type="submit"
              className="w-full py-3 bg-[#8b4513] hover:bg-[#72370e] text-white rounded-xl font-semibold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" /> Request Official Wholesale Quote
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
