import { Product, CategoryMeta, HomePageConfig } from '../types';

export interface DbStats {
  productCount: number;
  categoryCount: number;
  orderCount: number;
  databasePath: string;
  fileSizeBytes: number;
  lastModified: string;
}

export interface AdminAuthStatus {
  id: string;
  username: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Base fetch helper with error handling
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return data;
}

// ----------------- Products API -----------------

export async function fetchProductsApi(): Promise<Product[]> {
  try {
    const res = await request<{ success: boolean; products: Product[] }>('/api/products');
    return res.products || [];
  } catch (err) {
    console.warn('[API] Could not fetch products from SQLite, falling back to local cache:', err);
    throw err;
  }
}

export async function saveProductApi(product: Product, isNew: boolean = false): Promise<Product> {
  if (isNew) {
    const res = await request<{ success: boolean; product: Product }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return res.product;
  } else {
    const res = await request<{ success: boolean; product: Product }>(`/api/products/${encodeURIComponent(product.id)}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    return res.product;
  }
}

export async function deleteProductApi(productId: string): Promise<boolean> {
  const res = await request<{ success: boolean }>(`/api/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
  });
  return res.success;
}

export async function resetProductsApi(): Promise<Product[]> {
  const res = await request<{ success: boolean; products: Product[] }>('/api/products/reset', {
    method: 'POST',
  });
  return res.products;
}

// ----------------- Categories API -----------------

export async function fetchCategoriesApi(): Promise<CategoryMeta[]> {
  try {
    const res = await request<{ success: boolean; categories: CategoryMeta[] }>('/api/categories');
    return res.categories || [];
  } catch (err) {
    console.warn('[API] Could not fetch categories from SQLite:', err);
    throw err;
  }
}

export async function saveCategoryApi(category: CategoryMeta, isNew: boolean = false): Promise<CategoryMeta> {
  if (isNew) {
    const res = await request<{ success: boolean; category: CategoryMeta }>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    return res.category;
  } else {
    const res = await request<{ success: boolean; category: CategoryMeta }>(`/api/categories/${encodeURIComponent(category.id)}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
    return res.category;
  }
}

export async function deleteCategoryApi(categoryId: string): Promise<boolean> {
  const res = await request<{ success: boolean }>(`/api/categories/${encodeURIComponent(categoryId)}`, {
    method: 'DELETE',
  });
  return res.success;
}

export async function resetCategoriesApi(): Promise<CategoryMeta[]> {
  const res = await request<{ success: boolean; categories: CategoryMeta[] }>('/api/categories/reset', {
    method: 'POST',
  });
  return res.categories;
}

// ----------------- Store Configuration API -----------------

export async function fetchSiteConfigApi(): Promise<HomePageConfig> {
  try {
    const res = await request<{ success: boolean; config: HomePageConfig }>('/api/config');
    return res.config;
  } catch (err) {
    console.warn('[API] Could not fetch config from SQLite:', err);
    throw err;
  }
}

export async function updateSiteConfigApi(config: HomePageConfig): Promise<HomePageConfig> {
  const res = await request<{ success: boolean; config: HomePageConfig }>('/api/config', {
    method: 'PUT',
    body: JSON.stringify(config),
  });
  return res.config;
}

// ----------------- Authentication & Credential Storage API -----------------

export async function adminLoginApi(passcode: string): Promise<{ success: boolean; username: string }> {
  const res = await request<{ success: boolean; username: string; message: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ passcode }),
  });
  return { success: res.success, username: res.username };
}

export async function changeAdminPasscodeApi(currentPasscode: string, newPasscode: string): Promise<string> {
  const res = await request<{ success: boolean; message: string }>('/api/auth/change-passcode', {
    method: 'POST',
    body: JSON.stringify({ currentPasscode, newPasscode }),
  });
  return res.message;
}

export async function getAdminAuthStatusApi(): Promise<AdminAuthStatus> {
  const res = await request<{ success: boolean } & AdminAuthStatus>('/api/auth/status');
  return {
    id: res.id,
    username: res.username,
    updatedAt: res.updatedAt,
    lastLoginAt: res.lastLoginAt,
  };
}

// ----------------- Orders & SQLite Diagnostics -----------------

export async function logOrderInquiryApi(entry: {
  type: 'checkout_order' | 'bulk_inquiry';
  referenceCode: string;
  customerName?: string;
  phone?: string;
  email?: string;
  totalAmount?: number;
  payload: any;
}): Promise<void> {
  try {
    await request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  } catch (err) {
    console.warn('[API] Failed to log order inquiry in SQLite:', err);
  }
}

export async function fetchDbStatsApi(): Promise<DbStats> {
  const res = await request<{ success: boolean; stats: DbStats }>('/api/db/stats');
  return res.stats;
}
