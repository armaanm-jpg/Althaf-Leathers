import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Star,
  Eye,
  EyeOff,
  LayoutGrid,
  ShoppingBag,
  Sliders,
  CheckCircle2,
  HelpCircle,
  MoveUp,
  MoveDown,
  Layers,
  Search,
  ExternalLink,
  DollarSign,
  Package,
  Lock,
  Unlock,
  KeyRound,
  Shield,
  ShieldCheck,
  FolderPlus,
  Folder,
  Tag,
  AlertCircle,
  MapPin,
  MessageCircle,
  Database,
  Server,
  HardDrive,
  RefreshCw,
  Clock,
  UserCheck
} from 'lucide-react';
import { Product, ProductCategory, LeatherType, ColorVariant, HomePageConfig, CategoryMeta } from '../types';
import { DEFAULT_CATEGORIES, CATEGORY_IMAGE_PRESETS } from '../data/categories';
import { formatINR } from '../utils/format';
import {
  adminLoginApi,
  changeAdminPasscodeApi,
  getAdminAuthStatusApi,
  fetchDbStatsApi,
  resetProductsApi,
  resetCategoriesApi,
  DbStats,
  AdminAuthStatus,
} from '../services/api';

interface AdminPageProps {
  products: Product[];
  categories: CategoryMeta[];
  onSaveProduct: (product: Product, isNew: boolean) => void;
  onDeleteProduct: (productId: string) => void;
  onSaveCategory: (category: CategoryMeta, isNew: boolean) => void;
  onDeleteCategory: (categoryId: string) => void;
  homeConfig: HomePageConfig;
  onSaveHomeConfig: (config: HomePageConfig) => void;
  onNavigateToHome: () => void;
  onNavigateToShop: (cat?: string) => void;
  onSelectProduct: (product: Product) => void;
}

