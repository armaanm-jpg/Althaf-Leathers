import React, { useState, useEffect } from 'react';
import { ActivePage, ProductCategory, Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { WishlistModal } from './components/WishlistModal';
import { CheckoutModal } from './components/CheckoutModal';
import { BulkInquiryModal } from './components/BulkInquiryModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { StoryPage } from './pages/StoryPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkProduct, setBulkProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPromo, setCheckoutPromo] = useState<{ discount: number; code: string }>({
    discount: 0,
    code: '',
  });

  // Cart & Wishlist persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('althaf_leathers_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('althaf_leathers_wishlist');
      return saved ? JSON.parse(saved) : ['heritage-satchel', 'classic-bifold-wallet'];
    } catch {
      return ['heritage-satchel', 'classic-bifold-wallet'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('althaf_leathers_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('althaf_leathers_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlistIds]);

  // Handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (
    product: Product,
    colorName: string,
    size?: string,
    monogram?: string,
    quantity = 1
  ) => {
    const cartItemId = `${product.id}-${colorName}-${size || 'default'}-${monogram || 'none'}`;
    
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            selectedColor: colorName,
            selectedSize: size,
            monogram,
            quantity,
            price: product.price,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleBuyNow = (
    product: Product,
    colorName: string,
    size?: string,
    monogram?: string,
    quantity = 1
  ) => {
    handleAddToCart(product, colorName, size, monogram, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(cartItemId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleOpenBulkModal = (product?: Product) => {
    setBulkProduct(product || null);
    setIsBulkModalOpen(true);
  };

  const handleOpenCheckout = (promoDiscount: number, promoCode: string) => {
    setCheckoutPromo({ discount: promoDiscount, code: promoCode });
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
  };

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#231f1c]">
      {/* Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onNavigateToShop={(cat) => {
              if (cat) setSelectedCategory(cat);
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToStory={() => {
              setActivePage('story');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBulkModal={handleOpenBulkModal}
          />
        )}

        {activePage === 'shop' && (
          <ShopPage
            products={PRODUCTS}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activePage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={PRODUCTS}
            onBackToShop={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onOpenBulkModal={handleOpenBulkModal}
            wishlistIds={wishlistIds}
          />
        )}

        {activePage === 'story' && (
          <StoryPage
            onNavigateToShop={(cat) => {
              if (cat) setSelectedCategory(cat);
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToContact={() => {
              setActivePage('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={setActivePage}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOpenCheckout={handleOpenCheckout}
        onNavigateToShop={() => {
          setActivePage('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onViewFullDetails={(p) => {
          handleSelectProduct(p);
          setQuickViewProduct(null);
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        promoDiscount={checkoutPromo.discount}
        promoCode={checkoutPromo.code}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Corporate & Bulk Inquiry Modal */}
      <BulkInquiryModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        initialProduct={bulkProduct}
      />
    </div>
  );
}
