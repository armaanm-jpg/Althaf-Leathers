import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, QrCode, Banknote, ArrowRight, Printer, Sparkles, MapPin } from 'lucide-react';
import { CartItem } from '../types';
import { formatINR } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoDiscount: number;
  promoCode: string;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  promoDiscount,
  promoCode,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [formData, setFormData] = useState({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9876543210',
    address: 'Flat 402, Heritage Heights, 12th Main',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * promoDiscount);
  const shippingCost = items.length > 0 ? 150 : 0;
  const finalTotal = rawSubtotal - discountAmount + shippingCost;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrder = `AL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderNumber(generatedOrder);
      setStep('success');
      onOrderCompleted();
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={step === 'success' ? onClose : undefined}
      />

      <div className="relative bg-[#faf8f5] rounded-2xl max-w-2xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#e8dfd3] bg-[#f4eee5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-bold text-[#1a1614]">
              {step === 'shipping' && 'Step 1: Delivery Address in India'}
              {step === 'payment' && 'Step 2: Secure Payment'}
              {step === 'success' && 'Order Confirmed!'}
            </span>
          </div>
          {step !== 'success' && (
            <button
              id="checkout-modal-close"
              onClick={onClose}
              className="p-1.5 text-[#6b5f54] hover:text-[#1a1614] hover:bg-[#ede5da] rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Shipping Details */}
        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#52473e] mb-1">Full Name</label>
                <input
                  id="checkout-fullname"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#52473e] mb-1">Contact Phone (+91)</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#52473e] mb-1">Email Address for Invoice & Tracking</label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#52473e] mb-1">Street Address / House No. / Landmark</label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#52473e] mb-1">City</label>
                <input
                  id="checkout-city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#52473e] mb-1">State</label>
                <input
                  id="checkout-state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#52473e] mb-1">PIN Code</label>
                <input
                  id="checkout-pincode"
                  type="text"
                  required
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className="w-full bg-white border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
              </div>
            </div>

            {/* Total recap */}
            <div className="p-4 bg-[#f2ece2] rounded-xl flex items-center justify-between text-sm">
              <span className="text-[#52473e]">Order Total ({items.length} items):</span>
              <span className="font-serif font-bold text-lg text-[#1a1614]">{formatINR(finalTotal)}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                id="checkout-back-to-cart"
                onClick={onClose}
                className="text-xs text-[#8c7b6d] hover:text-[#1a1614] cursor-pointer"
              >
                Back to Bag
              </button>
              <button
                id="checkout-proceed-to-payment"
                type="submit"
                className="px-6 py-3 bg-[#8b4513] hover:bg-[#72370e] text-white rounded-xl font-semibold text-xs tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                Continue to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Details */}
        {step === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                id="payment-method-upi"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-xl border-2 text-left flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-[#8b4513] bg-[#ede5da] text-[#8b4513]'
                    : 'border-[#d8ccbe] bg-white text-[#52473e] hover:border-[#b8ab9d]'
                }`}
              >
                <QrCode className="w-6 h-6" />
                <span className="text-xs font-bold">UPI / GPay</span>
              </button>

              <button
                type="button"
                id="payment-method-card"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-xl border-2 text-left flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#8b4513] bg-[#ede5da] text-[#8b4513]'
                    : 'border-[#d8ccbe] bg-white text-[#52473e] hover:border-[#b8ab9d]'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-bold">Cards / EMI</span>
              </button>

              <button
                type="button"
                id="payment-method-cod"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-xl border-2 text-left flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#8b4513] bg-[#ede5da] text-[#8b4513]'
                    : 'border-[#d8ccbe] bg-white text-[#52473e] hover:border-[#b8ab9d]'
                }`}
              >
                <Banknote className="w-6 h-6" />
                <span className="text-xs font-bold">Pay on Delivery</span>
              </button>
            </div>

            {/* Selected Method Details */}
            {paymentMethod === 'upi' && (
              <div className="p-4 bg-white rounded-xl border border-[#d8ccbe] space-y-3">
                <label className="block text-xs font-semibold text-[#52473e]">
                  Enter Virtual Payment Address (UPI ID)
                </label>
                <input
                  id="checkout-upi-id"
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or username@okaxis"
                  className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                />
                <p className="text-[11px] text-[#8c7b6d]">
                  Accepts Google Pay, PhonePe, Paytm, BHIM, and Cred UPI handles.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 bg-white rounded-xl border border-[#d8ccbe] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#52473e] mb-1">Card Number</label>
                  <input
                    id="checkout-card-num"
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#52473e] mb-1">Expiry (MM/YY)</label>
                    <input
                      id="checkout-card-exp"
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#52473e] mb-1">CVV</label>
                    <input
                      id="checkout-card-cvv"
                      type="password"
                      maxLength={4}
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-lg px-3 py-2 text-sm text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-[#f2ece2] rounded-xl border border-[#ded4c6] text-xs text-[#52473e] space-y-1">
                <p className="font-semibold text-[#1a1614]">Cash on Delivery Selected</p>
                <p>Pay cash or via UPI QR code when our delivery courier hands over your handcrafted parcel.</p>
              </div>
            )}

            {/* Summary */}
            <div className="p-4 bg-[#ede5da] rounded-xl space-y-1 text-xs text-[#52473e]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>{formatINR(rawSubtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-[#2b6b3e]">
                  <span>Discount ({promoCode}):</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Shipping (Proddatur):</span>
                <span>{formatINR(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#1a1614] pt-2 border-t border-[#d8ccbe]">
                <span>Total Payable:</span>
                <span>{formatINR(finalTotal)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                id="payment-back-to-shipping"
                onClick={() => setStep('shipping')}
                className="text-xs text-[#8c7b6d] hover:text-[#1a1614] cursor-pointer"
              >
                Back to Address
              </button>
              <button
                id="checkout-confirm-pay-btn"
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3.5 bg-[#8b4513] hover:bg-[#72370e] disabled:opacity-50 text-white rounded-xl font-semibold text-xs tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                {isProcessing ? 'Authorizing & Handcrafting...' : `Authorize & Pay ${formatINR(finalTotal)}`}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Order Success Receipt */}
        {step === 'success' && (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#e5f0e8] text-[#2b6b3e] rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#8b4513] font-bold">
                Order #{orderNumber}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1a1614]">
                Thank you, {formData.fullName}!
              </h3>
              <p className="text-xs text-[#6b5f54] max-w-md mx-auto">
                We have received your order. Our master artisans in Proddatur are preparing and hand-finishing your leather goods for dispatch.
              </p>
            </div>

            {/* Tracking & Timeline Card */}
            <div className="p-4 bg-white rounded-xl border border-[#e8dfd3] text-left space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1a1614]">
                <Truck className="w-4 h-4 text-[#8b4513]" />
                <span>Estimated Delivery: 3–5 Business Days</span>
              </div>
              <div className="text-xs text-[#73665a] space-y-1">
                <p><strong>Shipping to:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.pinCode}</p>
                <p><strong>Updates sent to:</strong> {formData.email}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                id="order-print-receipt-btn"
                onClick={handlePrint}
                className="py-2.5 px-4 bg-[#ede5da] hover:bg-[#ded4c6] text-[#231f1c] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Tax Receipt
              </button>
              <button
                id="order-continue-shopping-btn"
                onClick={onClose}
                className="py-2.5 px-6 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer"
              >
                Back to Atelier Collections
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
