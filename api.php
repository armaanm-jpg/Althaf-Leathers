<?php
/**
 * Althaf Leathers - SQLite API Bridge for Hostinger Shared Web Hosting
 * Works with PHP 8.x + SQLite3 (PDO) enabled by default on all Hostinger single plans.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Locate SQLite database file
$dbFile = __DIR__ . '/althaf_leathers.sqlite';
if (!file_exists($dbFile)) {
    $dbFile = __DIR__ . '/data/althaf_leathers.sqlite';
}

try {
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not connect to SQLite database: ' . $e->getMessage()]);
    exit;
}

// Parse request URI and route
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($requestUri, PHP_URL_PATH);
// Strip base folder if running in a subdirectory
$route = preg_replace('#^.*?/api/#', '', $path);
$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?? [];

// Helper to format product
function formatProductRow($row) {
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'tagline' => $row['tagline'] ?? '',
        'price' => (float)$row['price'],
        'originalPrice' => isset($row['original_price']) ? (float)$row['original_price'] : null,
        'rating' => (float)($row['rating'] ?? 5.0),
        'reviewsCount' => (int)($row['reviews_count'] ?? 0),
        'category' => $row['category'],
        'leatherType' => $row['leather_type'] ?? 'Full Grain Buff Calfskin',
        'badge' => $row['badge'] ?? null,
        'description' => $row['description'] ?? '',
        'features' => json_decode($row['features_json'] ?? '[]', true) ?: [],
        'specs' => [
            'dimensions' => $row['dimensions'] ?? '',
            'weight' => $row['weight'] ?? '',
            'hardware' => $row['hardware'] ?? 'Solid Brass',
            'lining' => $row['lining'] ?? 'Raw Suede / Drill Cotton',
            'tanneryLocation' => $row['tannery_location'] ?? 'Proddatur & Ranipet, India',
            'guaranteeYears' => (int)($row['guarantee_years'] ?? 10),
            'careInstructions' => $row['care_instructions'] ?? 'Wipe with soft cloth. Condition twice yearly with natural beeswax balm.',
        ],
        'colors' => json_decode($row['colors_json'] ?? '[]', true) ?: [],
        'images' => json_decode($row['images_json'] ?? '[]', true) ?: [],
        'stockStatus' => $row['stock_status'] ?? 'in_stock',
        'isBestSeller' => (bool)($row['is_bestseller'] ?? 0),
        'isNewArrival' => (bool)($row['is_newarrival'] ?? 0),
    ];
}

// ----------------- ROUTING -----------------

// 1. GET /api/health
if ($route === 'health' || $route === '') {
    echo json_encode(['status' => 'ok', 'engine' => 'Hostinger PHP SQLite Bridge', 'time' => date('c')]);
    exit;
}

// 2. GET & POST & DELETE /api/products
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
            $stmt = $pdo->query('SELECT * FROM products');
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $products = array_map('formatProductRow', $rows);
            echo json_encode(['success' => true, 'products' => $products, 'count' => count($products)]);
        }
        exit;
    }

    if ($method === 'POST') {
        $p = $body;
        $id = $p['id'] ?? ('prod-' . time());
        $stmt = $pdo->prepare('INSERT OR REPLACE INTO products 
            (id, name, tagline, price, original_price, rating, reviews_count, category, leather_type, badge, description, features_json, dimensions, weight, hardware, lining, tannery_location, guarantee_years, care_instructions, colors_json, images_json, stock_status, is_bestseller, is_newarrival, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))');

        $stmt->execute([
            $id,
            $p['name'] ?? 'Untitled Product',
            $p['tagline'] ?? '',
            (float)($p['price'] ?? 0),
            isset($p['originalPrice']) ? (float)$p['originalPrice'] : null,
            (float)($p['rating'] ?? 5.0),
            (int)($p['reviewsCount'] ?? 0),
            $p['category'] ?? 'Bags',
            $p['leatherType'] ?? 'Full Grain Buff Calfskin',
            $p['badge'] ?? null,
            $p['description'] ?? '',
            json_encode($p['features'] ?? []),
            $p['specs']['dimensions'] ?? '',
            $p['specs']['weight'] ?? '',
            $p['specs']['hardware'] ?? 'Solid Brass',
            $p['specs']['lining'] ?? 'Raw Suede',
            $p['specs']['tanneryLocation'] ?? 'Proddatur & Ranipet, India',
            (int)($p['specs']['guaranteeYears'] ?? 10),
            $p['specs']['careInstructions'] ?? '',
            json_encode($p['colors'] ?? []),
            json_encode($p['images'] ?? []),
            $p['stockStatus'] ?? 'in_stock',
            !empty($p['isBestSeller']) ? 1 : 0,
            !empty($p['isNewArrival']) ? 1 : 0,
        ]);

        echo json_encode(['success' => true, 'product' => $p, 'message' => 'Product saved successfully']);
        exit;
    }

    if ($method === 'PUT' && $productId) {
        $p = $body;
        $stmt = $pdo->prepare('INSERT OR REPLACE INTO products 
            (id, name, tagline, price, original_price, rating, reviews_count, category, leather_type, badge, description, features_json, dimensions, weight, hardware, lining, tannery_location, guarantee_years, care_instructions, colors_json, images_json, stock_status, is_bestseller, is_newarrival, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))');

        $stmt->execute([
            $productId,
            $p['name'] ?? 'Untitled Product',
            $p['tagline'] ?? '',
            (float)($p['price'] ?? 0),
            isset($p['originalPrice']) ? (float)$p['originalPrice'] : null,
            (float)($p['rating'] ?? 5.0),
            (int)($p['reviewsCount'] ?? 0),
            $p['category'] ?? 'Bags',
            $p['leatherType'] ?? 'Full Grain Buff Calfskin',
            $p['badge'] ?? null,
            $p['description'] ?? '',
            json_encode($p['features'] ?? []),
            $p['specs']['dimensions'] ?? '',
            $p['specs']['weight'] ?? '',
            $p['specs']['hardware'] ?? 'Solid Brass',
            $p['specs']['lining'] ?? 'Raw Suede',
            $p['specs']['tanneryLocation'] ?? 'Proddatur & Ranipet, India',
            (int)($p['specs']['guaranteeYears'] ?? 10),
            $p['specs']['careInstructions'] ?? '',
            json_encode($p['colors'] ?? []),
            json_encode($p['images'] ?? []),
            $p['stockStatus'] ?? 'in_stock',
            !empty($p['isBestSeller']) ? 1 : 0,
            !empty($p['isNewArrival']) ? 1 : 0,
        ]);

        echo json_encode(['success' => true, 'product' => $p, 'message' => 'Product updated successfully']);
        exit;
    }

    if ($method === 'DELETE' && $productId) {
        $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$productId]);
        echo json_encode(['success' => true, 'message' => 'Product deleted']);
        exit;
    }
}

// 3. GET & POST /api/categories
if ($route === 'categories' || preg_match('#^categories/(.+)$#', $route, $matches)) {
    $catId = $matches[1] ?? null;

    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM categories ORDER BY display_order ASC');
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $categories = array_map(function($r) {
            return [
                'id' => $r['id'],
                'name' => $r['name'],
                'tagline' => $r['tagline'],
                'imageUrl' => $r['image_url'] ?? '',
                'displayOrder' => (int)($r['display_order'] ?? 0),
            ];
        }, $rows);
        echo json_encode(['success' => true, 'categories' => $categories]);
        exit;
    }

    if ($method === 'POST' || $method === 'PUT') {
        $c = $body;
        $id = $catId ?: ($c['id'] ?? ('cat-' . time()));
        $stmt = $pdo->prepare('INSERT OR REPLACE INTO categories (id, name, tagline, image_url, display_order) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            $id,
            $c['name'] ?? '',
            $c['tagline'] ?? '',
            $c['imageUrl'] ?? '',
            (int)($c['displayOrder'] ?? 0)
        ]);
        echo json_encode(['success' => true, 'category' => $c]);
        exit;
    }

    if ($method === 'DELETE' && $catId) {
        $stmt = $pdo->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$catId]);
        echo json_encode(['success' => true, 'message' => 'Category deleted']);
        exit;
    }
}

// 4. GET & POST /api/config
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

    if ($method === 'POST') {
        $stmt = $pdo->prepare('INSERT OR REPLACE INTO site_config (key, value_json, updated_at) VALUES (?, ?, datetime(\'now\'))');
        $stmt->execute(['homepage_config', json_encode($body)]);
        echo json_encode(['success' => true, 'message' => 'Config updated successfully']);
        exit;
    }
}

// 5. POST /api/auth/login
if ($route === 'auth/login') {
    $passcode = trim($body['passcode'] ?? '');

    $stmt = $pdo->query('SELECT passcode FROM admin_credentials LIMIT 1');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && $row['passcode'] === $passcode) {
        echo json_encode(['success' => true, 'message' => 'Admin authenticated']);
        exit;
    }

    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid passcode']);
    exit;
}

// 6. POST /api/auth/change-passcode
if ($route === 'auth/change-passcode') {
    $currentPasscode = $body['currentPasscode'] ?? '';
    $newPasscode = $body['newPasscode'] ?? '';

    $stmt = $pdo->query('SELECT passcode FROM admin_credentials LIMIT 1');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $storedPasscode = $row ? $row['passcode'] : 'qwertyadmin123!@#';

    if ($currentPasscode !== $storedPasscode) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Current passcode is incorrect']);
        exit;
    }

    if (strlen($newPasscode) < 4) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'New passcode must be at least 4 characters']);
        exit;
    }

    $stmt = $pdo->prepare('UPDATE admin_credentials SET passcode = ?, updated_at = datetime(\'now\') WHERE id = \'admin\' OR id = \'admin-master\'');
    $stmt->execute([$newPasscode]);

    echo json_encode(['success' => true, 'message' => 'Master admin passcode updated successfully']);
    exit;
}

// 7. GET /api/stats
if ($route === 'stats') {
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
        $stmt = $pdo->prepare('INSERT INTO orders_inquiries (type, reference_code, customer_name, phone, email, total_amount, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))');
        $stmt->execute([
            $body['type'] ?? 'checkout_order',
            $body['referenceCode'] ?? ('ORD-' . time()),
            $body['customerName'] ?? '',
            $body['phone'] ?? '',
            $body['email'] ?? '',
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
