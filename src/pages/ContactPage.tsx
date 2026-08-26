import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    orderNumber: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        orderNumber: '',
        message: '',
      });
    }, 4000);
  };

  const faqs = [
    {
      q: 'Where are Althaf Leathers goods manufactured and showcased?',
      a: 'All our products are 100% handcrafted in our dedicated artisan showroom and atelier located at 15/1154, Modampalli Street, Nadminpalli, Proddatur, Andhra Pradesh 516360. We do not outsource production.'
    },
    {
      q: 'How do I care for my leather product?',
      a: 'Keep it away from prolonged direct water exposure. If wet, wipe with a dry cloth and allow to air dry naturally. Apply natural leather balm once or twice a year.'
    },
    {
      q: 'What is included in the Stitch Guarantee?',
      a: 'If any saddle-stitch thread comes loose or a solid rivet fails during normal lifetime usage, reach out to our Proddatur showroom. Our craftsmen will re-stitch and repair it free of charge.'
    },
    {
      q: 'How long does shipping take across India?',
      a: 'Standard courier transit takes 3–5 business days to metro cities (Bengaluru, Hyderabad, Chennai, Mumbai, Delhi). Orders qualify for direct Proddatur dispatch.'
    },
    {
      q: 'Do you accept corporate bulk orders and customized client gifting?',
      a: 'Yes! We specialize in executive corporate gifts, custom branding, and bespoke packaging for bulk orders starting at 10 units with tiered discounts.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">
          Connect with the Craftsmen
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1a1614]">
          Get in Touch with Our Atelier
        </h1>
        <p className="text-sm sm:text-base text-[#6b5f54] leading-relaxed">
          Whether you have questions about hide selection, leather care, or corporate bulk orders, our team in Proddatur is here to assist.
        </p>
      </div>

      {/* Main Grid: Contact Form (Left) & Workshop Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#e8dfd3] shadow-xs">
          <h2 className="font-serif text-2xl font-bold text-[#1a1614] mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#8b4513]" /> Send a Message
          </h2>
          <p className="text-xs text-[#73665a] mb-6">
            Fill in the details below and our lead artisan will reply within 12–24 business hours.
          </p>

          {submitted ? (
            <div className="p-8 bg-[#e5f0e8] border border-[#a8d3b2] rounded-2xl text-center space-y-3">
              <div className="w-14 h-14 bg-[#2b6b3e] text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1a1614]">Message Dispatched to Proddatur!</h3>
              <p className="text-xs text-[#2b6b3e] max-w-sm mx-auto font-medium">
                Thank you for reaching out. We have logged your inquiry and our atelier master will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#52473e] mb-1.5">Full Name *</label>
                  <input
                    id="contact-fullname"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your name"
                    className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1614] placeholder-[#9c8e82] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#52473e] mb-1.5">Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1614] placeholder-[#9c8e82] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#52473e] mb-1.5">Phone Number (+91)</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1614] placeholder-[#9c8e82] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#52473e] mb-1.5">Inquiry Subject</label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1614] focus:outline-none focus:border-[#8b4513] cursor-pointer"
                  >
                    <option value="General Inquiry">General Product Inquiry</option>
                    <option value="Order Support">Order Tracking & Support</option>
                    <option value="Corporate / Bulk Order">Corporate / Bulk Gifting (10+)</option>
                    <option value="Bespoke Commission">Custom Bespoke Leather Request</option>
                    <option value="Workshop Visit">Proddatur Workshop Visit Booking</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#52473e] mb-1.5">Order ID (if applicable)</label>
                  <input
                    id="contact-order-id"
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. AL-2026-48210"
                    className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1614] placeholder-[#9c8e82] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#52473e] mb-1.5">Message / Inquiry Details *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can assist you..."
                    className="w-full bg-[#faf8f5] border border-[#d8ccbe] rounded-xl p-3.5 text-xs text-[#1a1614] placeholder-[#9c8e82] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#8b4513] hover:bg-[#72370e] text-white rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Showroom Location & Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#231f1c] text-[#faf8f5] rounded-3xl p-6 sm:p-8 border border-[#3d332b] shadow-md space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#c19a6b]">
                Visit Our Showroom
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">
                Althaf Leathers Showroom
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#d8c8b4]">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#c19a6b] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">15/1154, Modampalli Street</p>
                  <p className="text-[#a89b8d]">Nadminpalli, Proddatur, Andhra Pradesh 516360, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#c19a6b] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">+91 73865 00505</p>
                  <p className="text-[#a89b8d]">Direct Showroom Phone & WhatsApp Support</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#c19a6b] shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:althafleathers5@gmail.com" className="font-bold text-white hover:text-[#c19a6b] transition">althafleathers5@gmail.com</a>
                  <p className="text-[#a89b8d]">Official Support & Inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#c19a6b] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Monday – Saturday: 9:30 AM – 8:30 PM IST</p>
                  <p className="text-[#a89b8d]">Sunday: 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Google Maps Location Embed */}
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-white/15 bg-[#14100e]">
              <iframe
                title="Althaf Leathers Showroom Location"
                src="https://maps.google.com/maps?q=15/1154,+Modampalli+Street,+Nadminpalli,+Proddatur,+Andhra+Pradesh+516360&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-2 right-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=15/1154,+Modampalli+Street,+Nadminpalli,+Proddatur,+516360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#231f1c]/90 hover:bg-[#8b4513] text-[#faf8f5] rounded-md text-[11px] font-semibold tracking-wide backdrop-blur-xs transition border border-white/20 inline-flex items-center gap-1 shadow-md"
                >
                  <MapPin className="w-3 h-3 text-[#c19a6b]" /> Open in Maps
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="bg-[#f4eee5] rounded-3xl p-6 sm:p-12 border border-[#e8dfd3]">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-[#8b4513]">
            Common Queries
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1a1614]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#e8dfd3] overflow-hidden shadow-xs"
            >
              <button
                id={`faq-toggle-${index}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-bold text-[#1a1614] hover:text-[#8b4513] transition cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-[#8b4513] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#8c7b6d] shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#6b5f54] leading-relaxed border-t border-[#f0e9df] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
