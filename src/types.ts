export type ProductCategory = 'All' | 'Bags' | 'Wallets' | 'Belts' | 'Folios' | 'Accessories';

export type LeatherType = 'Full-Grain' | 'Vegetable-Tanned' | 'Top-Grain' | 'Saddle Leather';

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
  secondaryImage?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: 'Bestseller' | 'New Arrival' | 'Atelier Signature' | 'Limited Edition';
  leatherType: LeatherType;
  colors: ColorVariant[];
  sizes?: string[];
  dimensions: string;
  weight: string;
  hardware: string;
  lining: string;
  description: string;
  features: string[];
  craftsmanshipNotes: string[];
  careInstructions: string[];
  images: string[];
  isFeatured?: boolean;
}

export interface CartItem {
  id: string; // unique cart item ID: `${productId}-${selectedColor}-${selectedSize}-${monogram}`
  productId: string;
  product: Product;
  selectedColor: string;
  selectedSize?: string;
  monogram?: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  productName: string;
}

export interface FilterState {
  category: ProductCategory;
  search: string;
  leatherTypes: string[];
  colors: string[];
  priceRange: [number, number];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export type ActivePage = 'home' | 'shop' | 'story' | 'contact' | 'product-detail';
