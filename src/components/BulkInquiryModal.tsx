import React, { useState } from 'react';
import { X, Building2, CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, Sparkles, Send, Copy, Check } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/format';
import {
  generateWhatsAppBulkInquiryMessage,
  createWhatsAppCheckoutUrl,
  DEFAULT_WHATSAPP_NUMBER
} from '../utils/whatsapp';
import { logOrderInquiryApi } from '../services/api';

interface BulkInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  whatsappNumber?: string;
}

export const BulkInquiryModal: React.FC<BulkInquiryModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
}) => {
  if (!isOpen) return null;

  const [quantity, setQuantity] = useState(25);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');
  const [lastBulkMessage, setLastBulkMessage] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pricing tier calculator
  const basePrice = initialProduct ? initialProduct.price : 4500;
  let discountPercent = 0.15; // default 15% for 10-24
  if (quantity >= 50) discountPercent = 0.25;
  else if (quantity >= 25) discountPercent = 0.20;

  const discountedUnit = Math.round(basePrice * (1 - discountPercent));
  const estimatedTotal = discountedUnit * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const message = generateWhatsAppBulkInquiryMessage({
      product: initialProduct,
      quantity,
      unitPrice: discountedUnit,
      totalPrice: estimatedTotal,
      discountPercent,
      companyName,
      contactPerson,
      email,
      phone,
      notes,
    });
    setLastBulkMessage(message);

    const waUrl = createWhatsAppCheckoutUrl(whatsappNumber, message);
    setLastWhatsAppUrl(waUrl);

    // Asynchronously log to SQLite database
    logOrderInquiryApi({
      type: 'bulk_inquiry',
      referenceCode: `BULK-${Date.now()}`,
      customerName: contactPerson || companyName,
      phone,
      email,
      totalAmount: estimatedTotal,
      payload: {
        productName: initialProduct?.name || 'Custom Atelier Leather Batch',
        quantity,
        discountPercent,
        companyName,
        notes,
      }
    });

    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // fallback
    }

    setTimeout(() => {
      setIsProcessing(false);
      setSubmitted(true);
    }, 600);
  };

  const handleCopyMessage = () => {
    if (!lastBulkMessage) return;
    navigator.clipboard.writeText(lastBulkMessage).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={submitted ? onClose : undefined}
      />

      <div className="relative bg-[#faf8f5] rounded-3xl max-w-xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-[#e8dfd3] bg-[#f4eee5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#8b4513]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b4513] block">
                Direct Workshop Wholesale
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1a1614]">
                {submitted ? 'Bulk Inquiry Sent!' : 'Bulk Buy & Corporate Orders'}
              </h2>
            </div>
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
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#e5f0e8] text-[#2b6b3e] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#8b4513] font-bold">
                Volume: {quantity} Units • {Math.round(discountPercent * 100)}% Discount
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1a1614]">
                Bulk Inquiry Opened in WhatsApp!
              </h3>
              <p className="text-xs text-[#6b5f54] max-w-md mx-auto leading-relaxed">
                Thank you{contactPerson ? `, ${contactPerson}` : ''}! Your bulk quotation request for <strong>{quantity} units</strong> (Est. total <strong>{formatINR(estimatedTotal)}</strong>) has been routed directly to our master craftsmen in Proddatur.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#e8dfd3] text-left text-xs space-y-1 text-[#6b5f54]">
              <p className="font-bold text-[#1a1614]">Next Steps:</p>
              <p>• Our workshop will review your request and confirm batch lead time.</p>
              <p>• We will provide formal GST proforma invoice & wholesale delivery schedules.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {lastWhatsAppUrl && (
                <a
                  id="bulk-reopen-whatsapp-link"
                  href={lastWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 bg-[#25D366] hover:bg-[#1faa4b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" /> Re-open WhatsApp Chat
                </a>
              )}
              <button
                id="bulk-copy-inquiry-btn"
                onClick={handleCopyMessage}
                className="py-3 px-4 bg-[#f2ece2] hover:bg-[#ded4c6] text-[#231f1c] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer border border-[#ded4c6]"
                title="Copy complete bulk inquiry to paste directly in WhatsApp"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-[#15803d]" />
                    <span className="text-[#15803d] font-bold">Copied Inquiry!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#8b4513]" />
                    <span>Copy Inquiry Text</span>
                  </>
                )}
              </button>
              <button
                id="bulk-close-success-btn"
                onClick={onClose}
                className="py-3 px-5 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer"
              >
                Back to Store
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* WhatsApp notice banner */}
            <div className="p-3.5 bg-[#e8f5e9] border border-[#a5d6a7] rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#1e4620]">
                <p className="font-bold text-[#1b5e20]">Direct Workshop Quotation via WhatsApp</p>
                <p className="text-[11px] leading-relaxed">
                  Bulk order pricing, timeline estimates, and sample requests are processed instantly with our Proddatur workshop team.
                </p>
              </div>
            </div>

            {initialProduct && (
              <div className="p-3 bg-white rounded-xl border border-[#e8dfd3] flex items-center gap-3 shadow-xs">
                <img
                  src={initialProduct.images[0]}
                  alt={initialProduct.name}
                  className="w-12 h-12 rounded-lg object-cover bg-[#f5efe6] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xs font-bold text-[#1a1614] truncate">{initialProduct.name}</h4>
                  <p className="text-[11px] text-[#6b5f54]">Standard Unit Price: {formatINR(initialProduct.price)}</p>
                </div>
              </div>
            )}

            {/* Quantity Slider & Dynamic Tier Calculator */}
            <div className="p-4 bg-[#ede5da] rounded-2xl space-y-2 border border-[#d8ccbe]">
              <div className="flex justify-between text-xs font-bold text-[#231f1c]">
                <span>Order Volume: {quantity} units</span>
                <span className="text-[#8b4513] font-extrabold">{Math.round(discountPercent * 100)}% Volume Discount</span>
              </div>
              <input
                id="bulk-quantity-range"
                type="range"
                min="10"
                max="250"
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-[#8b4513] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#52473e] pt-1">
                <span>Est. Unit Rate: <strong>{formatINR(discountedUnit)}</strong></span>
                <span>Est. Total Batch: <strong className="text-[#8b4513]">{formatINR(estimatedTotal)}</strong></span>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#52473e] mb-1">Company / Organization *</label>
                <input
                  id="bulk-company-name"
                  type="text"
                  required
                  placeholder="e.g. Apex Enterprises"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white border border-[#d8ccbe] rounded-xl px-3 py-2 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#52473e] mb-1">Contact Person Name *</label>
                <input
                  id="bulk-contact-person"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-white border border-[#d8ccbe] rounded-xl px-3 py-2 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#52473e] mb-1">Phone / WhatsApp (+91) *</label>
                <input
                  id="bulk-phone"
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#d8ccbe] rounded-xl px-3 py-2 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#52473e] mb-1">Business Email (Optional)</label>
                <input
                  id="bulk-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#d8ccbe] rounded-xl px-3 py-2 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#52473e] mb-1">Specific Requirements or Deadline (Optional)</label>
                <textarea
                  id="bulk-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Color preferences, custom packaging requirements, target delivery date..."
                  className="w-full bg-white border border-[#d8ccbe] rounded-xl p-2.5 text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>
            </div>

            <button
              id="bulk-submit-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#25D366] hover:bg-[#1faa4b] text-white rounded-2xl font-bold text-xs tracking-wider transition flex items-center justify-center gap-2.5 shadow-md cursor-pointer disabled:opacity-75"
            >
              <MessageCircle className="w-4 h-4" />
              {isProcessing ? 'Opening WhatsApp Chat...' : `Send Bulk Inquiry on WhatsApp • ${formatINR(estimatedTotal)}`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