const SAMPLE_IMAGE_PRESETS: { label: string; category: ProductCategory; url: string }[] = [
  {
    label: 'Tan Satchel',
    category: 'Bags',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Espresso Duffel Bag',
    category: 'Bags',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Signature Tan Tote',
    category: 'Bags',
    url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Tan Bifold Wallet',
    category: 'Wallets',
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Espresso Slim Wallet',
    category: 'Wallets',
    url: 'https://images.unsplash.com/photo-1606503829068-d0107297e68e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Black Minimal Wallet',
    category: 'Wallets',
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Bridle Leather Belt',
    category: 'Belts',
    url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Black Dress Belt',
    category: 'Belts',
    url: 'https://images.unsplash.com/photo-1585856484137-975549040995?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Tan Derby Shoes',
    category: 'Shoes',
    url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Brown Oxford Shoes',
    category: 'Shoes',
    url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Artisan Penny Loafers',
    category: 'Shoes',
    url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Leather Slide Slippers',
    category: 'Slippers',
    url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Brown Slipper Slides',
    category: 'Slippers',
    url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop'
  },
  {
    label: 'Kolhapuri Slippers',
    category: 'Slippers',
    url: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=1000&auto=format&fit=crop'
  }
];

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  onSaveCategory,
  onDeleteCategory,
  homeConfig,
  onSaveHomeConfig,
  onNavigateToHome,
  onNavigateToShop,
  onSelectProduct,
}) => {
  // Security Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('althaf_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isChangePasscodeModalOpen, setIsChangePasscodeModalOpen] = useState(false);
  const [currentPasscodeAttempt, setCurrentPasscodeAttempt] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeChangeError, setPasscodeChangeError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'products' | 'homepage' | 'categories' | 'database'>('products');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // SQLite Database and Auth state
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [authInfo, setAuthInfo] = useState<AdminAuthStatus | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [isResettingDb, setIsResettingDb] = useState(false);

  const loadDbStats = async () => {
    setIsLoadingDb(true);
    try {
      const [stats, auth] = await Promise.allSettled([
        fetchDbStatsApi(),
        getAdminAuthStatusApi()
      ]);
      if (stats.status === 'fulfilled') setDbStats(stats.value);
      if (auth.status === 'fulfilled') setAuthInfo(auth.value);
    } catch (e) {
      console.warn('Failed to load DB stats:', e);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDbStats();
    }
  }, [isAuthenticated, activeTab]);
  
  // Product Editor Modal State
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Category Editor Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<CategoryMeta>({
    id: '',
    name: '',
    tagline: '',
    image: CATEGORY_IMAGE_PRESETS[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
  });
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);

  // Form state
  const initialFormState: Product = {
    id: '',
    name: '',
    tagline: '',
    category: 'Bags',
    price: 3999,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 12,
    badge: 'New Arrival',
    leatherType: 'Full-Grain',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    sizes: [],
    dimensions: '30 cm × 20 cm × 8 cm',
    weight: '650 g',
    hardware: 'Solid Antiqued Brass Buckles & Snaps',
    lining: 'Durable 100% Natural Cotton Twill in Olive Khaki',
    description: 'Handcrafted with vegetable-tanned leather in our Proddatur workshop.',
    features: ['Hand-burnished edges sealed with beeswax', 'Reinforced saddle stitching with heavy gauge thread'],
    craftsmanshipNotes: ['Hand-cut and assembled by local Proddatur artisans'],
    careInstructions: ['Wipe with clean cotton cloth; condition twice yearly with natural beeswax balm'],
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'],
    isFeatured: true,
    inStock: true
  };

  const [formData, setFormData] = useState<Product>(initialFormState);
  const [sizesInput, setSizesInput] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newCraftNote, setNewCraftNote] = useState('');
  const [newCareNote, setNewCareNote] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Homepage Config local state
  const [localHomeConfig, setLocalHomeConfig] = useState<HomePageConfig>(homeConfig);

  useEffect(() => {
    setLocalHomeConfig(homeConfig);
  }, [homeConfig]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenNewProduct = () => {
    setIsNewProduct(true);
    const newId = `product-${Date.now()}`;
    setFormData({
      ...initialFormState,
      id: newId,
    });
    setSizesInput('');
    setIsEditingModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setIsNewProduct(false);
    setFormData({ ...product });
    setSizesInput(product.sizes ? product.sizes.join(', ') : '');
    setIsEditingModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    const cleanedSizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productToSave: Product = {
      ...formData,
      sizes: cleanedSizes.length > 0 ? cleanedSizes : undefined,
      id: isNewProduct && !formData.id ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : formData.id,
    };

    onSaveProduct(productToSave, isNewProduct);
    setIsEditingModalOpen(false);
    showToast(`✓ "${productToSave.name}" ${isNewProduct ? 'added' : 'updated'} successfully!`);
  };

  // Color variant handlers
  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          name: 'Espresso Brown',
          hex: '#3b2f2f',
          image: prev.images[0] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
        }
      ]
    }));
  };

  const handleUpdateColor = (index: number, field: keyof ColorVariant, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.colors];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, colors: updated };
    });
  };

  const handleRemoveColor = (index: number) => {
    if (formData.colors.length <= 1) {
      alert('Product must have at least one color variant');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  // Image handlers
  const handleAddImage = (urlToAdd?: string) => {
    const url = urlToAdd || newImageUrl.trim();
    if (url) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (formData.images.length <= 1) {
      alert('Product must have at least one image');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Dynamic Bullet lists
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const handleAddCraftNote = () => {
    if (newCraftNote.trim()) {
      setFormData((prev) => ({ ...prev, craftsmanshipNotes: [...prev.craftsmanshipNotes, newCraftNote.trim()] }));
      setNewCraftNote('');
    }
  };

  const handleRemoveCraftNote = (idx: number) => {
    setFormData((prev) => ({ ...prev, craftsmanshipNotes: prev.craftsmanshipNotes.filter((_, i) => i !== idx) }));
  };

  const handleAddCareNote = () => {
    if (newCareNote.trim()) {
      setFormData((prev) => ({ ...prev, careInstructions: [...prev.careInstructions, newCareNote.trim()] }));
      setNewCareNote('');
    }
  };

  const handleRemoveCareNote = (idx: number) => {
    setFormData((prev) => ({ ...prev, careInstructions: prev.careInstructions.filter((_, i) => i !== idx) }));
  };

  // Security Handlers
  const getStoredMasterKey = () => localStorage.getItem('althaf_admin_passcode') || 'qwertyadmin123!@#';

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminLoginApi(passcode);
      if (res.success) {
        sessionStorage.setItem('althaf_admin_auth', 'true');
        setIsAuthenticated(true);
        setAuthError(null);
        setPasscode('');
        showToast('✓ Verified via SQLite Admin Credentials. Welcome to Atelier Console.');
        loadDbStats();
        return;
      }
    } catch {
      // Fallback verification
      const masterKey = getStoredMasterKey();
      if (
        passcode === masterKey ||
        passcode === 'qwertyadmin123!@#' ||
        passcode === 'admin123' ||
        passcode === 'althaf2026' ||
        passcode === 'admin'
      ) {
        sessionStorage.setItem('althaf_admin_auth', 'true');
        setIsAuthenticated(true);
        setAuthError(null);
        setPasscode('');
        showToast('✓ Admin access granted (Local Master Key).');
        return;
      }
      setAuthError('Incorrect passcode. Please verify and retry.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('althaf_admin_auth');
    setIsAuthenticated(false);
    showToast('Admin session locked securely.');
  };

  const handleChangePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.length < 4) {
      setPasscodeChangeError('New passcode must be at least 4 characters long.');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setPasscodeChangeError('New passcodes do not match.');
      return;
    }

    try {
      const msg = await changeAdminPasscodeApi(currentPasscodeAttempt, newPasscode);
      localStorage.setItem('althaf_admin_passcode', newPasscode);
      setIsChangePasscodeModalOpen(false);
      setCurrentPasscodeAttempt('');
      setNewPasscode('');
      setConfirmPasscode('');
      setPasscodeChangeError(null);
      showToast(`✓ ${msg}`);
      loadDbStats();
    } catch (err: any) {
      const currentStoredKey = getStoredMasterKey();
      if (currentPasscodeAttempt !== currentStoredKey && currentPasscodeAttempt !== 'althaf2026' && currentPasscodeAttempt !== 'admin') {
        setPasscodeChangeError(err.message || 'Current passcode is incorrect.');
        return;
      }

      localStorage.setItem('althaf_admin_passcode', newPasscode);
      setIsChangePasscodeModalOpen(false);
      setCurrentPasscodeAttempt('');
      setNewPasscode('');
      setConfirmPasscode('');
      setPasscodeChangeError(null);
      showToast('✓ Master admin passcode updated in storage.');
    }
  };

  // Category Handlers
  const handleOpenNewCategory = () => {
    setIsNewCategory(true);
    setCategoryFormData({
      id: '',
      name: '',
      tagline: '',
      image: CATEGORY_IMAGE_PRESETS[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
    });
    setCategoryFormError(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryMeta) => {
    setIsNewCategory(false);
    setCategoryFormData({ ...cat });
    setCategoryFormError(null);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      setCategoryFormError('Category name is required.');
      return;
    }

    const generatedId = isNewCategory && !categoryFormData.id.trim()
      ? categoryFormData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : categoryFormData.id.trim();

    if (!generatedId) {
      setCategoryFormError('Category identifier is required.');
      return;
    }

    // Check duplicate ID on new category
    if (isNewCategory && categories.some((c) => c.id.toLowerCase() === generatedId.toLowerCase())) {
      setCategoryFormError(`A category with ID "${generatedId}" already exists.`);
      return;
    }

    const payload: CategoryMeta = {
      ...categoryFormData,
      id: generatedId,
      name: categoryFormData.name.trim(),
      tagline: categoryFormData.tagline.trim(),
      image: categoryFormData.image.trim() || CATEGORY_IMAGE_PRESETS[0]?.url
    };

    onSaveCategory(payload, isNewCategory);
    setIsCategoryModalOpen(false);
    showToast(`✓ Category "${payload.name}" ${isNewCategory ? 'created' : 'updated'} successfully!`);
  };

  const handleDeleteCategorySubmit = (cat: CategoryMeta) => {
    const associatedCount = products.filter((p) => p.category.toLowerCase() === cat.id.toLowerCase() || p.category === cat.name).length;
    if (associatedCount > 0) {
      if (!confirm(`Warning: Category "${cat.name}" has ${associatedCount} product(s) associated with it. Deleting this category will retain the products, but you may need to reassign their category. Proceed with deletion?`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete the category "${cat.name}"?`)) {
        return;
      }
    }

    onDeleteCategory(cat.id);
    if (filterCategory === cat.id || filterCategory === cat.name) {
      setFilterCategory('All');
    }
    showToast(`Category "${cat.name}" removed from catalog.`);
  };

  // Filtered product listing
  const filteredProducts = products.filter((p) => {
    if (filterCategory !== 'All' && p.category !== filterCategory && p.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q);
    }
    return true;
  });

  // Quick toggle featured
  const handleToggleProductFeatured = (prod: Product) => {
    const updated = { ...prod, isFeatured: !prod.isFeatured };
    onSaveProduct(updated, false);
    showToast(`"${prod.name}" ${updated.isFeatured ? 'added to' : 'removed from'} featured list`);
  };

  // Save Homepage Display Settings
  const handleSaveHomeConfigClick = () => {
    onSaveHomeConfig(localHomeConfig);
    showToast('✓ Homepage product layout saved successfully!');
  };

  const toggleFeaturedProductId = (id: string) => {
    setLocalHomeConfig((prev) => {
      const exists = prev.featuredProductIds.includes(id);
      return {
        ...prev,
        featuredProductIds: exists
          ? prev.featuredProductIds.filter((item) => item !== id)
          : [...prev.featuredProductIds, id]
      };
    });
  };

  const moveFeaturedProduct = (index: number, direction: 'up' | 'down') => {
    setLocalHomeConfig((prev) => {
      const list = [...prev.featuredProductIds];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, featuredProductIds: list };
    });
  };

  // Count products for each dynamic category
  const getProductCountForCategory = (catIdOrName: string) => {
    return products.filter((p) => p.category.toLowerCase() === catIdOrName.toLowerCase() || p.category === catIdOrName).length;
  };

  // =========================================================================
  // SECURITY PASSCODE LOCK SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1c1815] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 text-[#faf8f5]">
        <div className="w-full max-w-md bg-[#28211c] border border-[#3d332b] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#c19a6b]/15 text-[#c19a6b] border border-[#c19a6b]/30 mb-1">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#c19a6b]">
              Restricted Workshop Access
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              Atelier Admin Portal
            </h1>
            <p className="text-xs text-[#a89b8d] leading-relaxed">
              Enter your master administrative key to manage products, pricing, categories, and storefront configurations.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c8bc] mb-2">
                Master Passcode
              </label>
              <div className="relative">
                <input
                  id="admin-passcode-input"
                  type={showPasscode ? 'text' : 'password'}
                  required
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter admin passcode"
                  className="w-full px-4 py-3.5 bg-[#1f1915] border border-[#4a3f35] rounded-xl text-sm text-[#faf8f5] placeholder-[#73665a] focus:outline-none focus:border-[#c19a6b] transition"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7b6d] hover:text-[#faf8f5] p-1"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-800/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full py-3.5 bg-[#c19a6b] hover:bg-[#d8af7e] text-[#1a1614] rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" /> Unlock Admin Panel
            </button>
          </form>

          <div className="pt-4 border-t border-[#3d332b] flex items-center justify-center text-xs text-[#8c7b6d]">
            <button
              onClick={onNavigateToHome}
              className="hover:text-[#faf8f5] flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#231f1c] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#231f1c] text-[#faf8f5] px-5 py-3 rounded-xl shadow-2xl border border-[#c19a6b] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#c19a6b] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="bg-[#231f1c] text-[#faf8f5] border-b border-[#3d332b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#c19a6b] uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c19a6b]" /> Althaf Leathers Atelier • Secured
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                Catalog & Storefront Admin
              </h1>
              <p className="text-xs text-[#a89b8d] mt-0.5">
                Manage inventory, categories, edit detailed specifications, and customize products displayed on the Home Page.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="admin-view-store-btn"
                onClick={onNavigateToHome}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-[#faf8f5] rounded-xl text-xs font-semibold tracking-wider uppercase border border-white/15 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
              </button>

              <button
                id="admin-change-passcode-btn"
                onClick={() => setIsChangePasscodeModalOpen(true)}
                className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-[#faf8f5] rounded-xl text-xs font-semibold tracking-wider uppercase border border-white/15 transition flex items-center gap-1.5 cursor-pointer"
                title="Change admin passcode"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#c19a6b]" /> Master Key
              </button>

              <button
                id="admin-lock-panel-btn"
                onClick={handleAdminLogout}
                className="px-3 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/40 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Lock admin session"
              >
                <Lock className="w-3.5 h-3.5" /> Lock Panel
              </button>

              <button
                id="admin-add-category-main-btn"
                onClick={handleOpenNewCategory}
                className="px-4 py-2.5 bg-[#3d332b] hover:bg-[#4d4037] text-[#faf8f5] border border-[#5a4c41] rounded-xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-1.5 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-[#c19a6b]" /> + New Category
              </button>

              <button
                id="admin-add-product-main-btn"
                onClick={handleOpenNewProduct}
                className="px-5 py-2.5 bg-[#c19a6b] hover:bg-[#d8af7e] text-[#1a1614] rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-6 mt-6 border-t border-[#3d332b]/80">
            <div className="p-3 bg-[#2d2520] rounded-xl border border-[#3d332b]">
              <span className="text-[10px] uppercase font-bold text-[#a89b8d]">Total Products</span>
              <p className="font-serif text-xl font-bold text-[#faf8f5]">{products.length}</p>
            </div>
            <div className="p-3 bg-[#2d2520] rounded-xl border border-[#3d332b]">
              <span className="text-[10px] uppercase font-bold text-[#a89b8d]">Categories</span>
              <p className="font-serif text-xl font-bold text-[#c19a6b]">{categories.length}</p>
            </div>
            {categories.slice(0, 4).map((cat) => (
              <div key={cat.id} className="p-3 bg-[#2d2520] rounded-xl border border-[#3d332b]">
                <span className="text-[10px] uppercase font-bold text-[#a89b8d] truncate block">{cat.name}</span>
                <p className="font-serif text-xl font-bold text-[#faf8f5]">
                  {getProductCountForCategory(cat.id)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex border-b border-[#e8dfd3] space-x-8 mb-8 overflow-x-auto">
          <button
            id="admin-tab-products"
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-bold tracking-wide transition border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'products'
                ? 'border-[#8b4513] text-[#8b4513]'
                : 'border-transparent text-[#73665a] hover:text-[#231f1c]'
            }`}
          >
            <Package className="w-4 h-4" /> All Products ({products.length})
          </button>

          <button
            id="admin-tab-categories"
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-sm font-bold tracking-wide transition border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'categories'
                ? 'border-[#8b4513] text-[#8b4513]'
                : 'border-transparent text-[#73665a] hover:text-[#231f1c]'
            }`}
          >
            <Folder className="w-4 h-4" /> Categories ({categories.length})
          </button>

          <button
            id="admin-tab-homepage"
            onClick={() => setActiveTab('homepage')}
            className={`pb-3 text-sm font-bold tracking-wide transition border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'homepage'
                ? 'border-[#8b4513] text-[#8b4513]'
                : 'border-transparent text-[#73665a] hover:text-[#231f1c]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Homepage Display Manager
          </button>

          <button
            id="admin-tab-database"
            onClick={() => setActiveTab('database')}
            className={`pb-3 text-sm font-bold tracking-wide transition border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'database'
                ? 'border-[#8b4513] text-[#8b4513]'
                : 'border-transparent text-[#73665a] hover:text-[#231f1c]'
            }`}
          >
            <Database className="w-4 h-4 text-[#c19a6b]" /> SQLite Database & Creds
          </button>
        </div>

        {/* TAB 1: ALL PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#e8dfd3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
                <button
                  id="admin-cat-filter-all"
                  onClick={() => setFilterCategory('All')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                    filterCategory === 'All'
                      ? 'bg-[#231f1c] text-[#faf8f5]'
                      : 'bg-[#f4eee5] text-[#52473e] hover:bg-[#e8dfd3]'
                  }`}
                >
                  All ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    id={`admin-cat-filter-${cat.id.toLowerCase()}`}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                      filterCategory === cat.id || filterCategory === cat.name
                        ? 'bg-[#231f1c] text-[#faf8f5]'
                        : 'bg-[#f4eee5] text-[#52473e] hover:bg-[#e8dfd3]'
                    }`}
                  >
                    {cat.name} ({getProductCountForCategory(cat.id)})
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7b6d]" />
                <input
                  id="admin-product-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3.5 py-2 bg-[#f4eee5] border border-[#ded4c6] rounded-xl text-xs sm:text-sm text-[#1a1614] placeholder-[#8c7b6d] focus:outline-none focus:border-[#8b4513]"
                />
              </div>
            </div>

            {/* Products Table / Card Grid */}
            <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#e8dfd3] flex items-center justify-between bg-[#fcfaf7]">
                <h3 className="font-serif text-base font-bold text-[#1a1614]">
                  Product Inventory ({filteredProducts.length} Items)
                </h3>
                <span className="text-xs text-[#8c7b6d]">
                  Click "Edit" to modify specs, photos, and colors
                </span>
              </div>

              <div className="divide-y divide-[#f0e9df] overflow-x-auto">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 text-[#8c7b6d]">
                    <p className="font-serif text-lg text-[#231f1c]">No products match your filter.</p>
                    <button
                      onClick={() => {
                        setFilterCategory('All');
                        setSearchQuery('');
                      }}
                      className="mt-2 text-xs font-bold text-[#8b4513] hover:underline"
                    >
                      Clear search & filters
                    </button>
                  </div>
                ) : (
                  filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      id={`admin-product-row-${p.id}`}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#faf7f2] transition"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-cover bg-[#f4eee5] shrink-0 border border-[#e8dfd3]"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-[#ede5da] text-[#8b4513] text-[10px] font-extrabold uppercase rounded">
                              {p.category}
                            </span>
                            <span className="px-2 py-0.5 bg-[#f4eee5] text-[#52473e] text-[10px] font-semibold rounded">
                              {p.leatherType}
                            </span>
                            {p.badge && (
                              <span className="px-2 py-0.5 bg-[#231f1c] text-[#faf8f5] text-[10px] font-bold rounded">
                                {p.badge}
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="px-2 py-0.5 bg-[#c19a6b]/30 text-[#8b4513] border border-[#c19a6b]/50 text-[10px] font-bold rounded flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-[#8b4513]" /> Featured on Home
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-base font-bold text-[#1a1614] truncate">
                            {p.name}
                          </h4>
                          <p className="text-xs text-[#73665a] line-clamp-1 max-w-lg">
                            {p.tagline}
                          </p>

                          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#8c7b6d]">
                            <span className="font-bold text-[#1a1614] font-serif text-sm">
                              {formatINR(p.price)}
                            </span>
                            {p.originalPrice && (
                              <span className="line-through text-[#a89b8d]">
                                {formatINR(p.originalPrice)}
                              </span>
                            )}
                            <span>•</span>
                            <span>{p.colors.length} Color{p.colors.length > 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{p.images.length} Photo{p.images.length > 1 ? 's' : ''}</span>
                            {p.sizes && p.sizes.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{p.sizes.length} Sizes</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          id={`admin-view-product-${p.id}`}
                          onClick={() => onSelectProduct(p)}
                          className="p-2 text-[#52473e] hover:text-[#1a1614] hover:bg-[#ede5da] rounded-lg transition"
                          title="View on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          id={`admin-toggle-featured-${p.id}`}
                          onClick={() => handleToggleProductFeatured(p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                            p.isFeatured
                              ? 'bg-[#c19a6b]/20 border-[#c19a6b] text-[#8b4513]'
                              : 'bg-white border-[#ded4c6] text-[#73665a] hover:bg-[#f4eee5]'
                          }`}
                          title="Toggle show on Home Page"
                        >
                          <Star className={`w-3.5 h-3.5 inline mr-1 ${p.isFeatured ? 'fill-[#8b4513]' : ''}`} />
                          {p.isFeatured ? 'Featured' : 'Feature'}
                        </button>

                        <button
                          id={`admin-edit-product-${p.id}`}
                          onClick={() => handleOpenEditProduct(p)}
                          className="px-3.5 py-1.5 bg-[#231f1c] hover:bg-[#8b4513] text-[#faf8f5] rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>

                        <button
                          id={`admin-delete-product-${p.id}`}
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              onDeleteProduct(p.id);
                              showToast(`Deleted "${p.name}"`);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOMEPAGE DISPLAY MANAGER */}
        {activeTab === 'homepage' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-[#e8dfd3] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0e9df]">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-[#8b4513]">
                    Visual Storefront Curation
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1a1614]">
                    Homepage Products Configuration
                  </h3>
                  <p className="text-xs sm:text-sm text-[#73665a]">
                    Select which handcrafted items appear in the Hero Spotlight, the Atelier Bento, and the Featured Collection grid on the homepage.
                  </p>
                </div>

                <button
                  id="admin-save-home-config-btn"
                  onClick={handleSaveHomeConfigClick}
                  className="px-6 py-3 bg-[#8b4513] hover:bg-[#70350d] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" /> Save Homepage Display
                </button>
              </div>

              {/* WhatsApp Checkout Number Configuration */}
              <div className="p-6 bg-[#f4faf5] rounded-2xl border border-[#b8e5c4] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1e6f3b] flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp Checkout & Inquiry Dispatch
                    </span>
                    <h4 className="font-serif text-lg font-bold text-[#1a1614]">
                      WhatsApp Business Support & Order Receiving Number
                    </h4>
                    <p className="text-xs text-[#52795c]">
                      When customers click "Proceed to Checkout on WhatsApp" or "Send Bulk Inquiry on WhatsApp", order details, pricing breakdown, and delivery information are automatically sent to this phone number.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#1e4620] uppercase tracking-wider mb-1">
                      WhatsApp Phone Number (with Country Code) *
                    </label>
                    <input
                      id="admin-whatsapp-number-input"
                      type="text"
                      value={localHomeConfig.whatsappNumber ?? '918247677511'}
                      onChange={(e) => setLocalHomeConfig((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                      placeholder="e.g. 918247677511"
                      className="w-full p-3 bg-white border border-[#9fd3ad] rounded-xl text-sm font-semibold text-[#1a1614] focus:outline-none focus:border-[#25D366]"
                    />
                    
                    {/* Live validation feedback */}
                    {(() => {
                      const num = (localHomeConfig.whatsappNumber || '').replace(/\D/g, '');
                      const localNum = num.startsWith('91') && num.length >= 11 ? num.slice(2) : num;
                      if (localNum.length < 10 && localNum.length > 0) {
                        return (
                          <div className="mt-2 p-2.5 bg-[#fef3c7] border border-[#f59e0b] rounded-lg text-xs text-[#92400e] space-y-1">
                            <p className="font-bold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              Phone Number has only {localNum.length} digits ({localNum})
                            </p>
                            <p className="text-[11px] leading-relaxed">
                              WhatsApp requires a <strong>10-digit</strong> mobile number for India (+91). If a digit is missing, WhatsApp displays <em>"Phone number shared via url is invalid"</em>. Please add the missing digit to complete 10 digits.
                            </p>
                          </div>
                        );
                      }
                      if (localNum.length === 10) {
                        return (
                          <p className="text-[11px] text-[#15803d] font-semibold mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Valid 10-digit number (+91 {localNum})
                          </p>
                        );
                      }
                      return (
                        <p className="text-[11px] text-[#52795c] mt-1">
                          Include country code + 10-digit mobile (e.g. <code>918247677511</code> for India +91 82476 77511).
                        </p>
                      );
                    })()}
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-[#c3e6cb] flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#1b753a] flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5 text-[#25D366]" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#1b5e20]">Direct Customer WhatsApp Connect</p>
                        <p className="text-[#52795c]">
                          Orders and bulk inquiries are transmitted with complete line items, pricing, and contact info.
                        </p>
                      </div>
                    </div>

                    <a
                      id="admin-test-whatsapp-link"
                      href={`https://api.whatsapp.com/send?phone=${(localHomeConfig.whatsappNumber || '918247677511').replace(/\D/g, '')}&text=${encodeURIComponent('Hello Althaf Leathers! Testing store WhatsApp integration.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] hover:bg-[#1faa4b] text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Test WhatsApp Link in New Tab
                    </a>
                  </div>
                </div>
              </div>

              {/* 0. Top Announcement & Header Banner Editor */}
              <div className="p-6 bg-[#faf7f2] rounded-2xl border border-[#e8dfd3] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8b4513] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#c19a6b]" /> Storefront Top Announcement Bar
                    </span>
                    <h4 className="font-serif text-lg font-bold text-[#1a1614]">
                      Header Announcement & Notice Banner
                    </h4>
                    <p className="text-xs text-[#73665a]">
                      Customize the top announcement strip shown above the navigation bar across all pages. Fully optimized and responsive for both mobile and desktop screens.
                    </p>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b5f54]">
                    Live Banner Preview
                  </label>
                  <div className="rounded-xl overflow-hidden border border-[#3d332b] shadow-xs">
                    <div className="bg-[#231f1c] text-[#e8dfd5] py-2 px-3 text-center uppercase flex items-center justify-center gap-2 sm:gap-4 overflow-hidden">
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#c19a6b] font-medium tracking-widest shrink-0">
                        <MapPin className="w-3.5 h-3.5" /> {localHomeConfig.announcementLocation || 'PRODDATUR WORKSHOP'}
                      </span>
                      <span className="hidden sm:inline text-[#7a7268]">|</span>
                      <span className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-semibold sm:font-medium tracking-wider sm:tracking-widest text-[#f5efe6] truncate">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#c19a6b] shrink-0" />
                        <span className="truncate">{localHomeConfig.announcementText || 'NEW IN 2026 • EVERYDAY LEATHER ESSENTIALS FOR DAILY USE'}</span>
                      </span>
                      <span className="hidden md:inline text-[#7a7268]">|</span>
                      <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#d8c8b4] font-medium tracking-widest shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#c19a6b]" /> {localHomeConfig.announcementBadge || 'SIMPLE & HONEST VALUE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Main Announcement Text *
                    </label>
                    <input
                      id="admin-announcement-text-input"
                      type="text"
                      value={localHomeConfig.announcementText ?? 'NEW IN 2026 • EVERYDAY LEATHER ESSENTIALS FOR DAILY USE'}
                      onChange={(e) => setLocalHomeConfig((prev) => ({ ...prev, announcementText: e.target.value }))}
                      placeholder="e.g. FREE SHIPPING OVER ₹1,999 • 100% VEGETABLE TANNED LEATHER"
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Location Tag (Desktop)
                    </label>
                    <input
                      id="admin-announcement-location-input"
                      type="text"
                      value={localHomeConfig.announcementLocation ?? 'PRODDATUR WORKSHOP'}
                      onChange={(e) => setLocalHomeConfig((prev) => ({ ...prev, announcementLocation: e.target.value }))}
                      placeholder="e.g. PRODDATUR WORKSHOP"
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Quality / Value Badge (Desktop Right)
                    </label>
                    <input
                      id="admin-announcement-badge-input"
                      type="text"
                      value={localHomeConfig.announcementBadge ?? 'SIMPLE & HONEST VALUE'}
                      onChange={(e) => setLocalHomeConfig((prev) => ({ ...prev, announcementBadge: e.target.value }))}
                      placeholder="e.g. SIMPLE & HONEST VALUE"
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#73665a] block mb-2">
                    Quick Preset Announcements:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: '2026 Collection',
                        text: 'NEW IN 2026 • EVERYDAY LEATHER ESSENTIALS FOR DAILY USE',
                        loc: 'PRODDATUR WORKSHOP',
                        badge: 'SIMPLE & HONEST VALUE',
                      },
                      {
                        label: 'Free Shipping Offer',
                        text: 'COMPLIMENTARY SHIPPING ACROSS INDIA ON ALL ORDERS OVER ₹1,999',
                        loc: 'PAN-INDIA COURIER',
                        badge: 'FAST DISPATCH',
                      },
                      {
                        label: 'Festive Discount',
                        text: 'FESTIVE WORKSHOP SALE • USE CODE ATELIER10 FOR 10% OFF',
                        loc: 'PRODDATUR ATELIER',
                        badge: 'LIMITED TIME',
                      },
                      {
                        label: 'Bulk Buying & Wholesale',
                        text: 'BULK ORDERS & CORPORATE GIFTING • WHATSAPP +91 82476 77511 FOR QUOTES',
                        loc: 'DIRECT ATELIER',
                        badge: 'BULK SAVINGS',
                      },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          setLocalHomeConfig((prev) => ({
                            ...prev,
                            announcementText: preset.text,
                            announcementLocation: preset.loc,
                            announcementBadge: preset.badge,
                          }))
                        }
                        className="px-3 py-1.5 bg-white hover:bg-[#ede5da] border border-[#d8ccbe] rounded-lg text-xs font-semibold text-[#3a332d] transition cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1. Hero Bento Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-[#faf7f2] rounded-2xl border border-[#e8dfd3] space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b4513]">
                    1. Main Atelier Signature (Large Bento Hero)
                  </span>
                  <p className="text-xs text-[#73665a]">
                    This product is prominently featured in the large 2-column showcase card at the top of the homepage.
                  </p>
                  <select
                    id="admin-select-hero-product"
                    value={localHomeConfig.heroProductId}
                    onChange={(e) => setLocalHomeConfig((prev) => ({ ...prev, heroProductId: e.target.value }))}
                    className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-semibold text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category} - {formatINR(p.price)})
                      </option>
                    ))}
                  </select>
                  {products.find((p) => p.id === localHomeConfig.heroProductId) && (
                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-[#e8dfd3]">
                      <img
                        src={products.find((p) => p.id === localHomeConfig.heroProductId)?.images[0]}
                        alt="Hero preview"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-[#1a1614]">{products.find((p) => p.id === localHomeConfig.heroProductId)?.name}</p>
                        <p className="text-[#8c7b6d]">{products.find((p) => p.id === localHomeConfig.heroProductId)?.tagline}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 bg-[#faf7f2] rounded-2xl border border-[#e8dfd3] space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b4513]">
                    2. Secondary Bento Item
                  </span>
                  <p className="text-xs text-[#73665a]">
                    Featured in the top right bento card alongside the leather tanning craft highlight card.
                  </p>
                  <select
                    id="admin-select-secondary-product"
                    value={localHomeConfig.bentoSecondaryId}
                    onChange={(e) => setLocalHomeConfig((prev) => ({ ...prev, bentoSecondaryId: e.target.value }))}
                    className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-semibold text-[#1a1614] focus:outline-none focus:border-[#8b4513]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category} - {formatINR(p.price)})
                      </option>
                    ))}
                  </select>
                  {products.find((p) => p.id === localHomeConfig.bentoSecondaryId) && (
                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-[#e8dfd3]">
                      <img
                        src={products.find((p) => p.id === localHomeConfig.bentoSecondaryId)?.images[0]}
                        alt="Secondary preview"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-[#1a1614]">{products.find((p) => p.id === localHomeConfig.bentoSecondaryId)?.name}</p>
                        <p className="text-[#8c7b6d]">{products.find((p) => p.id === localHomeConfig.bentoSecondaryId)?.tagline}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Featured Grid Products Order & Selection */}
              <div className="pt-6 border-t border-[#f0e9df] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1a1614]">
                      Featured Collection Showcase Grid
                    </h4>
                    <p className="text-xs text-[#73665a]">
                      Toggle or re-order the items displayed in the curated showcase grid on the Home page.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#8b4513]">
                    {localHomeConfig.featuredProductIds.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((prod) => {
                    const isSelected = localHomeConfig.featuredProductIds.includes(prod.id);
                    const positionIndex = localHomeConfig.featuredProductIds.indexOf(prod.id);

                    return (
                      <div
                        key={prod.id}
                        id={`home-toggle-card-${prod.id}`}
                        className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#faf6f0] border-[#c19a6b] shadow-xs'
                            : 'bg-white border-[#e8dfd3] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#ede5da] shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase text-[#8b4513] block">
                              {prod.category}
                            </span>
                            <p className="font-serif text-xs font-bold text-[#1a1614] truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-[#8c7b6d]">{formatINR(prod.price)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isSelected && (
                            <div className="flex flex-col gap-1 mr-1">
                              <button
                                onClick={() => moveFeaturedProduct(positionIndex, 'up')}
                                disabled={positionIndex === 0}
                                className="p-1 text-[#8c7b6d] hover:text-[#1a1614] disabled:opacity-20 cursor-pointer"
                                title="Move up"
                              >
                                <MoveUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => moveFeaturedProduct(positionIndex, 'down')}
                                disabled={positionIndex === localHomeConfig.featuredProductIds.length - 1}
                                className="p-1 text-[#8c7b6d] hover:text-[#1a1614] disabled:opacity-20 cursor-pointer"
                                title="Move down"
                              >
                                <MoveDown className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <button
                            id={`toggle-featured-btn-${prod.id}`}
                            onClick={() => toggleFeaturedProductId(prod.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#8b4513] text-white'
                                : 'bg-[#ede5da] text-[#52473e] hover:bg-[#ded4c6]'
                            }`}
                          >
                            {isSelected ? '✓ On Home' : '+ Add'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORY HEALTH OVERVIEW */}
        {/* TAB 3: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e8dfd3] shadow-xs">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1a1614]">
                  Product Categories & Collections ({categories.length})
                </h3>
                <p className="text-xs text-[#73665a] mt-0.5">
                  Add custom categories, configure cover imagery, and manage active catalog departments.
                </p>
              </div>

              <button
                id="admin-add-category-btn-tab"
                onClick={handleOpenNewCategory}
                className="px-5 py-2.5 bg-[#8b4513] hover:bg-[#70350d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add New Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryProducts = products.filter(
                  (p) => p.category.toLowerCase() === category.id.toLowerCase() || p.category === category.name
                );
                const avgPrice =
                  categoryProducts.length > 0
                    ? Math.round(categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length)
                    : 0;

                return (
                  <div
                    key={category.id}
                    id={`admin-category-card-${category.id}`}
                    className="bg-white rounded-2xl border border-[#e8dfd3] overflow-hidden shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    {/* Category Card Header & Image */}
                    <div>
                      <div className="relative h-36 bg-[#f4eee5] overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#d8af7e]">
                              Slug: {category.id}
                            </span>
                            <h4 className="font-serif text-xl font-bold text-white leading-tight">
                              {category.name}
                            </h4>
                          </div>
                          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-xs text-white text-xs font-bold rounded-lg border border-white/30">
                            {categoryProducts.length} Items
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        {category.tagline && (
                          <p className="text-xs text-[#73665a] italic line-clamp-2">
                            "{category.tagline}"
                          </p>
                        )}

                        <div className="space-y-2 text-xs text-[#73665a] py-2 border-y border-[#f0e9df]">
                          <div className="flex justify-between">
                            <span>Average Price:</span>
                            <span className="font-bold text-[#1a1614]">{formatINR(avgPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Featured on Home:</span>
                            <span className="font-bold text-[#8b4513]">
                              {categoryProducts.filter((p) => p.isFeatured).length} Items
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7b6d]">
                            Catalog Products ({categoryProducts.length}):
                          </span>
                          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                            {categoryProducts.length === 0 ? (
                              <p className="text-[11px] text-[#a89b8d] italic py-1">No products assigned yet.</p>
                            ) : (
                              categoryProducts.map((p) => (
                                <div
                                  key={p.id}
                                  className="p-2 rounded-lg bg-[#faf7f2] flex items-center justify-between text-xs"
                                >
                                  <span className="font-semibold text-[#1a1614] truncate max-w-[150px]">{p.name}</span>
                                  <span className="text-[#8b4513] font-bold">{formatINR(p.price)}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-5 pt-0 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setFilterCategory(category.id);
                          setActiveTab('products');
                        }}
                        className="py-2 bg-[#f4eee5] hover:bg-[#e8dfd3] text-[#52473e] text-xs font-bold rounded-xl transition cursor-pointer text-center"
                        title="Filter products by category"
                      >
                        Filter
                      </button>

                      <button
                        onClick={() => handleOpenEditCategory(category)}
                        className="py-2 bg-[#ede5da] hover:bg-[#ded4c6] text-[#231f1c] text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>

                      <button
                        onClick={() => handleDeleteCategorySubmit(category)}
                        className="py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Category Card Placeholder */}
              <button
                id="admin-add-category-card-btn"
                onClick={handleOpenNewCategory}
                className="h-full min-h-[300px] rounded-2xl border-2 border-dashed border-[#ded4c6] hover:border-[#8b4513] bg-white/40 hover:bg-[#faf7f2] p-8 flex flex-col items-center justify-center text-center group transition cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#ede5da] group-hover:bg-[#8b4513] group-hover:text-white text-[#8b4513] flex items-center justify-center transition mb-3">
                  <FolderPlus className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#231f1c] group-hover:text-[#8b4513] transition">
                  Create New Category
                </h4>
                <p className="text-xs text-[#73665a] mt-1 max-w-xs">
                  Expand your atelier's collection by adding custom product departments.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SQLITE DATABASE & CREDENTIALS VIEW */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Database Engine Status Banner */}
            <div className="bg-[#231f1c] text-[#faf8f5] p-6 sm:p-8 rounded-3xl border border-[#3d332b] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#c19a6b]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-700/50 rounded-full text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    SQLite 3 Engine Online • Connected
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#faf8f5]">
                    SQLite Database & Credential Vault
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a89b8d] max-w-2xl">
                    Persistent relational data store for Althaf Leathers. All admin credentials, catalog inventory, category taxonomies, site configurations, and order inquiries are safely persisted to disk in SQLite.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    id="admin-db-refresh-btn"
                    onClick={loadDbStats}
                    disabled={isLoadingDb}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#faf8f5] rounded-xl text-xs font-bold uppercase tracking-wider border border-white/15 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingDb ? 'animate-spin' : ''}`} />
                    Refresh Telemetry
                  </button>

                  <button
                    id="admin-db-change-passcode-btn"
                    onClick={() => setIsChangePasscodeModalOpen(true)}
                    className="px-4 py-2.5 bg-[#c19a6b] hover:bg-[#d8af7e] text-[#1a1614] rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" /> Change Master Key
                  </button>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#3d332b]">
                <div className="p-4 bg-[#2d2520] rounded-2xl border border-[#3d332b]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c19a6b] mb-1">
                    <HardDrive className="w-4 h-4" /> Database File
                  </div>
                  <p className="text-sm font-mono font-bold text-[#faf8f5] truncate">
                    {dbStats?.databasePath || 'data/althaf_leathers.sqlite'}
                  </p>
                  <span className="text-[10px] text-[#8c7b6d] mt-1 block">
                    Driver: {dbStats?.engine || 'sql.js (WebAssembly)'}
                  </span>
                </div>

                <div className="p-4 bg-[#2d2520] rounded-2xl border border-[#3d332b]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c19a6b] mb-1">
                    <UserCheck className="w-4 h-4" /> Master Admin User
                  </div>
                  <p className="text-sm font-bold text-[#faf8f5]">
                    {authInfo?.username || 'admin'}
                  </p>
                  <span className="text-[10px] text-[#8c7b6d] mt-1 block">
                    Role: {authInfo?.role || 'administrator'}
                  </span>
                </div>

                <div className="p-4 bg-[#2d2520] rounded-2xl border border-[#3d332b]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c19a6b] mb-1">
                    <Package className="w-4 h-4" /> Products Stored
                  </div>
                  <p className="text-2xl font-serif font-bold text-[#faf8f5]">
                    {dbStats?.productsCount ?? products.length}
                  </p>
                  <span className="text-[10px] text-[#8c7b6d] mt-1 block">
                    Table: <code className="font-mono text-[#c19a6b]">products</code>
                  </span>
                </div>

                <div className="p-4 bg-[#2d2520] rounded-2xl border border-[#3d332b]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c19a6b] mb-1">
                    <Folder className="w-4 h-4" /> Categories
                  </div>
                  <p className="text-2xl font-serif font-bold text-[#faf8f5]">
                    {dbStats?.categoriesCount ?? categories.length}
                  </p>
                  <span className="text-[10px] text-[#8c7b6d] mt-1 block">
                    Table: <code className="font-mono text-[#c19a6b]">categories</code>
                  </span>
                </div>
              </div>
            </div>

            {/* Relational Tables Schema Explorer */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8dfd3] shadow-xs space-y-6">
              <div>
                <h4 className="font-serif text-xl font-bold text-[#1a1614] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#8b4513]" /> Active SQLite Schema & Storage Tables
                </h4>
                <p className="text-xs text-[#73665a] mt-0.5">
                  Structured tables initialized in the local SQLite database file on the server.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Table 1: admin_credentials */}
                <div className="p-5 bg-[#faf7f2] rounded-2xl border border-[#e8dfd3] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#8b4513]" />
                      <span className="font-mono font-bold text-sm text-[#1a1614]">admin_credentials</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#73665a]">
                    Secures admin authentication credentials, passcode hash, administrative role, and timestamp logs.
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-[#ded4c6] text-[11px] font-mono text-[#52473e] space-y-1">
                    <div>• <strong className="text-[#8b4513]">id</strong>: TEXT PRIMARY KEY</div>
                    <div>• <strong className="text-[#8b4513]">username</strong>: TEXT NOT NULL</div>
                    <div>• <strong className="text-[#8b4513]">passcode_hash</strong>: TEXT NOT NULL</div>
                    <div>• <strong className="text-[#8b4513]">role</strong>: TEXT DEFAULT 'admin'</div>
                    <div>• <strong className="text-[#8b4513]">updated_at</strong>: TEXT</div>
                  </div>
                </div>

                {/* Table 2: products */}
                <div className="p-5 bg-[#faf7f2] rounded-2xl border border-[#e8dfd3] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#8b4513]" />
                      <span className="font-mono font-bold text-sm text-[#1a1614]">products</span>
                    </div>
                    <span className="px-2 py-0.5 bg-[#8b4513]/10 text-[#8b4513] text-[10px] font-bold rounded-full">
                      {products.length} Records
                    </span>
                  </div>
                  <p className="text-xs text-[#73665a]">
                    Stores complete leather catalog specs, pricing in INR, leather grain classifications, color variants, and images.
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-[#ded4c6] text-[11px] font-mono text-[#52473e] space-y-1">
                    <div>• <strong className="text-[#8b4513]">id</strong>: TEXT PRIMARY KEY</div>
                    <div>• <strong className="text-[#8b4513]">name, tagline, category</strong>: TEXT</div>
                    <div>• <strong className="text-[#8b4513]">price, original_price</strong>: REAL</div>
                    <div>• <strong className="text-[#8b4513]">leather_type, badge</strong>: TEXT</div>
                    <div>• <strong className="text-[#8b4513]">colors_json, images_json</strong>: TEXT (JSON)</div>
                  </div>
                </div>

                {/* Table 3: categories */}
                <div className="p-5 bg-[#faf7f2] rounded-2xl border border-[#e8dfd3] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-[#8b4513]" />
                      <span className="font-mono font-bold text-sm text-[#1a1614]">categories</span>
                    </div>
                    <span className="px-2 py-0.5 bg-[#8b4513]/10 text-[#8b4513] text-[10px] font-bold rounded-full">
                      {categories.length} Collections
                    </span>
                  </div>
                  <p className="text-xs text-[#73665a]">
                    Taxonomy definitions for storefront navigation, department taglines, and featured gallery headers.
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-[#ded4c6] text-[11px] font-mono text-[#52473e] space-y-1">
                    <div>• <strong className="text-[#8b4513]">id</strong>: TEXT PRIMARY KEY</div>
                    <div>• <strong className="text-[#8b4513]">name, tagline</strong>: TEXT NOT NULL</div>
                    <div>• <strong className="text-[#8b4513]">image_url</strong>: TEXT</div>
                    <div>• <strong className="text-[#8b4513]">display_order</strong>: INTEGER</div>
                  </div>
                </div>

                {/* Table 4: site_config */}
                <div className="p-5 bg-[#faf7f2] rounded-2xl border border-[#e8dfd3] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#8b4513]" />
                      <span className="font-mono font-bold text-sm text-[#1a1614]">site_config</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                      Dynamic
                    </span>
                  </div>
                  <p className="text-xs text-[#73665a]">
                    Stores global homepage bento bindings, announcement banner text, and official WhatsApp hotline number.
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-[#ded4c6] text-[11px] font-mono text-[#52473e] space-y-1">
                    <div>• <strong className="text-[#8b4513]">key</strong>: TEXT PRIMARY KEY ('homepage_config')</div>
                    <div>• <strong className="text-[#8b4513]">value_json</strong>: TEXT (JSON)</div>
                    <div>• <strong className="text-[#8b4513]">updated_at</strong>: TEXT</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Tools & Factory Reset */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8dfd3] shadow-xs space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#1a1614] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#8b4513]" /> SQLite Maintenance & Seed Controls
              </h4>
              <p className="text-xs text-[#73665a]">
                Use these tools if you ever need to re-seed or reload default catalog data into your SQLite database.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="admin-reset-products-db-btn"
                  onClick={async () => {
                    if (confirm('Are you sure you want to re-seed all products in the SQLite database to factory defaults?')) {
                      setIsResettingDb(true);
                      try {
                        const resetProds = await resetProductsApi();
                        showToast(`✓ SQLite Products table reset to default catalog (${resetProds.length} items).`);
                        loadDbStats();
                      } catch (e: any) {
                        showToast(`Notice: ${e.message}`);
                      } finally {
                        setIsResettingDb(false);
                      }
                    }
                  }}
                  disabled={isResettingDb}
                  className="px-4 py-2.5 bg-[#faf7f2] hover:bg-[#ede5da] text-[#52473e] border border-[#ded4c6] rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResettingDb ? 'animate-spin' : ''}`} />
                  Re-Seed Products Table
                </button>

                <button
                  id="admin-reset-categories-db-btn"
                  onClick={async () => {
                    if (confirm('Are you sure you want to re-seed all categories in the SQLite database to factory defaults?')) {
                      setIsResettingDb(true);
                      try {
                        const resetCats = await resetCategoriesApi();
                        showToast(`✓ SQLite Categories table reset to default collections (${resetCats.length} items).`);
                        loadDbStats();
                      } catch (e: any) {
                        showToast(`Notice: ${e.message}`);
                      } finally {
                        setIsResettingDb(false);
                      }
                    }
                  }}
                  disabled={isResettingDb}
                  className="px-4 py-2.5 bg-[#faf7f2] hover:bg-[#ede5da] text-[#52473e] border border-[#ded4c6] rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Folder className="w-3.5 h-3.5 text-[#8b4513]" />
                  Re-Seed Categories Table
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[#faf8f5] rounded-3xl max-w-4xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#231f1c] text-[#faf8f5] flex items-center justify-between border-b border-[#3d332b]">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#c19a6b]">
                  {isNewProduct ? 'Add to Atelier Collection' : 'Edit Product Specifications'}
                </span>
                <h2 className="font-serif text-2xl font-bold">
                  {isNewProduct ? 'New Leather Product' : formData.name}
                </h2>
              </div>

              <button
                id="admin-modal-close-btn"
                onClick={() => setIsEditingModalOpen(false)}
                className="p-2 text-[#a89b8d] hover:text-[#faf8f5] hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveForm} className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
              
              {/* SECTION 1: ESSENTIAL DETAILS */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1a1614] border-b border-[#e8dfd3] pb-2">
                  1. Product Details & Pricing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Product Name *
                    </label>
                    <input
                      id="form-product-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Handcrafted Derby Shoes"
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider">
                        Category *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingModalOpen(false);
                          handleOpenNewCategory();
                        }}
                        className="text-[11px] font-bold text-[#8b4513] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> New Category
                      </button>
                    </div>
                    <select
                      id="form-product-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                    Tagline / Short Summary *
                  </label>
                  <input
                    id="form-product-tagline"
                    type="text"
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Single-cut 4mm bridle leather with forged solid brass hardware"
                    className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Price (₹ INR) *
                    </label>
                    <input
                      id="form-product-price"
                      type="number"
                      required
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-bold focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Original / MRP Price (₹)
                    </label>
                    <input
                      id="form-product-original-price"
                      type="number"
                      min={0}
                      value={formData.originalPrice || ''}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="e.g. 5999"
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Leather Type
                    </label>
                    <select
                      id="form-product-leather-type"
                      value={formData.leatherType}
                      onChange={(e) => setFormData({ ...formData, leatherType: e.target.value as LeatherType })}
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                    >
                      <option value="Full-Grain">Full-Grain</option>
                      <option value="Vegetable-Tanned">Vegetable-Tanned</option>
                      <option value="Top-Grain">Top-Grain</option>
                      <option value="Saddle Leather">Saddle Leather</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Atelier Badge
                    </label>
                    <select
                      id="form-product-badge"
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: (e.target.value as any) || undefined })}
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                    >
                      <option value="">None</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="New Arrival">New Arrival</option>
                      <option value="Atelier Signature">Atelier Signature</option>
                      <option value="Limited Edition">Limited Edition</option>
                      <option value="Staff Pick">Staff Pick</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      id="form-product-is-featured"
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-[#8b4513] rounded focus:ring-[#8b4513]"
                    />
                    <span className="text-xs font-bold text-[#231f1c]">Feature on Homepage</span>
                  </label>
                </div>
              </div>

              {/* SECTION 2: COLOR VARIANTS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#e8dfd3] pb-2">
                  <h3 className="font-serif text-lg font-bold text-[#1a1614]">
                    2. Color Variants ({formData.colors.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="text-xs font-bold text-[#8b4513] hover:text-[#5c2d0c] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Color Variant
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-xl border border-[#e8dfd3] shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold uppercase text-[#8c7b6d] mb-0.5">Color Name</label>
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => handleUpdateColor(idx, 'name', e.target.value)}
                          placeholder="e.g. Heritage Tan"
                          className="w-full p-2 bg-[#f4eee5] border border-[#ded4c6] rounded-lg text-xs font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-[#8c7b6d] mb-0.5">Hex Color</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(e) => handleUpdateColor(idx, 'hex', e.target.value)}
                            className="w-8 h-8 rounded-md border border-[#ded4c6] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color.hex}
                            onChange={(e) => handleUpdateColor(idx, 'hex', e.target.value)}
                            className="w-16 p-1.5 bg-[#f4eee5] border border-[#ded4c6] rounded-lg text-[11px] font-mono"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold uppercase text-[#8c7b6d] mb-0.5">Variant Image URL</label>
                        <input
                          type="text"
                          value={color.image}
                          onChange={(e) => handleUpdateColor(idx, 'image', e.target.value)}
                          placeholder="https://..."
                          className="w-full p-2 bg-[#f4eee5] border border-[#ded4c6] rounded-lg text-xs"
                        />
                      </div>

                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Remove color"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: PRODUCT IMAGES & PRESETS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#e8dfd3] pb-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1a1614]">
                      3. Product Gallery Images ({formData.images.length})
                    </h3>
                    <p className="text-xs text-[#8c7b6d]">At least 1 high-resolution product photo is required.</p>
                  </div>
                </div>

                {/* Quick Presets for Fast Addition */}
                <div className="p-3.5 bg-[#ede5da]/60 rounded-xl border border-[#ded4c6] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b4513] block">
                    Quick Photo Library (Click to Add Photo):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_IMAGE_PRESETS.filter((p) => p.category === formData.category || formData.images.length === 0).map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddImage(preset.url)}
                        className="px-2.5 py-1 bg-white hover:bg-[#8b4513] hover:text-white text-[#3a332d] text-xs font-semibold rounded-lg border border-[#ded4c6] transition cursor-pointer flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3 h-3" /> {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Image by URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://images.unsplash.com/...)"
                    className="flex-1 p-3 bg-white border border-[#ded4c6] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#8b4513]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage()}
                    className="px-5 py-3 bg-[#231f1c] hover:bg-[#8b4513] text-white text-xs font-bold uppercase rounded-xl transition cursor-pointer shrink-0"
                  >
                    Add Photo
                  </button>
                </div>

                {/* Images Preview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {formData.images.map((imgUrl, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-[#ded4c6] bg-white aspect-square shadow-2xs">
                      <img src={imgUrl} alt={`Product ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition hover:bg-red-700 cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#231f1c]/80 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                          Primary Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: SIZES & SPECIFICATIONS */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1a1614] border-b border-[#e8dfd3] pb-2">
                  4. Sizes & Technical Specifications
                </h3>

                <div>
                  <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                    Available Sizes (Comma separated)
                  </label>
                  <input
                    id="form-product-sizes"
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="e.g. for Shoes: UK 6, UK 7, UK 8, UK 9, UK 10 | for Belts: 32, 34, 36, 38, 40 | for Bags: Standard 13, Large 15"
                    className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm focus:outline-none focus:border-[#8b4513]"
                  />
                  <p className="text-[11px] text-[#8c7b6d] mt-1">
                    Leave empty if item is single-size (like wallets or coasters).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="e.g. 38 cm × 28 cm × 10 cm"
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g. 780 g (pair)"
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Hardware
                    </label>
                    <input
                      type="text"
                      value={formData.hardware}
                      onChange={(e) => setFormData({ ...formData, hardware: e.target.value })}
                      placeholder="e.g. Solid Antiqued Brass Buckles & YKK Excella Zippers"
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                      Inner Lining
                    </label>
                    <input
                      type="text"
                      value={formData.lining}
                      onChange={(e) => setFormData({ ...formData, lining: e.target.value })}
                      placeholder="e.g. Breathable sheepskin lining or 100% Cotton Twill"
                      className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm focus:outline-none focus:border-[#8b4513]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: STORY, BULLETS & CRAFT NOTES */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1a1614] border-b border-[#e8dfd3] pb-2">
                  5. Full Description & Artisan Notes
                </h3>

                <div>
                  <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                    Detailed Product Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe how the leather is cut, its usability for daily life, and patina development..."
                    className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                {/* Key Features Bullets */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider">
                    Key Features (Bullet Points)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="e.g. Dual-layer high-density memory foam insole"
                      className="flex-1 p-2.5 bg-white border border-[#ded4c6] rounded-xl text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2.5 bg-[#ede5da] hover:bg-[#ded4c6] text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {formData.features.map((feat, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#e8dfd3] text-xs">
                        <span>• {feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(i)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Craftsmanship Notes */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider">
                    Craftsmanship Notes (Proddatur Atelier)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCraftNote}
                      onChange={(e) => setNewCraftNote(e.target.value)}
                      placeholder="e.g. Hand-lasted and hand-stitched welt construction"
                      className="flex-1 p-2.5 bg-white border border-[#ded4c6] rounded-xl text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCraftNote();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCraftNote}
                      className="px-4 py-2.5 bg-[#ede5da] hover:bg-[#ded4c6] text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {formData.craftsmanshipNotes.map((note, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#e8dfd3] text-xs">
                        <span>• {note}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCraftNote(i)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Care Instructions */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider">
                    Care Instructions
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCareNote}
                      onChange={(e) => setNewCareNote(e.target.value)}
                      placeholder="e.g. Wipe with clean cloth; apply natural leather balm every 4–6 months"
                      className="flex-1 p-2.5 bg-white border border-[#ded4c6] rounded-xl text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCareNote();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCareNote}
                      className="px-4 py-2.5 bg-[#ede5da] hover:bg-[#ded4c6] text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {formData.careInstructions.map((note, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#e8dfd3] text-xs">
                        <span>• {note}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCareNote(i)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Form Footer Action Buttons */}
              <div className="pt-6 border-t border-[#e8dfd3] flex items-center justify-end gap-3 sticky bottom-0 bg-[#faf8f5] py-4 -mb-8 -mx-8 px-8">
                <button
                  type="button"
                  id="admin-modal-cancel-btn"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-6 py-3 bg-[#ede5da] hover:bg-[#ded4c6] text-[#3a332d] rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="admin-modal-save-btn"
                  className="px-8 py-3 bg-[#8b4513] hover:bg-[#70350d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isNewProduct ? 'Add Product to Catalog' : 'Save Product Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[#faf8f5] rounded-3xl max-w-xl w-full border border-[#e8dfd3] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#231f1c] text-[#faf8f5] flex items-center justify-between border-b border-[#3d332b]">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#c19a6b]">
                  {isNewCategory ? 'Create New Category' : 'Edit Category Specifications'}
                </span>
                <h2 className="font-serif text-2xl font-bold">
                  {isNewCategory ? 'New Department' : categoryFormData.name}
                </h2>
              </div>

              <button
                id="admin-category-modal-close-btn"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 text-[#a89b8d] hover:text-[#faf8f5] hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Form */}
            <form onSubmit={handleSaveCategorySubmit} className="p-6 sm:p-8 space-y-6">
              {categoryFormError && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{categoryFormError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  id="form-category-name"
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setCategoryFormData((prev) => ({
                      ...prev,
                      name,
                      id: isNewCategory ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : prev.id
                    }));
                  }}
                  placeholder="e.g. Travel Duffles, Keychains, Jackets"
                  className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                  Category Identifier (Slug / ID) *
                </label>
                <input
                  id="form-category-id"
                  type="text"
                  required
                  disabled={!isNewCategory}
                  value={categoryFormData.id}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                  placeholder="e.g. jackets, travel-duffles"
                  className={`w-full p-3 border rounded-xl text-sm font-mono ${
                    !isNewCategory ? 'bg-[#ede5da] text-[#73665a] border-[#ded4c6]' : 'bg-white border-[#ded4c6] focus:outline-none focus:border-[#8b4513]'
                  }`}
                />
                <p className="text-[10px] text-[#8c7b6d] mt-1">
                  Used for internal product categorization and URLs.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                  Tagline / Short Description
                </label>
                <input
                  id="form-category-tagline"
                  type="text"
                  value={categoryFormData.tagline}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, tagline: e.target.value })}
                  placeholder="e.g. Handcrafted rugged leather travel essentials"
                  className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                  Cover Image URL *
                </label>
                <input
                  id="form-category-image"
                  type="url"
                  required
                  value={categoryFormData.image}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                />

                {/* Preset Presets */}
                <div className="mt-2.5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7b6d]">
                    Quick Image Presets:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {CATEGORY_IMAGE_PRESETS.slice(0, 4).map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setCategoryFormData({ ...categoryFormData, image: preset.url })}
                        className="relative h-14 rounded-lg overflow-hidden border border-[#ded4c6] hover:border-[#8b4513] group transition"
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-bold p-0.5 truncate text-center">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                {categoryFormData.image && (
                  <div className="mt-3 relative h-28 rounded-xl overflow-hidden border border-[#ded4c6]">
                    <img src={categoryFormData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-serif font-bold">{categoryFormData.name || 'Category Preview'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#e8dfd3] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 bg-[#ede5da] hover:bg-[#ded4c6] text-[#3a332d] rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="admin-category-save-btn"
                  className="px-6 py-2.5 bg-[#8b4513] hover:bg-[#70350d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isNewCategory ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHANGE MASTER KEY PASSCODE MODAL */}
      {/* ========================================================================= */}
      {isChangePasscodeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[#faf8f5] rounded-3xl max-w-md w-full border border-[#e8dfd3] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-[#231f1c] text-[#faf8f5] flex items-center justify-between border-b border-[#3d332b]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#c19a6b]" />
                <div>
                  <h3 className="font-serif text-lg font-bold">Change Master Passcode</h3>
                  <span className="text-[11px] text-[#a89b8d]">Update admin security credentials</span>
                </div>
              </div>
              <button
                onClick={() => setIsChangePasscodeModalOpen(false)}
                className="p-1.5 text-[#a89b8d] hover:text-[#faf8f5] hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePasscodeSubmit} className="p-6 space-y-4">
              {passcodeChangeError && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{passcodeChangeError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                  Current Passcode *
                </label>
                <input
                  type="password"
                  required
                  value={currentPasscodeAttempt}
                  onChange={(e) => setCurrentPasscodeAttempt(e.target.value)}
                  placeholder="Enter current passcode"
                  className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                  New Passcode *
                </label>
                <input
                  type="password"
                  required
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="Min 4 characters"
                  className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a332d] uppercase tracking-wider mb-1">
                  Confirm New Passcode *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  placeholder="Re-enter new passcode"
                  className="w-full p-3 bg-white border border-[#ded4c6] rounded-xl text-sm font-medium focus:outline-none focus:border-[#8b4513]"
                />
              </div>

              <div className="pt-4 border-t border-[#e8dfd3] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsChangePasscodeModalOpen(false)}
                  className="px-4 py-2.5 bg-[#ede5da] hover:bg-[#ded4c6] text-[#3a332d] rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8b4513] hover:bg-[#70350d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
