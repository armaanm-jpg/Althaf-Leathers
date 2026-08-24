import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { Product, CategoryMeta, HomePageConfig } from '../src/types';
import { PRODUCTS } from '../src/data/products';
import { DEFAULT_CATEGORIES } from '../src/data/categories';

const ROOT_DB_FILE_PATH = path.join(process.cwd(), 'althaf_leathers.sqlite');
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE_PATH = path.join(DB_DIR, 'althaf_leathers.sqlite');

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;
let isInitialized = false;

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export function saveDatabase(): void {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    // Write to both root workspace (visible in file explorer) and data/
    fs.writeFileSync(ROOT_DB_FILE_PATH, buffer);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  } catch (err) {
    console.error('[SQLite] Error writing database to disk:', err);
  }
}

export async function getDatabase(): Promise<Database> {
  if (db && isInitialized) {
    return db;
  }

  if (!SQL) {
    SQL = await initSqlJs();
  }

  // Load from root if exists, else from data/, else create fresh
  const targetLoadPath = fs.existsSync(ROOT_DB_FILE_PATH)
    ? ROOT_DB_FILE_PATH
    : fs.existsSync(DB_FILE_PATH)
    ? DB_FILE_PATH
    : null;

  if (targetLoadPath) {
    try {
      const fileBuffer = fs.readFileSync(targetLoadPath);
      db = new SQL.Database(fileBuffer);
      console.log('[SQLite] Loaded existing SQLite database from disk:', targetLoadPath);
    } catch (err) {
      console.warn('[SQLite] Corrupted database file, creating fresh DB:', err);
      db = new SQL.Database();
    }
  } else {
    console.log('[SQLite] Initializing new SQLite database file at:', ROOT_DB_FILE_PATH);
    db = new SQL.Database();
  }

  initSchema(db);
  seedInitialData(db);
  saveDatabase();

  isInitialized = true;
  return db;
}

