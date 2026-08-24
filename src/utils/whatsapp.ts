import { CartItem, Product } from '../types';
import { formatINR } from './format';

export interface CustomerOrderInfo {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  notes?: string;
}

export interface BulkInquiryData {
  product?: Product | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountPercent: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  notes?: string;
}

export const DEFAULT_WHATSAPP_NUMBER = '918247677511';

export function getCleanDigits(phone?: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

export function validateWhatsAppNumber(phone?: string): {
  isValid: boolean;
  cleanPhone: string;
  digitCount: number;
  message?: string;
} {
  const digits = getCleanDigits(phone);
  if (!digits) {
    return {
      isValid: false,
      cleanPhone: '',
      digitCount: 0,
      message: 'No phone number provided.',
    };
  }

  // Handle numbers with 91 country code
  let localDigits = digits;
  if (digits.startsWith('91') && digits.length >= 11) {
    localDigits = digits.slice(2);
  }

  if (localDigits.length === 10) {
    return {
      isValid: true,
      cleanPhone: `91${localDigits}`,
      digitCount: 10,
    };
  }

  if (localDigits.length < 10) {
    return {
      isValid: false,
      cleanPhone: digits.startsWith('91') ? digits : `91${digits}`,
      digitCount: localDigits.length,
      message: `Phone number "+91 ${localDigits}" has only ${localDigits.length} digits. Indian mobile numbers require 10 digits (e.g. +91 82476 77511). WhatsApp will reject URLs with missing digits.`,
    };
  }

  return {
    isValid: true,
    cleanPhone: digits,
    digitCount: digits.length,
  };
}

export function sanitizePhoneNumber(phone?: string): string {
  if (!phone) return DEFAULT_WHATSAPP_NUMBER;
  const digitsOnly = phone.replace(/\D/g, '');
  if (!digitsOnly || digitsOnly.length < 5) {
    return DEFAULT_WHATSAPP_NUMBER;
  }
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  return digitsOnly;
}

export function generateWhatsAppOrderMessage({
  items,
  rawSubtotal,
  discountAmount,
  promoCode,
  shippingCost,
  finalTotal,
  orderNumber,
  customerInfo,
}: {
  items: CartItem[];
  rawSubtotal: number;
  discountAmount: number;
  promoCode?: string;
  shippingCost: number;
  finalTotal: number;
  orderNumber: string;
  customerInfo: CustomerOrderInfo;
}): string {
  const itemsText = items
    .map((item, index) => {
      const parts = [
        `${index + 1}. *${item.product.name}*`,
        `   • Color: ${item.selectedColor}`,
      ];
      if (item.selectedSize) {
        parts.push(`   • Size: ${item.selectedSize}`);
      }
      parts.push(`   • Qty: ${item.quantity} × ${formatINR(item.price)} = ${formatINR(item.price * item.quantity)}`);
      return parts.join('\n');
    })
    .join('\n\n');

  let pricingSummary = `• Subtotal: ${formatINR(rawSubtotal)}`;
  if (discountAmount > 0) {
    pricingSummary += `\n• Promo Discount (${promoCode || 'Applied'}): -${formatINR(discountAmount)}`;
  }
  pricingSummary += `\n• Standard Delivery: ${shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}`;
  pricingSummary += `\n• *Estimated Total Payable:* ${formatINR(finalTotal)}`;

  let customerDetails = `• Name: ${customerInfo.fullName || 'Valued Customer'}`;
  if (customerInfo.phone) {
    customerDetails += `\n• Phone: +91 ${customerInfo.phone}`;
  }
  if (customerInfo.email) {
    customerDetails += `\n• Email: ${customerInfo.email}`;
  }
  if (customerInfo.address) {
    customerDetails += `\n• Delivery Address: ${customerInfo.address}`;
  }
  if (customerInfo.city || customerInfo.state || customerInfo.pinCode) {
    const loc = [customerInfo.city, customerInfo.state, customerInfo.pinCode ? `PIN: ${customerInfo.pinCode}` : ''].filter(Boolean).join(', ');
    customerDetails += `\n• City & PIN: ${loc}`;
  }
  if (customerInfo.notes) {
    customerDetails += `\n• Special Notes: ${customerInfo.notes}`;
  }

  return `*🛍️ NEW ORDER INQUIRY — ALTHAF LEATHERS*
*Order Reference:* ${orderNumber}
*Workshop:* Gandhi Road, Proddatur, AP

*ITEMS ORDERED:*
${itemsText}

*PRICE BREAKDOWN & APPROX CHECKOUT:*
${pricingSummary}

*CUSTOMER & DELIVERY DETAILS:*
${customerDetails}

---------------------------------------
Hello Althaf Leathers team! Please confirm product availability, crafting timeline, and payment/delivery schedule for this order. Thank you!`;
}

export function generateWhatsAppBulkInquiryMessage({
  product,
  quantity,
  unitPrice,
  totalPrice,
  discountPercent,
  companyName,
  contactPerson,
  email,
  phone,
  notes,
}: BulkInquiryData): string {
  const refCode = `BLK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let productDetails = product
    ? `• Product: *${product.name}* (Base Price: ${formatINR(product.price)})`
    : `• Product: *General / Multi-item Bulk Order*`;

  return `*🏢 CORPORATE & BULK BUY INQUIRY — ALTHAF LEATHERS*
*Reference Code:* ${refCode}
*Workshop:* Gandhi Road, Proddatur, AP

*BULK ORDER DETAILS:*
${productDetails}
• Requested Quantity: *${quantity} units*
• Volume Wholesale Discount: *${Math.round(discountPercent * 100)}% OFF*
• Est. Discounted Unit Price: *${formatINR(unitPrice)}*
• *Est. Total Order Value:* *${formatINR(totalPrice)}*

*CLIENT / ORGANIZATION DETAILS:*
• Company / Organization: *${companyName || 'Not specified'}*
• Contact Person: *${contactPerson || 'Not specified'}*
• Phone / WhatsApp: *${phone ? `+91 ${phone}` : 'Not provided'}*
• Email: *${email || 'Not provided'}*
${notes ? `• Specific Requirements / Notes: ${notes}` : ''}

---------------------------------------
Hello Althaf Leathers team! Please provide an official wholesale quotation, batch lead times, and sample dispatch details for this bulk requirement. Thank you!`;
}

export function createWhatsAppCheckoutUrl(
  whatsappPhone: string,
  message: string
): string {
  const cleanPhone = sanitizePhoneNumber(whatsappPhone);
  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
}
