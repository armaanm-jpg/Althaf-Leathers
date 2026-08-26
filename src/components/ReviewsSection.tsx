import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ReviewsSectionProps {
  currentProduct?: Product;
  onSelectProduct?: (product: Product) => void;
  allProducts?: Product[];
}

interface SimpleReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  text: string;
  item: string;
}

const SIMPLE_REVIEWS: SimpleReview[] = [
  {
    id: 'rev-1',
    author: 'Rajesh K.',
    city: 'Hyderabad',
    rating: 5,
    date: '3 days ago',
    text: 'The leather quality is very genuine and soft. The wallet fits all my cards easily and looks great.',
    item: 'Classic Bifold Wallet',
  },
  {
    id: 'rev-2',
    author: 'Ananya M.',
    city: 'Bengaluru',
    rating: 5,
    date: '1 week ago',
    text: 'Very neat stitching and good zipper quality. Sturdy leather bag for daily office use.',
    item: 'Commuter Leather Messenger',
  },
  {
    id: 'rev-3',
    author: 'Mohammed S.',
    city: 'Chennai',
    rating: 5,
    date: '2 weeks ago',
    text: 'Ordered a leather belt and received it in 3 days. Real leather smell and strong buckle. Value for money.',
    item: 'Full-Grain Bridle Belt',
  },
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ currentProduct }) => {
  const [mobileIndex, setMobileIndex] = useState(0);

  // Auto advance slideshow on mobile every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % SIMPLE_REVIEWS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setMobileIndex((prev) => (prev === 0 ? SIMPLE_REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev + 1) % SIMPLE_REVIEWS.length);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#e8dfd3]">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1614]">
            {currentProduct ? 'Customer Reviews' : 'Recent Customer Reviews'}
          </h3>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ede5da] text-[#8b4513] rounded-full text-xs font-bold">
            <Star className="w-3 h-3 fill-[#8b4513] text-[#8b4513]" />
            <span>4.9 / 5</span>
            <span className="text-[#8c7b6d] font-normal text-[11px]">(Verified Buyers)</span>
          </div>
        </div>

        {/* Mobile slide counter / navigation arrows */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            onClick={handlePrev}
            aria-label="Previous review"
            className="p-1 rounded-full bg-white border border-[#ded4c6] text-[#1a1614] hover:bg-[#ede5da] transition cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-bold text-[#73665a] px-1">
            {mobileIndex + 1}/{SIMPLE_REVIEWS.length}
          </span>
          <button
            onClick={handleNext}
            aria-label="Next review"
            className="p-1 rounded-full bg-white border border-[#ded4c6] text-[#1a1614] hover:bg-[#ede5da] transition cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Compact Single Slide Carousel */}
      <div className="block sm:hidden relative">
        <div className="bg-white rounded-xl p-4 border border-[#e8dfd3] shadow-xs space-y-2.5 min-h-[140px] flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {[...Array(SIMPLE_REVIEWS[mobileIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#c19a6b] text-[#c19a6b]" />
                ))}
              </div>
              <span className="text-[10px] text-[#8c7b6d]">{SIMPLE_REVIEWS[mobileIndex].date}</span>
            </div>

            <p className="text-xs text-[#3a332d] leading-relaxed">
              "{SIMPLE_REVIEWS[mobileIndex].text}"
            </p>
          </div>

          <div className="pt-2 border-t border-[#f0e9df] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#1a1614] text-xs">
                {SIMPLE_REVIEWS[mobileIndex].author}
              </span>
              <span className="text-[10px] text-[#8c7b6d]">
                ({SIMPLE_REVIEWS[mobileIndex].city})
              </span>
              <CheckCircle2 className="w-3 h-3 text-[#2b6b3e] shrink-0" />
            </div>
            <span className="text-[10px] text-[#8b4513] font-medium truncate max-w-[120px]">
              {SIMPLE_REVIEWS[mobileIndex].item}
            </span>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-1.5 pt-2">
          {SIMPLE_REVIEWS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setMobileIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                mobileIndex === idx ? 'w-5 bg-[#8b4513]' : 'w-1.5 bg-[#ded4c6]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP & TABLET VIEW: Simple 3-column Grid (Compact) */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-3.5">
        {SIMPLE_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-xl p-4 border border-[#e8dfd3] shadow-2xs flex flex-col justify-between space-y-2 hover:border-[#c19a6b]/50 transition"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#c19a6b] text-[#c19a6b]" />
                  ))}
                </div>
                <span className="text-[10px] text-[#8c7b6d]">{rev.date}</span>
              </div>

              <p className="text-xs text-[#3a332d] leading-relaxed line-clamp-3">
                "{rev.text}"
              </p>
            </div>

            <div className="pt-2 border-t border-[#f0e9df] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[#1a1614] text-xs truncate max-w-[90px]">
                  {rev.author}
                </span>
                <span className="text-[10px] text-[#8c7b6d] truncate">
                  ({rev.city})
                </span>
                <CheckCircle2 className="w-3 h-3 text-[#2b6b3e] shrink-0" />
              </div>
              <span className="text-[10px] text-[#8b4513] font-medium truncate max-w-[110px]">
                {rev.item}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
