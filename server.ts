import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getDatabase,
  getAllProducts,
  getProductById,
  upsertProduct,
  deleteProduct,
  resetProductsToDefault,
  getAllCategories,
  upsertCategory,
  deleteCategory,
  resetCategoriesToDefault,
  verifyAdminPasscode,
  updateAdminPasscode,
  getAdminCredentialStatus,
  getSiteConfig,
  updateSiteConfig,
  logOrderOrInquiry,
  getAllLoggedOrders,
  getDbStats,
} from './server/db.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with ample capacity
  app.use(express.json({ limit: '20mb' }));

  // Ensure SQLite DB is initialized on boot
  try {
    await getDatabase();
    console.log('[Server] SQLite database initialized successfully.');
  } catch (err) {
    console.error('[Server] Failed to initialize SQLite database:', err);
  }

  // ----------------------------------------------------
  // API ROUTES
  // ----------------------------------------------------

  // 1. Health & Database Status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      engine: 'sqlite3-sqljs',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/db/stats', async (req, res) => {
    try {
      const stats = await getDbStats();
      res.json({ success: true, stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Admin Authentication & Credential Storage
  app.get('/api/auth/status', async (req, res) => {
    try {
      const status = await getAdminCredentialStatus();
      res.json({ success: true, ...status });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { passcode } = req.body;
      if (!passcode) {
        return res.status(400).json({ success: false, error: 'Passcode is required.' });
      }

      const result = await verifyAdminPasscode(passcode);
      if (result.success) {
        return res.json({
          success: true,
          message: 'Admin authenticated successfully via SQLite database.',
          username: result.username || 'admin',
          authenticatedAt: new Date().toISOString(),
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Incorrect passcode. Verification against SQLite credentials failed.',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/auth/change-passcode', async (req, res) => {
    try {
      const { currentPasscode, newPasscode } = req.body;
      if (!currentPasscode || !newPasscode) {
        return res.status(400).json({ success: false, error: 'Both current and new passcode are required.' });
      }

      const updateRes = await updateAdminPasscode(currentPasscode, newPasscode);
      if (updateRes.success) {
        return res.json({ success: true, message: updateRes.message });
      }

      return res.status(400).json({ success: false, error: updateRes.message });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Products SQLite CRUD
  app.get('/api/products', async (req, res) => {
    try {
      const products = await getAllProducts();
      res.json({ success: true, count: products.length, products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found in SQLite database.' });
      }
      res.json({ success: true, product });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const productData = req.body;
      if (!productData || !productData.name || !productData.price) {
        return res.status(400).json({ success: false, error: 'Product name and price are required.' });
      }
      if (!productData.id) {
        productData.id = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
      }

      const saved = await upsertProduct(productData);
      res.status(201).json({ success: true, message: 'Product saved in SQLite.', product: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    try {
      const productData = req.body;
      productData.id = req.params.id;
      const saved = await upsertProduct(productData);
      res.json({ success: true, message: 'Product updated in SQLite.', product: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      await deleteProduct(req.params.id);
      res.json({ success: true, message: `Product ${req.params.id} deleted from SQLite.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/products/reset', async (req, res) => {
    try {
      const resetList = await resetProductsToDefault();
      res.json({ success: true, message: 'Products reset to atelier catalogue in SQLite.', products: resetList });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Categories SQLite CRUD
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await getAllCategories();
      res.json({ success: true, count: categories.length, categories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/categories', async (req, res) => {
    try {
      const catData = req.body;
      if (!catData || !catData.name) {
        return res.status(400).json({ success: false, error: 'Category name is required.' });
      }
      if (!catData.id) {
        catData.id = catData.name.replace(/[^a-zA-Z0-9]/g, '');
      }
      const saved = await upsertCategory(catData);
      res.status(201).json({ success: true, message: 'Category saved in SQLite.', category: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/categories/:id', async (req, res) => {
    try {
      const catData = req.body;
      catData.id = req.params.id;
      const saved = await upsertCategory(catData);
      res.json({ success: true, message: 'Category updated in SQLite.', category: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      await deleteCategory(req.params.id);
      res.json({ success: true, message: `Category ${req.params.id} deleted from SQLite.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/categories/reset', async (req, res) => {
    try {
      const list = await resetCategoriesToDefault();
      res.json({ success: true, message: 'Categories reset to default in SQLite.', categories: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Store / Home Configuration in SQLite
  app.get('/api/config', async (req, res) => {
    try {
      const config = await getSiteConfig();
      res.json({ success: true, config });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/config', async (req, res) => {
    try {
      const updated = await updateSiteConfig(req.body);
      res.json({ success: true, message: 'Store config updated in SQLite.', config: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Orders and Inquiries in SQLite
  app.get('/api/orders', async (req, res) => {
    try {
      const orders = await getAllLoggedOrders();
      res.json({ success: true, count: orders.length, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { type, referenceCode, customerName, phone, email, totalAmount, payload } = req.body;
      const log = await logOrderOrInquiry({
        type: type || 'checkout_order',
        referenceCode: referenceCode || `ORD-${Date.now()}`,
        customerName,
        phone,
        email,
        totalAmount,
        payload: payload || {},
      });
      res.status(201).json({ success: true, message: 'Logged in SQLite.', id: log.id });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ----------------------------------------------------
  // VITE / STATIC SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Althaf Leathers] Full-stack SQLite server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
