import React, { useState, useEffect } from 'react';
import { ActivePage, ProductCategory, Product, CartItem, HomePageConfig, CategoryMeta } from './types';
import { PRODUCTS } from './data/products';
import { DEFAULT_CATEGORIES } from './data/categories';
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
import { AdminPage } from './pages/AdminPage';
import {
  fetchProductsApi,
  fetchCategoriesApi,
  fetchSiteConfigApi,
  saveProductApi,
  deleteProductApi,
  saveCategoryApi,
  deleteCategoryApi,
  updateSiteConfigApi,
} from './services/api';
import { getUserSession, syncUserSession, trackUserAction } from './utils/session';

const DEFAULT_HOME_CONFIG: HomePageConfig = {
  heroProductId: 'heritage-satchel',
  bentoSecondaryId: 'classic-bifold-wallet',
  featuredProductIds: [
    'heritage-satchel',
    'classic-bifold-wallet',
    'bridle-leather-belt',
    'artisan-derby-shoes',
    'artisan-leather-slippers',
    'signature-leather-tote',
  ],
  announcementText: 'NEW IN 2026 • EVERYDAY LEATHER ESSENTIALS FOR DAILY USE',
  announcementLocation: 'PRODDATUR SHOWROOM',
  announcementBadge: 'SIMPLE & HONEST VALUE',
  whatsappNumber: '917386500505',
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Categories State with localStorage persistence
  const [categories, setCategories] = useState<CategoryMeta[]>(() => {
    try {
      const saved = localStorage.getItem('althaf_leathers_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('althaf_leathers_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  }, [categories]);

  // Dynamic Products State with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('althaf_leathers_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Homepage Products Display Config
  const [homeConfig, setHomeConfig] = useState<HomePageConfig>(() => {
    try {
      const saved = localStorage.getItem('althaf_leathers_home_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.whatsappNumber ||
          parsed.whatsappNumber === '919876543210' ||
          parsed.whatsappNumber === '9876543210' ||
          parsed.whatsappNumber === '918564250112' ||
          parsed.whatsappNumber === '8564250112' ||
          parsed.whatsappNumber === '91824767751' ||
          parsed.whatsappNumber === '824767751' ||
          parsed.whatsappNumber === '918247677511' ||
          parsed.whatsappNumber.includes('98765')
        ) {
          parsed.whatsappNumber = '917386500505';
        }
        return { ...DEFAULT_HOME_CONFIG, ...parsed };
      }
      return DEFAULT_HOME_CONFIG;
    } catch {
      return DEFAULT_HOME_CONFIG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('althaf_leathers_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('althaf_leathers_home_config', JSON.stringify(homeConfig));
    } catch (e) {
      console.error('Failed to save homepage config:', e);
    }
  }, [homeConfig]);

  // --- Dynamic URL & History State Synchronization ---
  const syncUrlWithState = (
    page: ActivePage,
    prod?: Product | null,
    cat?: ProductCategory,
    replace = false
  ) => {
    try {
      let targetSearch = '';
      if (page === 'product-detail' && prod) {
        targetSearch = `?page=product&id=${encodeURIComponent(prod.id)}`;
      } else if (page === 'shop') {
        targetSearch =
          cat && cat !== 'All'
            ? `?page=shop&category=${encodeURIComponent(cat)}`
            : `?page=shop`;
      } else if (page === 'story') {
        targetSearch = `?page=story`;
      } else if (page === 'contact') {
        targetSearch = `?page=contact`;
      } else if (page === 'admin') {
        targetSearch = `?page=admin`;
      } else {
        targetSearch = '';
      }

      const targetPath = window.location.pathname + targetSearch;
      if (window.location.search !== targetSearch) {
        if (replace) {
          window.history.replaceState({ page, productId: prod?.id, category: cat }, '', targetPath);
        } else {
          window.history.pushState({ page, productId: prod?.id, category: cat }, '', targetPath);
        }
      }
    } catch {
      // history API unavailable in some sandboxes
    }
  };

  // Sync state from current browser URL
  const syncStateFromUrl = (currentProducts: Product[]) => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      const idParam = params.get('id') || params.get('product');
      const catParam = params.get('category');

      if ((pageParam === 'product' || idParam) && currentProducts.length > 0) {
        const found = currentProducts.find(
          (p) =>
            p.id === idParam ||
            p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === idParam
        );
        if (found) {
          setSelectedProduct(found);
          setActivePage('product-detail');
          return true;
        }
      }

      if (pageParam === 'shop') {
        setActivePage('shop');
        if (catParam) setSelectedCategory(catParam as ProductCategory);
        return true;
      }

      if (pageParam === 'story') {
        setActivePage('story');
        return true;
      }

      if (pageParam === 'contact') {
        setActivePage('contact');
        return true;
      }

      if (pageParam === 'admin') {
        setActivePage('admin');
        return true;
      }

      if (pageParam === 'home') {
        setActivePage('home');
        return true;
      }
    } catch (e) {
      console.warn('Failed parsing URL params:', e);
    }
    return false;
  };

  // Sync from SQLite database and handle initial deep-link
  const syncCatalogFromDb = async () => {
    try {
      const [dbProductsRes, dbCatsRes, dbConfigRes] = await Promise.allSettled([
        fetchProductsApi(),
        fetchCategoriesApi(),
        fetchSiteConfigApi(),
      ]);

      if (dbProductsRes.status === 'fulfilled' && dbProductsRes.value.length > 0) {
        setProducts(dbProductsRes.value);
        syncStateFromUrl(dbProductsRes.value);
      }
      if (dbCatsRes.status === 'fulfilled' && dbCatsRes.value.length > 0) {
        setCategories(dbCatsRes.value);
      }
      if (dbConfigRes.status === 'fulfilled' && dbConfigRes.value) {
        setHomeConfig(dbConfigRes.value);
      }
    } catch (err) {
      console.warn('[SQLite] Catalog sync fallback:', err);
    }
  };

  // Initial sync from SQLite database on mount & listen to browser history
  useEffect(() => {
    syncCatalogFromDb();

    const handlePopState = () => {
      syncStateFromUrl(products);
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        syncCatalogFromDb();
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, []);

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

  // Cart & Wishlist persistence (Strictly empty default for a clean user state)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('althaf_leathers_cart');
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('althaf_leathers_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('althaf_leathers_cart', JSON.stringify(cartItems));
      syncUserSession({ cart: cartItems });
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('althaf_leathers_wishlist', JSON.stringify(wishlistIds));
      syncUserSession({ wishlist: wishlistIds });
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlistIds]);

  // Dynamic Navigation Handlers with URL synchronization
  const handleNavigatePage = (
    page: ActivePage,
    category?: ProductCategory,
    product?: Product | null
  ) => {
    setActivePage(page);
    if (category) setSelectedCategory(category);
    if (product !== undefined) setSelectedProduct(product);
    syncUrlWithState(page, product, category || selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    syncUrlWithState('product-detail', product, product.category);
    trackUserAction('view_product', { productId: product.id, name: product.name });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (
    product: Product,
    colorName: string,
    size?: string,
    quantity = 1
  ) => {
    const cartItemId = `${product.id}-${colorName}-${size || 'default'}`;
    
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
    quantity = 1
  ) => {
    handleAddToCart(product, colorName, size, quantity);
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

  // Admin Handlers with SQLite persistence
  const handleSaveProduct = async (productToSave: Product, isNew: boolean) => {
    // Optimistic state update
    setProducts((prev) => {
      if (isNew) {
        return [productToSave, ...prev];
      } else {
        return prev.map((p) => (p.id === productToSave.id ? productToSave : p));
      }
    });

    if (selectedProduct && selectedProduct.id === productToSave.id) {
      setSelectedProduct(productToSave);
    }

    try {
      const saved = await saveProductApi(productToSave, isNew);
      // Sync with returned object
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    } catch (err) {
      console.warn('[SQLite] Failed to persist product to SQLite:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    
    // Clean up home config if needed
    setHomeConfig((prev) => ({
      ...prev,
      heroProductId: prev.heroProductId === productId ? products.find((p) => p.id !== productId)?.id || '' : prev.heroProductId,
      bentoSecondaryId: prev.bentoSecondaryId === productId ? products.find((p) => p.id !== productId)?.id || '' : prev.bentoSecondaryId,
      featuredProductIds: prev.featuredProductIds.filter((id) => id !== productId),
    }));

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
      setActivePage('shop');
    }

    try {
      await deleteProductApi(productId);
    } catch (err) {
      console.warn('[SQLite] Failed to delete product from SQLite:', err);
    }
  };

  const handleSaveCategory = async (categoryToSave: CategoryMeta, isNew: boolean = false) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === categoryToSave.id);
      if (exists) {
        return prev.map((c) => (c.id === categoryToSave.id ? categoryToSave : c));
      } else {
        return [...prev, categoryToSave];
      }
    });

    try {
      const saved = await saveCategoryApi(categoryToSave, isNew);
      setCategories((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
    } catch (err) {
      console.warn('[SQLite] Failed to persist category to SQLite:', err);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory('All');
    }

    try {
      await deleteCategoryApi(categoryId);
    } catch (err) {
      console.warn('[SQLite] Failed to delete category from SQLite:', err);
    }
  };

  const handleSaveHomeConfig = async (newConfig: HomePageConfig) => {
    setHomeConfig(newConfig);
    try {
      await updateSiteConfigApi(newConfig);
    } catch (err) {
      console.warn('[SQLite] Failed to persist home config to SQLite:', err);
    }
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#231f1c]">
      {/* Header */}
      <Header
        activePage={activePage}
        setActivePage={(page) => handleNavigatePage(page)}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigatePage('shop', cat);
        }}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBulkModal={() => handleOpenBulkModal()}
        categories={categories}
        homeConfig={homeConfig}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            products={products}
            homeConfig={homeConfig}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onNavigateToShop={(cat) => {
              handleNavigatePage('shop', cat || selectedCategory);
            }}
            onNavigateToStory={() => {
              handleNavigatePage('story');
            }}
            onOpenBulkModal={handleOpenBulkModal}
            categories={categories}
          />
        )}

        {activePage === 'shop' && (
          <ShopPage
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => {
              setSelectedCategory(cat);
              syncUrlWithState('shop', undefined, cat);
            }}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            categories={categories}
          />
        )}

        {activePage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBackToShop={() => {
              handleNavigatePage('shop', selectedProduct.category);
            }}
            onNavigateToHome={() => {
              handleNavigatePage('home');
            }}
            onNavigateToShop={(cat) => {
              handleNavigatePage('shop', cat || 'All');
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
              handleNavigatePage('shop', cat || selectedCategory);
            }}
            onNavigateToContact={() => {
              handleNavigatePage('contact');
            }}
          />
        )}

        {activePage === 'contact' && <ContactPage />}

        {activePage === 'admin' && (
          <AdminPage
            products={products}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
            homeConfig={homeConfig}
            onSaveHomeConfig={handleSaveHomeConfig}
            onNavigateToHome={() => {
              handleNavigatePage('home');
            }}
            onNavigateToShop={(cat) => {
              handleNavigatePage('shop', cat || selectedCategory);
            }}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={(page) => handleNavigatePage(page)}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigatePage('shop', cat);
        }}
        showTrustPillars={activePage === 'home'}
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
        products={products}
        onNavigateToAdmin={() => {
          setActivePage('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
        whatsappNumber={homeConfig.whatsappNumber}
      />

      {/* Corporate & Bulk Inquiry Modal */}
      <BulkInquiryModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        initialProduct={bulkProduct}
        whatsappNumber={homeConfig.whatsappNumber}
      />
    </div>
  );
}