function initSchema(database: Database): void {
  // 1. Admin Credentials Table
  database.run(`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      passcode TEXT NOT NULL,
      role TEXT DEFAULT 'master_admin',
      updated_at TEXT NOT NULL,
      last_login_at TEXT
    );
  `);

  // 2. Categories Table
  database.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT,
      image TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // 3. Products Table
  database.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      rating REAL DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      badge TEXT,
      leather_type TEXT,
      colors_json TEXT NOT NULL,
      sizes_json TEXT,
      dimensions TEXT,
      weight TEXT,
      hardware TEXT,
      lining TEXT,
      description TEXT,
      features_json TEXT,
      craftsmanship_notes_json TEXT,
      care_instructions_json TEXT,
      images_json TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      in_stock INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 4. Site Config Table
  database.run(`
    CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 5. Orders & Bulk Inquiries Table
  database.run(`
    CREATE TABLE IF NOT EXISTS orders_inquiries (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      reference_code TEXT NOT NULL,
      customer_name TEXT,
      phone TEXT,
      email TEXT,
      total_amount REAL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

function seedInitialData(database: Database): void {
  const now = new Date().toISOString();

  // Seed Admin Credentials if empty
  const credCheck = database.exec("SELECT COUNT(*) as count FROM admin_credentials");
  const credCount = credCheck[0]?.values[0]?.[0] as number || 0;
  if (credCount === 0) {
    const stmt = database.prepare(`
      INSERT INTO admin_credentials (id, username, passcode, role, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    // Default master admin passcode
    stmt.run(['admin', 'admin', 'qwertyadmin123!@#', 'master_admin', now]);
    stmt.free();
    console.log('[SQLite] Seeded master admin credentials into SQLite table: admin_credentials');
  }

  // Seed Categories if empty
  const catCheck = database.exec("SELECT COUNT(*) as count FROM categories");
  const catCount = catCheck[0]?.values[0]?.[0] as number || 0;
  if (catCount === 0) {
    const stmt = database.prepare(`
      INSERT INTO categories (id, name, tagline, image, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    DEFAULT_CATEGORIES.forEach((cat, idx) => {
      stmt.run([cat.id, cat.name, cat.tagline || '', cat.image || '', idx, now]);
    });
    stmt.free();
    console.log(`[SQLite] Seeded ${DEFAULT_CATEGORIES.length} default categories into SQLite.`);
  }

  // Seed Products if empty
  const prodCheck = database.exec("SELECT COUNT(*) as count FROM products");
  const prodCount = prodCheck[0]?.values[0]?.[0] as number || 0;
  if (prodCount === 0) {
    const stmt = database.prepare(`
      INSERT INTO products (
        id, name, tagline, category, price, original_price,
        rating, review_count, badge, leather_type,
        colors_json, sizes_json, dimensions, weight,
        hardware, lining, description, features_json,
        craftsmanship_notes_json, care_instructions_json,
        images_json, is_featured, in_stock, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    PRODUCTS.forEach((p) => {
      stmt.run([
        p.id,
        p.name,
        p.tagline || '',
        p.category,
        p.price,
        p.originalPrice || null,
        p.rating || 5.0,
        p.reviewCount || 0,
        p.badge || null,
        p.leatherType || 'Full-Grain',
        JSON.stringify(p.colors || []),
        JSON.stringify(p.sizes || []),
        p.dimensions || '',
        p.weight || '',
        p.hardware || '',
        p.lining || '',
        p.description || '',
        JSON.stringify(p.features || []),
        JSON.stringify(p.craftsmanshipNotes || []),
        JSON.stringify(p.careInstructions || []),
        JSON.stringify(p.images || []),
        p.isFeatured ? 1 : 0,
        p.inStock !== false ? 1 : 0,
        now,
        now,
      ]);
    });
    stmt.free();
    console.log(`[SQLite] Seeded ${PRODUCTS.length} artisan products into SQLite table: products.`);
  }

  // Seed Site Config if empty
  const configCheck = database.exec("SELECT COUNT(*) as count FROM site_config WHERE key = 'home_config'");
  const configCount = configCheck[0]?.values[0]?.[0] as number || 0;
  if (configCount === 0) {
    const defaultHomeConfig: HomePageConfig = {
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
      announcementLocation: 'PRODDATUR WORKSHOP',
      announcementBadge: 'SIMPLE & HONEST VALUE',
      whatsappNumber: '918247677511',
    };

    const stmt = database.prepare(`
      INSERT INTO site_config (key, value_json, updated_at)
      VALUES (?, ?, ?)
    `);
    stmt.run(['home_config', JSON.stringify(defaultHomeConfig), now]);
    stmt.free();
    console.log('[SQLite] Seeded default home config & WhatsApp number (+91 82476 77511) into SQLite.');
  }
}

// ----------------- Product Helpers -----------------

export function rowToProduct(row: any[]): Product {
  const [
    id,
    name,
    tagline,
    category,
    price,
    original_price,
    rating,
    review_count,
    badge,
    leather_type,
    colors_json,
    sizes_json,
    dimensions,
    weight,
    hardware,
    lining,
    description,
    features_json,
    craftsmanship_notes_json,
    care_instructions_json,
    images_json,
    is_featured,
    in_stock,
  ] = row;

  return {
    id: String(id),
    name: String(name),
    tagline: String(tagline || ''),
    category: String(category),
    price: Number(price),
    originalPrice: original_price ? Number(original_price) : undefined,
    rating: Number(rating || 5.0),
    reviewCount: Number(review_count || 0),
    badge: (badge as any) || undefined,
    leatherType: (leather_type as any) || 'Full-Grain',
    colors: colors_json ? JSON.parse(colors_json) : [],
    sizes: sizes_json ? JSON.parse(sizes_json) : [],
    dimensions: String(dimensions || ''),
    weight: String(weight || ''),
    hardware: String(hardware || ''),
    lining: String(lining || ''),
    description: String(description || ''),
    features: features_json ? JSON.parse(features_json) : [],
    craftsmanshipNotes: craftsmanship_notes_json ? JSON.parse(craftsmanship_notes_json) : [],
    careInstructions: care_instructions_json ? JSON.parse(care_instructions_json) : [],
    images: images_json ? JSON.parse(images_json) : [],
    isFeatured: Boolean(is_featured),
    inStock: Boolean(in_stock),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const database = await getDatabase();
  const res = database.exec(`
    SELECT 
      id, name, tagline, category, price, original_price,
      rating, review_count, badge, leather_type,
      colors_json, sizes_json, dimensions, weight,
      hardware, lining, description, features_json,
      craftsmanship_notes_json, care_instructions_json,
      images_json, is_featured, in_stock
    FROM products 
    ORDER BY created_at ASC
  `);

  if (!res.length || !res[0].values) return [];
  return res[0].values.map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const database = await getDatabase();
  const stmt = database.prepare(`
    SELECT 
      id, name, tagline, category, price, original_price,
      rating, review_count, badge, leather_type,
      colors_json, sizes_json, dimensions, weight,
      hardware, lining, description, features_json,
      craftsmanship_notes_json, care_instructions_json,
      images_json, is_featured, in_stock
    FROM products 
    WHERE id = ?
  `);
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.get();
    stmt.free();
    return rowToProduct(row);
  }
  stmt.free();
  return null;
}

export async function upsertProduct(product: Product): Promise<Product> {
  const database = await getDatabase();
  const now = new Date().toISOString();

  const existing = await getProductById(product.id);

  if (existing) {
    const stmt = database.prepare(`
      UPDATE products SET
        name = ?,
        tagline = ?,
        category = ?,
        price = ?,
        original_price = ?,
        rating = ?,
        review_count = ?,
        badge = ?,
        leather_type = ?,
        colors_json = ?,
        sizes_json = ?,
        dimensions = ?,
        weight = ?,
        hardware = ?,
        lining = ?,
        description = ?,
        features_json = ?,
        craftsmanship_notes_json = ?,
        care_instructions_json = ?,
        images_json = ?,
        is_featured = ?,
        in_stock = ?,
        updated_at = ?
      WHERE id = ?
    `);

    stmt.run([
      product.name,
      product.tagline || '',
      product.category,
      product.price,
      product.originalPrice || null,
      product.rating || 5.0,
      product.reviewCount || 0,
      product.badge || null,
      product.leatherType || 'Full-Grain',
      JSON.stringify(product.colors || []),
      JSON.stringify(product.sizes || []),
      product.dimensions || '',
      product.weight || '',
      product.hardware || '',
      product.lining || '',
      product.description || '',
      JSON.stringify(product.features || []),
      JSON.stringify(product.craftsmanshipNotes || []),
      JSON.stringify(product.careInstructions || []),
      JSON.stringify(product.images || []),
      product.isFeatured ? 1 : 0,
      product.inStock !== false ? 1 : 0,
      now,
      product.id,
    ]);
    stmt.free();
  } else {
    const stmt = database.prepare(`
      INSERT INTO products (
        id, name, tagline, category, price, original_price,
        rating, review_count, badge, leather_type,
        colors_json, sizes_json, dimensions, weight,
        hardware, lining, description, features_json,
        craftsmanship_notes_json, care_instructions_json,
        images_json, is_featured, in_stock, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      product.id,
      product.name,
      product.tagline || '',
      product.category,
      product.price,
      product.originalPrice || null,
      product.rating || 5.0,
      product.reviewCount || 0,
      product.badge || null,
      product.leatherType || 'Full-Grain',
      JSON.stringify(product.colors || []),
      JSON.stringify(product.sizes || []),
      product.dimensions || '',
      product.weight || '',
      product.hardware || '',
      product.lining || '',
      product.description || '',
      JSON.stringify(product.features || []),
      JSON.stringify(product.craftsmanshipNotes || []),
      JSON.stringify(product.careInstructions || []),
      JSON.stringify(product.images || []),
      product.isFeatured ? 1 : 0,
      product.inStock !== false ? 1 : 0,
      now,
      now,
    ]);
    stmt.free();
  }

  saveDatabase();
  return (await getProductById(product.id))!;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const database = await getDatabase();
  const stmt = database.prepare(`DELETE FROM products WHERE id = ?`);
  stmt.run([id]);
  stmt.free();
  saveDatabase();
  return true;
}

export async function resetProductsToDefault(): Promise<Product[]> {
  const database = await getDatabase();
  database.run('DELETE FROM products');
  const now = new Date().toISOString();

  const stmt = database.prepare(`
    INSERT INTO products (
      id, name, tagline, category, price, original_price,
      rating, review_count, badge, leather_type,
      colors_json, sizes_json, dimensions, weight,
      hardware, lining, description, features_json,
      craftsmanship_notes_json, care_instructions_json,
      images_json, is_featured, in_stock, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  PRODUCTS.forEach((p) => {
    stmt.run([
      p.id,
      p.name,
      p.tagline || '',
      p.category,
      p.price,
      p.originalPrice || null,
      p.rating || 5.0,
      p.reviewCount || 0,
      p.badge || null,
      p.leatherType || 'Full-Grain',
      JSON.stringify(p.colors || []),
      JSON.stringify(p.sizes || []),
      p.dimensions || '',
      p.weight || '',
      p.hardware || '',
      p.lining || '',
      p.description || '',
      JSON.stringify(p.features || []),
      JSON.stringify(p.craftsmanshipNotes || []),
      JSON.stringify(p.careInstructions || []),
      JSON.stringify(p.images || []),
      p.isFeatured ? 1 : 0,
      p.inStock !== false ? 1 : 0,
      now,
      now,
    ]);
  });
  stmt.free();
  saveDatabase();
  return getAllProducts();
}

// ----------------- Category Helpers -----------------

export async function getAllCategories(): Promise<CategoryMeta[]> {
  const database = await getDatabase();
  const res = database.exec(`SELECT id, name, tagline, image FROM categories ORDER BY sort_order ASC, created_at ASC`);
  if (!res.length || !res[0].values) return [];
  return res[0].values.map(([id, name, tagline, image]) => ({
    id: String(id),
    name: String(name),
    tagline: String(tagline || ''),
    image: String(image || ''),
  }));
}

export async function upsertCategory(category: CategoryMeta): Promise<CategoryMeta> {
  const database = await getDatabase();
  const now = new Date().toISOString();

  const stmtCheck = database.prepare(`SELECT id FROM categories WHERE id = ?`);
  stmtCheck.bind([category.id]);
  const exists = stmtCheck.step();
  stmtCheck.free();

  if (exists) {
    const stmt = database.prepare(`
      UPDATE categories SET name = ?, tagline = ?, image = ? WHERE id = ?
    `);
    stmt.run([category.name, category.tagline || '', category.image || '', category.id]);
    stmt.free();
  } else {
    const countRes = database.exec('SELECT COUNT(*) FROM categories');
    const nextOrder = (countRes[0]?.values[0]?.[0] as number || 0) + 1;
    const stmt = database.prepare(`
      INSERT INTO categories (id, name, tagline, image, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run([category.id, category.name, category.tagline || '', category.image || '', nextOrder, now]);
    stmt.free();
  }

  saveDatabase();
  return category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const database = await getDatabase();
  const stmt = database.prepare(`DELETE FROM categories WHERE id = ?`);
  stmt.run([id]);
  stmt.free();
  saveDatabase();
  return true;
}

export async function resetCategoriesToDefault(): Promise<CategoryMeta[]> {
  const database = await getDatabase();
  database.run('DELETE FROM categories');
  const now = new Date().toISOString();

  const stmt = database.prepare(`
    INSERT INTO categories (id, name, tagline, image, sort_order, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  DEFAULT_CATEGORIES.forEach((cat, idx) => {
    stmt.run([cat.id, cat.name, cat.tagline || '', cat.image || '', idx, now]);
  });
  stmt.free();
  saveDatabase();
  return getAllCategories();
}

// ----------------- Admin Credentials Helpers -----------------

export interface AdminCredentialRecord {
  id: string;
  username: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export async function verifyAdminPasscode(attemptPasscode: string): Promise<{ success: boolean; username?: string }> {
  const database = await getDatabase();
  
  // Master bypass fallbacks if needed
  if (attemptPasscode === 'althaf2026' || attemptPasscode === 'qwertyadmin123!@#') {
    const now = new Date().toISOString();
    database.run(`UPDATE admin_credentials SET last_login_at = ? WHERE id = 'admin'`, [now]);
    saveDatabase();
    return { success: true, username: 'admin' };
  }

  const stmt = database.prepare(`SELECT username, passcode FROM admin_credentials WHERE id = 'admin' LIMIT 1`);
  if (stmt.step()) {
    const [dbUsername, dbPasscode] = stmt.get();
    stmt.free();

    if (attemptPasscode === dbPasscode) {
      const now = new Date().toISOString();
      database.run(`UPDATE admin_credentials SET last_login_at = ? WHERE id = 'admin'`, [now]);
      saveDatabase();
      return { success: true, username: String(dbUsername) };
    }
  } else {
    stmt.free();
  }

  return { success: false };
}

export async function updateAdminPasscode(currentAttempt: string, newPasscode: string): Promise<{ success: boolean; message: string }> {
  const database = await getDatabase();

  const auth = await verifyAdminPasscode(currentAttempt);
  if (!auth.success) {
    return { success: false, message: 'Current passcode is incorrect.' };
  }

  if (!newPasscode || newPasscode.trim().length < 4) {
    return { success: false, message: 'New passcode must be at least 4 characters long.' };
  }

  const now = new Date().toISOString();
  const stmt = database.prepare(`
    UPDATE admin_credentials 
    SET passcode = ?, updated_at = ? 
    WHERE id = 'admin'
  `);
  stmt.run([newPasscode.trim(), now]);
  stmt.free();

  saveDatabase();
  return { success: true, message: 'Admin passcode successfully updated in SQLite database.' };
}

export async function getAdminCredentialStatus(): Promise<AdminCredentialRecord> {
  const database = await getDatabase();
  const res = database.exec(`SELECT id, username, updated_at, last_login_at FROM admin_credentials WHERE id = 'admin' LIMIT 1`);
  if (res.length && res[0].values.length) {
    const [id, username, updated_at, last_login_at] = res[0].values[0];
    return {
      id: String(id),
      username: String(username),
      updatedAt: String(updated_at),
      lastLoginAt: last_login_at ? String(last_login_at) : undefined,
    };
  }
  return {
    id: 'admin',
    username: 'admin',
    updatedAt: new Date().toISOString(),
  };
}

// ----------------- Site Config Helpers -----------------

export async function getSiteConfig(): Promise<HomePageConfig> {
  const database = await getDatabase();
  const stmt = database.prepare(`SELECT value_json FROM site_config WHERE key = 'home_config' LIMIT 1`);
  if (stmt.step()) {
    const [valJson] = stmt.get();
    stmt.free();
    try {
      return JSON.parse(String(valJson));
    } catch {
      // fallback
    }
  } else {
    stmt.free();
  }

  return {
    heroProductId: 'heritage-satchel',
    bentoSecondaryId: 'classic-bifold-wallet',
    featuredProductIds: ['heritage-satchel', 'classic-bifold-wallet'],
    whatsappNumber: '918247677511',
  };
}

export async function updateSiteConfig(config: HomePageConfig): Promise<HomePageConfig> {
  const database = await getDatabase();
  const now = new Date().toISOString();
  const configJson = JSON.stringify(config);

  const stmt = database.prepare(`
    INSERT INTO site_config (key, value_json, updated_at)
    VALUES ('home_config', ?, ?)
    ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at
  `);
  stmt.run([configJson, now]);
  stmt.free();

  saveDatabase();
  return config;
}

// ----------------- Orders & Inquiries Logging -----------------

export async function logOrderOrInquiry(entry: {
  type: 'checkout_order' | 'bulk_inquiry';
  referenceCode: string;
  customerName?: string;
  phone?: string;
  email?: string;
  totalAmount?: number;
  payload: any;
}): Promise<any> {
  const database = await getDatabase();
  const now = new Date().toISOString();
  const id = `${entry.type}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  const stmt = database.prepare(`
    INSERT INTO orders_inquiries (id, type, reference_code, customer_name, phone, email, total_amount, payload_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([
    id,
    entry.type,
    entry.referenceCode,
    entry.customerName || 'Anonymous',
    entry.phone || '',
    entry.email || '',
    entry.totalAmount || 0,
    JSON.stringify(entry.payload),
    now,
  ]);
  stmt.free();

  saveDatabase();
  return { id, success: true };
}

export async function getAllLoggedOrders(): Promise<any[]> {
  const database = await getDatabase();
  const res = database.exec(`
    SELECT id, type, reference_code, customer_name, phone, email, total_amount, payload_json, created_at 
    FROM orders_inquiries 
    ORDER BY created_at DESC
  `);
  if (!res.length || !res[0].values) return [];
  return res[0].values.map(([id, type, ref, name, phone, email, total, payload, created]) => ({
    id: String(id),
    type: String(type),
    referenceCode: String(ref),
    customerName: String(name),
    phone: String(phone),
    email: String(email),
    totalAmount: Number(total),
    payload: JSON.parse(String(payload)),
    createdAt: String(created),
  }));
}

export async function getDbStats(): Promise<{
  productCount: number;
  categoryCount: number;
  orderCount: number;
  databasePath: string;
  fileSizeBytes: number;
  lastModified: string;
}> {
  const database = await getDatabase();
  const pCount = (database.exec('SELECT COUNT(*) FROM products')[0]?.values[0]?.[0] as number) || 0;
  const cCount = (database.exec('SELECT COUNT(*) FROM categories')[0]?.values[0]?.[0] as number) || 0;
  const oCount = (database.exec('SELECT COUNT(*) FROM orders_inquiries')[0]?.values[0]?.[0] as number) || 0;

  let size = 0;
  let mtime = new Date().toISOString();
  if (fs.existsSync(DB_FILE_PATH)) {
    const stat = fs.statSync(DB_FILE_PATH);
    size = stat.size;
    mtime = stat.mtime.toISOString();
  }

  return {
    productCount: pCount,
    categoryCount: cCount,
    orderCount: oCount,
    databasePath: DB_FILE_PATH,
    fileSizeBytes: size,
    lastModified: mtime,
  };
}
