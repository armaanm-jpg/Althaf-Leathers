# Althaf Leathers — Hostinger Single Website Plan Hosting Guide

This guide explains step-by-step how to host **Althaf Leathers** on **Hostinger Single Web Hosting** (Shared Hosting with hPanel).

No VPS, terminal, or complicated server commands required. It works directly through the **Hostinger File Manager** in your web browser.

---

## 📋 What You Need Before Starting

- Your Hostinger **Single Website Plan** login (hPanel).
- Your domain name connected to Hostinger.
- This application code.

---

## 🚀 4-Step Quick Deployment Guide

### Step 1: Build the Project Files
Run the build command on your computer (or export the project ZIP from AI Studio):
```bash
npm run build
```
This generates the optimized production files inside the `dist/` folder.

---

### Step 2: Open Hostinger File Manager
1. Log in to your **Hostinger hPanel** (`https://hpanel.hostinger.com`).
2. Go to **Websites** and click **Manage** next to your domain.
3. In the left menu, click **Files** -> **File Manager** (or click **Access all files of your domain**).
4. Double-click to open the `public_html/` folder.

> 💡 *Tip: If there is a default `default.php` or `index.php` placeholder file inside `public_html/`, delete it.*

---

### Step 3: Upload the Files to `public_html/`
Upload the following files directly inside `public_html/`:

1. **All contents inside `dist/`**:
   - `index.html`
   - `assets/` folder (contains CSS, JavaScript bundles, fonts)
   - Any images/icons inside `dist/`
2. **`.htaccess`** (included in the root of this project — handles routing & protects the database)
3. **`api.php`** (included in the root — connects the React frontend to SQLite on Hostinger's built-in PHP)
4. **`althaf_leathers.sqlite`** (the database containing your 8 initial products and admin login)

#### Your `public_html/` folder should look like this:
```text
public_html/
├── assets/
│   ├── index-xxxx.js
│   └── index-xxxx.css
├── .htaccess
├── api.php
├── althaf_leathers.sqlite
├── index.html
└── favicon.ico
```

---

### Step 4: Ensure Permissions (1 Click)
In Hostinger File Manager:
1. Right-click `althaf_leathers.sqlite` -> click **Permissions** -> set to `0664` or `0666` (allows reading and writing when saving products in admin).
2. Right-click `public_html/` -> ensure permissions are `0755`.

**🎉 That's it! Visit your domain (e.g. `https://yourdomain.com`) in your browser. Your store is live!**

---

## 🔐 Admin Console & Default Credentials

To manage products, categories, pricing, and homepage showcases:

- **Admin URL**: Click **"Atelier Console"** in the footer of your website, or navigate directly to `https://yourdomain.com/` and open the console from the footer.
- **Username**: `admin`
- **Master Passcode**: `qwertyadmin123!@#` *(Emergency overrides: `althaf2026` or `admin123`)*

---

## 💬 WhatsApp Checkout & Hotline Setup

When customers click **"Proceed to WhatsApp Checkout"** or **"Send Bulk Wholesale Inquiry"**, the order is pre-formatted with order summary, customer delivery address, items, and total INR calculation.

- **Default WhatsApp Hotline**: `+91 82476 77511`
- **How to change it**:
  - Open the **Admin Console** on your live site.
  - Go to the **Homepage Display Manager** tab.
  - Update the WhatsApp number and click **Save Changes**.

---

## 🛠️ How it Works on Hostinger Single Plan

| Feature | How Hostinger Runs It |
| :--- | :--- |
| **Frontend Storefront** | Served at ultra-fast speeds as a static React 19 SPA via LiteSpeed Web Server. |
| **SQLite Database** | Hostinger's standard PHP 8.x PDO SQLite driver executes queries via `api.php` on `althaf_leathers.sqlite`. |
| **Client-Side Fallback** | Even if PHP is disabled, the app automatically persists all edits and cart changes in the browser's local cache. |
| **Security** | `.htaccess` automatically denies public web downloads of `.sqlite` files, keeping database data safe. |
| **Free SSL** | Go to Hostinger hPanel -> **Security** -> **SSL** -> click **Install SSL** for free HTTPS. |

---

## ❓ Frequently Asked Questions

### 1. I get a 404 error when refreshing a page.
Make sure you uploaded the **`.htaccess`** file into `public_html/`. In Hostinger File Manager, click the settings gear (top right) and make sure **"Show Hidden Files (dotfiles)"** is turned ON so you can see `.htaccess`.

### 2. Can I edit products directly on my live website?
Yes! Log in to the **Atelier Console** on your live website, click **Add Product** or **Edit**, and save. The changes are saved to `althaf_leathers.sqlite`.

### 3. How do I back up my products?
Open Hostinger File Manager, right-click `althaf_leathers.sqlite`, and click **Download**.
