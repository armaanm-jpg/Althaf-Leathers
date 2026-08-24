import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  MessageCircle,
  Printer,
  Sparkles,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  ExternalLink,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { CartItem } from '../types';
import { formatINR } from '../utils/format';
import {
  generateWhatsAppOrderMessage,
  createWhatsAppCheckoutUrl,
  DEFAULT_WHATSAPP_NUMBER,
  CustomerOrderInfo
} from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoDiscount: number;
  promoCode: string;
  onOrderCompleted: () => void;
  whatsappNumber?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  promoDiscount,
  promoCode,
  onOrderCompleted,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [formData, setFormData] = useState<CustomerOrderInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    notes: '',
  });

  const [orderNumber, setOrderNumber] = useState('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');
  const [lastOrderMessage, setLastOrderMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * promoDiscount);
  const shippingCost = items.length > 0 ? 150 : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount + (items.length > 0 ? shippingCost : 0));

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedOrder = `AL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderNumber(generatedOrder);

    const message = generateWhatsAppOrderMessage({
      items,
      rawSubtotal,
      discountAmount,
      promoCode,
      shippingCost,
      finalTotal,
      orderNumber: generatedOrder,
      customerInfo: formData,
    });
    setLastOrderMessage(message);

    const waUrl = createWhatsAppCheckoutUrl(whatsappNumber, message);
    setLastWhatsAppUrl(waUrl);

    // Open WhatsApp in new tab / app
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // fallback
    }

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      onOrderCompleted();
    }, 600);
  };

  const handleCopyMessage = () => {
    if (!lastOrderMessage) return;
    navigator.clipboard.writeText(lastOrderMessage).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={step === 'success' ? onClose : undefined}
      />

      <div className="relative bg-[#faf8f5] rounded-3xl max-w-2xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-[#e8dfd3] bg-[#f4eee5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b4513] block">
                Direct Atelier Support
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1a1614]">
                {step === 'details' ? 'WhatsApp Order Checkout' : 'Order Inquiry Dispatched!'}
              </h2>
            </div>
          </div>
          
          <button
            id="checkout-modal-close"
            onClick={onClose}
            className="p-1.5 text-[#6b5f54] hover:text-[#1a1614] hover:bg-[#ede5da] rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Details & Direct WhatsApp Checkout */}
        {step === 'details' && (
          <form onSubmit={handleWhatsAppCheckout} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Direct WhatsApp Ordering Notice */}
            <div className="p-4 bg-[#e8f5e9] border border-[#a5d6a7] rounded-2xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#1e4620] space-y-0.5">
                <p className="font-bold text-[#1b5e20] text-sm">
                  Handcrafted Direct-to-Consumer Ordering
                </p>
                <p className="leading-relaxed">
                  We process all bespoke orders directly via WhatsApp with our master leathercraft team in Proddatur. Click below to chat with our workshop with your items, pricing, and delivery details pre-filled.
                </p>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#73665a] font-bold uppercase tracking-wider">
                <span>Items in Order ({items.length})</span>
                <span>Subtotal: {formatINR(rawSubtotal)}</span>
              </div>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-[#e8dfd3] flex items-center gap-3 shadow-xs"
                  >
                    <img
                      src={
                        item.product.colors.find((c) => c.name === item.selectedColor)?.image ||
                        item.product.images[0]
                      }
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#f5efe6] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs font-bold text-[#1a1614] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#73665a] truncate">
                        Color: <span className="font-medium text-[#1a1614]">{item.selectedColor}</span>
                        {item.selectedSize && ` • Size: ${item.selectedSize}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#1a1614] block">
                        {formatINR(item.price * item.quantity)}
                      </span>
                      <span className="text-[10px] text-[#8c7b6d]">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Customer Details */}
            <div className="space-y-3 pt-2 border-t border-[#e8dfd3]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#52473e]">
                <User className="w-3.5 h-3.5 text-[#8b4513]" />
                <span>Customer & Delivery Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#52473e] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id="checkout-fullname"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-[#d8ccbe] rounded-xl px-3 py-2 text-xs text-[#1a1614] placeholder-[#a89b8d] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#52473e] mb-1">
                    Phone / WhatsApp (+91) *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-white border border-[#d8ccbe] rounded-xl px-3 py-2 text-xs text-[#1a1614] placeholder-[#a89b8d] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#52473e] mb-1">
                    Delivery Address / Landmark (Optional)
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Flat 302, Green Avenue, MG Road"
                    className="w-full bg-white border border-[#d8ccbe] rounded-xl px-3 py-2 text-xs text-[#1a1614] placeholder-[#a89b8d] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#52473e] mb-1">
                    City & State
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full bg-white border border-[#d8ccbe] rounded-xl px-3 py-2 text-xs text-[#1a1614] placeholder-[#a89b8d] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#52473e] mb-1">
                    PIN Code
                  </label>
                  <input
                    id="checkout-pincode"
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    placeholder="e.g. 500081"
                    className="w-full bg-white border border-[#d8ccbe] rounded-xl px-3 py-2 text-xs text-[#1a1614] placeholder-[#a89b8d] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>
              </div>
            </div>

            {/* Price & Approx Checkout Breakdown */}
            <div className="p-4 bg-[#f2ece2] rounded-2xl border border-[#ded4c6] space-y-2 text-xs text-[#52473e]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#1a1614]">{formatINR(rawSubtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-[#2b6b3e]">
                  <span>Promo Discount ({promoCode})</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Delivery (Direct from Proddatur)</span>
                <span>{shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-serif font-bold text-base text-[#1a1614] pt-2 border-t border-[#ded4c6]">
                <span>Approx Checkout Total:</span>
                <span className="text-[#8b4513]">{formatINR(finalTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                id="checkout-proceed-whatsapp-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#25D366] hover:bg-[#1faa4b] text-white rounded-2xl font-bold text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
              >
                <MessageCircle className="w-5 h-5" />
                {isProcessing ? 'Opening WhatsApp Chat...' : `Confirm & Order on WhatsApp • ${formatINR(finalTotal)}`}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#73665a]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Direct artisan chat • No payment gateway commission • 100% Genuine Leather</span>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: Order Dispatched to WhatsApp Confirmation */}
        {step === 'success' && (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#e5f0e8] text-[#2b6b3e] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#8b4513] font-bold">
                Reference Code #{orderNumber}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1a1614]">
                Inquiry Sent to WhatsApp!
              </h3>
              <p className="text-xs text-[#6b5f54] max-w-md mx-auto leading-relaxed">
                Thank you{formData.fullName ? `, ${formData.fullName}` : ''}! Your order inquiry with complete product pricing and approximate checkout amount of <strong>{formatINR(finalTotal)}</strong> has been opened in WhatsApp.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-4 bg-white rounded-2xl border border-[#e8dfd3] text-left space-y-2 shadow-xs text-xs">
              <div className="flex justify-between font-semibold text-[#1a1614] border-b border-[#f2ece2] pb-2">
                <span>Items ({items.length})</span>
                <span>Total: {formatINR(finalTotal)}</span>
              </div>
              <p className="text-[#6b5f54]">
                Our craftsman on Gandhi Road, Proddatur will verify leather hide stock, dispatch timelines, and confirm tracking with you in the chat.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {lastWhatsAppUrl && (
                <a
                  id="checkout-reopen-whatsapp-link"
                  href={lastWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 bg-[#25D366] hover:bg-[#1faa4b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" /> Re-open WhatsApp Chat
                </a>
              )}
              <button
                id="checkout-copy-order-text-btn"
                onClick={handleCopyMessage}
                className="py-3 px-4 bg-[#f2ece2] hover:bg-[#ded4c6] text-[#231f1c] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer border border-[#ded4c6]"
                title="Copy complete order text to paste in WhatsApp"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-[#15803d]" />
                    <span className="text-[#15803d] font-bold">Copied Order Text!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#8b4513]" />
                    <span>Copy Order Text</span>
                  </>
                )}
              </button>
              <button
                id="order-print-receipt-btn"
                onClick={handlePrint}
                className="py-3 px-4 bg-[#ede5da] hover:bg-[#ded4c6] text-[#231f1c] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                id="order-continue-shopping-btn"
                onClick={onClose}
                className="py-3 px-5 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
