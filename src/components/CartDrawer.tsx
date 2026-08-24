import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Tag, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';
import { formatINR } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onOpenCheckout: (promoDiscount: number, promoCode: string) => void;
  onNavigateToShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  onNavigateToShop,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = items.length > 0 ? 150 : 0;
  const discountAmount = Math.round(rawSubtotal * promoDiscount);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount + (items.length > 0 ? shippingCost : 0));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'HERITAGE10' || code === 'PRODDATUR10') {
      setPromoDiscount(0.10);
      setAppliedCode(code);
      setPromoError('');
    } else if (code === 'FIRST15') {
      setPromoDiscount(0.15);
      setAppliedCode(code);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try "HERITAGE10" for 10% off');
    }
  };

  const handleRemovePromo = () => {
    setPromoDiscount(0);
    setAppliedCode(null);
    setPromoCode('');
    setPromoError('');
  };

  const handleCheckoutClick = () => {
    onClose();
    onOpenCheckout(promoDiscount, appliedCode || '');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf8f5] shadow-2xl flex flex-col border-l border-[#e8dfd3] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#e8dfd3] bg-[#f4eee5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#8b4513]" />
              <h2 className="font-serif text-xl font-bold text-[#1a1614]">
                Your Shopping Bag ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              id="cart-drawer-close-btn"
              onClick={onClose}
              className="p-2 text-[#6b5f54] hover:text-[#1a1614] hover:bg-[#eae1d5] rounded-full transition cursor-pointer"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping notice */}
          {items.length > 0 && (
            <div className="p-3 bg-[#ede5da] border-b border-[#ded4c6] flex items-center justify-between text-xs text-[#52473e]">
              <span>Direct delivery from Proddatur, AP</span>
              <span className="font-semibold text-[#8b4513]">Standard Courier (₹150)</span>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#ede5da] rounded-full flex items-center justify-center mx-auto text-[#8c7b6d]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#231f1c]">
                  Your bag is currently empty
                </h3>
                <p className="text-sm text-[#73665a] max-w-xs mx-auto">
                  Explore our handcrafted leather satchels, wallets, and accessories made with pride in Proddatur.
                </p>
                <button
                  id="cart-empty-shop-now-btn"
                  onClick={() => {
                    onClose();
                    onNavigateToShop();
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-lg text-sm font-semibold tracking-wide transition shadow-sm cursor-pointer"
                >
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="p-4 bg-white rounded-xl border border-[#e8dfd3] flex gap-4 shadow-xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={
                      item.product.colors.find((c) => c.name === item.selectedColor)?.image ||
                      item.product.images[0]
                    }
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-[#f5efe6] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-[#1a1614] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          id={`cart-remove-${item.id}`}
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#9c8e82] hover:text-[#b83b3b] p-1 transition cursor-pointer"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-[#73665a] mt-0.5 space-y-0.5">
                        <p>Color: <span className="font-medium text-[#231f1c]">{item.selectedColor}</span></p>
                        {item.selectedSize && (
                          <p>Size: <span className="font-medium text-[#231f1c]">{item.selectedSize}</span></p>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#f2ece2]">
                      <div className="flex items-center border border-[#d8ccbe] rounded-md bg-[#faf8f5]">
                        <button
                          id={`cart-qty-dec-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-[#52473e] hover:text-[#1a1614] hover:bg-[#ede5da] transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#1a1614]">
                          {item.quantity}
                        </span>
                        <button
                          id={`cart-qty-inc-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-[#52473e] hover:text-[#1a1614] hover:bg-[#ede5da] transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-bold text-[#1a1614]">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#e8dfd3] bg-[#f7f2ea] space-y-4">
              
              {/* Promo Code Form */}
              <div>
                {appliedCode ? (
                  <div className="flex items-center justify-between bg-[#e5f0e8] border border-[#a8d3b2] px-3 py-2 rounded-lg text-xs text-[#2b6b3e]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{appliedCode}</strong> applied ({promoDiscount * 100}% off)</span>
                    </div>
                    <button
                      id="cart-remove-promo-btn"
                      onClick={handleRemovePromo}
                      className="text-xs text-[#b83b3b] hover:underline font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-[#9c8e82]" />
                      <input
                        id="cart-promo-input"
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Coupon code (e.g. HERITAGE10)"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-[#d8ccbe] rounded-lg text-xs placeholder-[#9c8e82] focus:outline-none focus:border-[#8b4513]"
                      />
                    </div>
                    <button
                      id="cart-apply-promo-btn"
                      type="submit"
                      className="px-3.5 py-2 bg-[#231f1c] hover:bg-[#8b4513] text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-[#b83b3b] mt-1">{promoError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6b5f54] border-t border-[#e8dfd3] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1a1614]">{formatINR(rawSubtotal)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#2b6b3e]">
                    <span>Discount</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span>{formatINR(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-[#1a1614] pt-2 border-t border-[#e8dfd3]">
                  <span>Total (Inclusive of taxes)</span>
                  <span>{formatINR(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-checkout-btn"
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#1faa4b] text-white rounded-xl font-bold text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Proceed to WhatsApp Checkout • {formatINR(finalTotal)}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8c7b6d]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Direct artisan WhatsApp chat • Handcrafted in Proddatur</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
