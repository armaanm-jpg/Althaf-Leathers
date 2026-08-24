export type ProductCategory = string;

export interface CategoryMeta {
  id: string; // e.g. 'Bags', 'Wallets', 'Belts', 'Shoes', 'Slippers', or custom category id
  name: string; // Display name, e.g. 'Leather Bags' or 'Leather Jackets'
  tagline?: string; // e.g. 'Satchels, Totes & Duffels'
  image?: string; // Category showcase image
}

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
  badge?: 'Bestseller' | 'New Arrival' | 'Atelier Signature' | 'Limited Edition' | 'Staff Pick';
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
  inStock?: boolean;
}

export interface CartItem {
  id: string; // unique cart item ID: `${productId}-${selectedColor}-${selectedSize}`
  productId: string;
  product: Product;
  selectedColor: string;
  selectedSize?: string;
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

export interface HomePageConfig {
  heroProductId: string;
  bentoSecondaryId: string;
  featuredProductIds: string[];
  announcementText?: string;
  announcementLocation?: string;
  announcementBadge?: string;
  whatsappNumber?: string;
}

export type ActivePage = 'home' | 'shop' | 'story' | 'contact' | 'product-detail' | 'admin';
