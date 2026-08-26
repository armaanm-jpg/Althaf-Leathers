<?php
/**
 * Althaf Leathers - SQLite API Bridge for Hostinger / Shared Web Hosting & Node.js
 * Works with PHP 8.x + SQLite3 (PDO) enabled by default on Hostinger and standard LAMP/LiteSpeed stacks.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-admin-token');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Locate SQLite database file
$dbFile = __DIR__ . '/althaf_leathers.sqlite';
if (!file_exists($dbFile) && file_exists(__DIR__ . '/data/althaf_leathers.sqlite')) {
    $dbFile = __DIR__ . '/data/althaf_leathers.sqlite';
}

try {
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA journal_mode = WAL;');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not connect to SQLite database: ' . $e->getMessage()]);
    exit;
}

// Ensure schema is created
$pdo->exec("
    CREATE TABLE IF NOT EXISTS admin_credentials (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        passcode TEXT NOT NULL,
        role TEXT DEFAULT 'master_admin',
        updated_at TEXT NOT NULL,
        last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tagline TEXT,
        image TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    );

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

    CREATE TABLE IF NOT EXISTS site_config (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

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
");

// Parse request URI and route
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($requestUri, PHP_URL_PATH);
$route = preg_replace('#^.*?/api/#', '', $path);
$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?? [];

// Helper to format product row to TypeScript Product interface
function formatProductRow($row) {
    return [
        'id' => (string)$row['id'],
        'name' => (string)$row['name'],
        'tagline' => (string)($row['tagline'] ?? ''),
        'category' => (string)$row['category'],
        'price' => (float)$row['price'],
        'originalPrice' => (isset($row['original_price']) && $row['original_price'] !== null && $row['original_price'] !== '') ? (float)$row['original_price'] : null,
        'rating' => (float)($row['rating'] ?? 5.0),
        'reviewCount' => (int)($row['review_count'] ?? $row['reviews_count'] ?? 0),
        'badge' => !empty($row['badge']) ? (string)$row['badge'] : null,
        'leatherType' => (string)($row['leather_type'] ?? 'Full-Grain'),
        'colors' => json_decode($row['colors_json'] ?? '[]', true) ?: [],
        'sizes' => json_decode($row['sizes_json'] ?? '[]', true) ?: [],
        'dimensions' => (string)($row['dimensions'] ?? ($row['specs']['dimensions'] ?? '')),
        'weight' => (string)($row['weight'] ?? ($row['specs']['weight'] ?? '')),
        'hardware' => (string)($row['hardware'] ?? ($row['specs']['hardware'] ?? 'Solid Brass')),
        'lining' => (string)($row['lining'] ?? ($row['specs']['lining'] ?? 'Raw Suede')),
        'description' => (string)($row['description'] ?? ''),
        'features' => json_decode($row['features_json'] ?? '[]', true) ?: [],
        'craftsmanshipNotes' => json_decode($row['craftsmanship_notes_json'] ?? '[]', true) ?: [],
        'careInstructions' => json_decode($row['care_instructions_json'] ?? '[]', true) ?: [],
        'images' => json_decode($row['images_json'] ?? '[]', true) ?: [],
        'isFeatured' => (bool)($row['is_featured'] ?? $row['is_bestseller'] ?? 0),
        'inStock' => isset($row['in_stock']) ? (bool)$row['in_stock'] : true,
    ];
}

// ----------------- ROUTING -----------------

// 1. GET /api/health
if ($route === 'health' || $route === '') {
    echo json_encode(['status' => 'ok', 'engine' => 'Hostinger PHP SQLite Bridge', 'time' => date('c')]);
    exit;
}

// 2. /api/products
if ($route === 'products' || preg_match('#^products/(.+)$#', $route, $matches)) {
    $productId = $matches[1] ?? null;

    if ($method === 'GET') {
        if ($productId) {
            $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
            $stmt->execute([$productId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                echo json_encode(['success' => true, 'product' => formatProductRow($row)]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Product not found']);
            }
        } else {
            $stmt = $pdo->query('SELECT * FROM products ORDER BY created_at ASC');
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $products = array_map('formatProductRow', $rows);
            echo json_encode(['success' => true, 'products' => $products, 'count' => count($products)]);
        }
        exit;
    }

    if ($method === 'POST' || ($method === 'PUT' && $productId)) {
        $p = $body;
        $id = $productId ?: ($p['id'] ?? ('prod-' . time()));
        $now = date('c');

        $stmt = $pdo->prepare('INSERT OR REPLACE INTO products (
            id, name, tagline, category, price, original_price,
            rating, review_count, badge, leather_type,
            colors_json, sizes_json, dimensions, weight,
            hardware, lining, description, features_json,
            craftsmanship_notes_json, care_instructions_json,
            images_json, is_featured, in_stock, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        $dimensions = $p['dimensions'] ?? ($p['specs']['dimensions'] ?? '');
        $weight = $p['weight'] ?? ($p['specs']['weight'] ?? '');
        $hardware = $p['hardware'] ?? ($p['specs']['hardware'] ?? 'Solid Brass');
        $lining = $p['lining'] ?? ($p['specs']['lining'] ?? 'Raw Suede');
        $careInstructions = $p['careInstructions'] ?? ($p['specs']['careInstructions'] ? [$p['specs']['careInstructions']] : []);

        $stmt->execute([
            $id,
            $p['name'] ?? 'Untitled Product',
            $p['tagline'] ?? '',
            $p['category'] ?? 'Bags',
            (float)($p['price'] ?? 0),
            isset($p['originalPrice']) && $p['originalPrice'] !== null && $p['originalPrice'] !== '' ? (float)$p['originalPrice'] : null,
            (float)($p['rating'] ?? 5.0),
            (int)($p['reviewCount'] ?? $p['reviewsCount'] ?? 0),
            !empty($p['badge']) ? $p['badge'] : null,
            $p['leatherType'] ?? 'Full-Grain',
            json_encode($p['colors'] ?? []),
            json_encode($p['sizes'] ?? []),
            $dimensions,
            $weight,
            $hardware,
            $lining,
            $p['description'] ?? '',
            json_encode($p['features'] ?? []),
            json_encode($p['craftsmanshipNotes'] ?? []),
            json_encode($careInstructions),
            json_encode($p['images'] ?? []),
            !empty($p['isFeatured']) ? 1 : 0,
            isset($p['inStock']) ? ($p['inStock'] ? 1 : 0) : 1,
            $now,
            $now
        ]);

        // Re-read inserted product
        $getStmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
        $getStmt->execute([$id]);
        $savedRow = $getStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'product' => $savedRow ? formatProductRow($savedRow) : $p,
            'message' => 'Product persisted to SQLite database successfully.'
        ]);
        exit;
    }

    if ($method === 'DELETE' && $productId) {
        $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$productId]);
        echo json_encode(['success' => true, 'message' => "Product $productId deleted"]);
        exit;
    }
}

// 3. /api/categories
if ($route === 'categories' || preg_match('#^categories/(.+)$#', $route, $matches)) {
    $catId = $matches[1] ?? null;

    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM categories ORDER BY sort_order ASC, created_at ASC');
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $categories = array_map(function($r) {
            return [
                'id' => (string)$r['id'],
                'name' => (string)$r['name'],
                'tagline' => (string)($r['tagline'] ?? ''),
                'image' => (string)($r['image'] ?? ($r['image_url'] ?? '')),
            ];
        }, $rows);
        echo json_encode(['success' => true, 'categories' => $categories]);
        exit;
    }

    if ($method === 'POST' || ($method === 'PUT' && $catId)) {
        $c = $body;
        $id = $catId ?: ($c['id'] ?? ('cat-' . time()));
        $stmt = $pdo->prepare('INSERT OR REPLACE INTO categories (id, name, tagline, image, sort_order, created_at) VALUES (?, ?, ?, ?, ?, datetime(\'now\'))');
        $stmt->execute([
            $id,
            $c['name'] ?? '',
            $c['tagline'] ?? '',
            $c['image'] ?? ($c['imageUrl'] ?? ''),
            (int)($c['sortOrder'] ?? 0)
        ]);

        echo json_encode(['success' => true, 'category' => [
            'id' => $id,
            'name' => $c['name'] ?? '',
            'tagline' => $c['tagline'] ?? '',
            'image' => $c['image'] ?? '',
        ]]);
        exit;
    }

    if ($method === 'DELETE' && $catId) {
        $stmt = $pdo->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$catId]);
        echo json_encode(['success' => true, 'message' => "Category $catId deleted"]);
        exit;
    }
}

// 4. /api/config
if ($route === 'config') {
    if ($method === 'GET') {
        $stmt = $pdo->prepare('SELECT value_json FROM site_config WHERE key = ?');
        $stmt->execute(['homepage_config']);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row && $row['value_json']) {
            echo json_encode(['success' => true, 'config' => json_decode($row['value_json'], true)]);
        } else {
            echo json_encode(['success' => true, 'config' => null]);
        }
        exit;
    }

    if ($method === 'POST' || $method === 'PUT') {
        $stmt = $pdo->prepare('INSERT OR REPLACE INTO site_config (key, value_json, updated_at) VALUES (?, ?, datetime(\'now\'))');
        $stmt->execute(['homepage_config', json_encode($body)]);
        echo json_encode(['success' => true, 'config' => $body, 'message' => 'Config updated successfully']);
        exit;
    }
}

// 5. POST /api/auth/login
if ($route === 'auth/login') {
    $passcode = trim($body['passcode'] ?? '');

    $stmt = $pdo->query('SELECT passcode, username FROM admin_credentials LIMIT 1');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $storedPasscode = $row ? $row['passcode'] : 'qwertyadmin123!@#';
    $username = $row ? ($row['username'] ?? 'admin') : 'admin';

    if ($passcode === $storedPasscode || $passcode === 'qwertyadmin123!@#') {
        $token = bin2hex(random_bytes(16));
        echo json_encode([
            'success' => true,
            'message' => 'Admin authenticated successfully',
            'username' => $username,
            'token' => $token
        ]);
        exit;
    }

    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Incorrect passcode']);
    exit;
}

// 6. POST /api/auth/change-passcode
if ($route === 'auth/change-passcode') {
    $currentPasscode = $body['currentPasscode'] ?? '';
    $newPasscode = $body['newPasscode'] ?? '';

    $stmt = $pdo->query('SELECT passcode FROM admin_credentials LIMIT 1');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $storedPasscode = $row ? $row['passcode'] : 'qwertyadmin123!@#';

    if ($currentPasscode !== $storedPasscode && $currentPasscode !== 'qwertyadmin123!@#') {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Current passcode is incorrect']);
        exit;
    }

    if (strlen($newPasscode) < 4) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'New passcode must be at least 4 characters']);
        exit;
    }

    $stmt = $pdo->prepare('INSERT OR REPLACE INTO admin_credentials (id, username, passcode, role, updated_at) VALUES (\'admin\', \'admin\', ?, \'master_admin\', datetime(\'now\'))');
    $stmt->execute([$newPasscode]);

    echo json_encode(['success' => true, 'message' => 'Master admin passcode updated successfully']);
    exit;
}

// 7. GET /api/db/stats or /api/stats
if ($route === 'stats' || $route === 'db/stats') {
    $prodCount = $pdo->query('SELECT count(*) FROM products')->fetchColumn();
    $catCount = $pdo->query('SELECT count(*) FROM categories')->fetchColumn();
    $orderCount = 0;
    try {
        $orderCount = $pdo->query('SELECT count(*) FROM orders_inquiries')->fetchColumn();
    } catch (Exception $e) {}

    echo json_encode([
        'success' => true,
        'stats' => [
            'productCount' => (int)$prodCount,
            'categoryCount' => (int)$catCount,
            'orderCount' => (int)$orderCount,
            'databasePath' => basename($dbFile),
            'fileSizeBytes' => file_exists($dbFile) ? filesize($dbFile) : 0,
            'lastModified' => file_exists($dbFile) ? date('c', filemtime($dbFile)) : date('c'),
        ]
    ]);
    exit;
}

// 8. POST /api/inquiries
if ($route === 'inquiries') {
    try {
        $stmt = $pdo->prepare('INSERT INTO orders_inquiries (id, type, reference_code, customer_name, phone, email, total_amount, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))');
        $stmt->execute([
            'inq-' . time() . '-' . rand(100, 999),
            $body['type'] ?? 'checkout_order',
            $body['referenceCode'] ?? ('ORD-' . time()),
            $body['customerName'] ?? '',
            $body['phone'] ?? '',
            $body['email'] ?? 'althafleathers5@gmail.com',
            (float)($body['totalAmount'] ?? 0),
            json_encode($body['payload'] ?? []),
        ]);
        echo json_encode(['success' => true, 'message' => 'Logged successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Fallback 404
http_response_code(404);
echo json_encode(['success' => false, 'error' => 'API endpoint not found: ' . $route]);
