# NOVA SUPPLY — Premium E-Commerce Platform

> **Objects for everyday living.**  
> CODSOFT Web Development Internship — Level 3, Task 1 Capstone Project.

---

## 1. Project Overview

**NOVA SUPPLY** is a full-stack, production-style editorial e-commerce application developed for a modern lifestyle and technology hardware brand. Inspired by independent design publications and artisanal studios (such as Teenage Engineering, Aesop, and Nothing), NOVA SUPPLY merges reductive, warm editorial aesthetics with full-stack engineering.

Unlike static UI templates or mockup prototypes, NOVA SUPPLY is **fully functional end-to-end**:
- **Authoritative Server Calculations**: Item prices and order totals are always computed on the Node.js/Express server from verified product catalog records. Client-provided prices are never trusted.
- **Inventory Tracking**: Stock quantities decrement upon completed checkout. Items exceeding inventory are strictly rejected with stock warning messages.
- **Secure Authentication**: Password hashing with `bcryptjs`, JWT token signing with HTTP-only cookies and Bearer headers, protected client dashboard and order history.
- **Dual Database Architecture**: Seamlessly connects to MongoDB via Mongoose when credentials are provided, or operates in a robust **Demo Mode** powered by an in-memory & file-persisted data store with 14 curated lifestyle objects and pre-seeded demo accounts.
- **Simulated Demo Checkout**: Full multi-step checkout workflow with customer details, shipping address, promo discount code engine (`NOVA10`, `WELCOME15`), and unique order references (`NOVA-XXXXXX`) without charging real payment cards.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM (v6) with dynamic query parameters, breadcrumbs, and protected route wrappers
- **State Management**: React Context API (`AuthContext`, `CartContext`, `ToastContext`) with localStorage cart persistence
- **Styling**: Modern CSS System with editorial CSS custom properties (variables), responsive flex/grid layouts, restrained typography (Newsreader & Plus Jakarta Sans), and zero heavy bloated UI frameworks
- **Icons**: `lucide-react` for clean iconography

### Backend & Database
- **Runtime**: Node.js (v20+) with ECMAScript Modules (`"type": "module"`)
- **Web Framework**: Express.js with CORS, Cookie-Parser, and JSON body parsing
- **Database**: MongoDB with Mongoose (with automated fallback to authoritative in-memory store in Demo Mode)
- **Security & Auth**: `bcryptjs` (salt rounds = 10) for one-way password hashing, `jsonwebtoken` (JWT) for stateless session verification
- **Testing**: Node.js native test runner (`node:test`, `node:assert/strict`) and `supertest` for REST API integration testing

---

## 3. Repository Structure

```text
nova-supply/
├── client/                      # React + Vite Frontend Application
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── assets/              # Icons and local imagery
│   │   ├── components/          # Reusable UI components
│   │   │   ├── AnnouncementBar.jsx   # Top shipping notice & promo tips
│   │   │   ├── Navbar.jsx            # Sticky responsive nav with live search overlay
│   │   │   ├── Footer.jsx            # Editorial footer with newsletter subscription
│   │   │   ├── ProductCard.jsx       # Card with hover angle reveal & quick-add
│   │   │   ├── CartDrawer.jsx        # Slide-over cart drawer with stock caps
│   │   │   └── ProtectedRoute.jsx    # Auth route guard
│   │   ├── context/             # Global state providers
│   │   │   ├── AuthContext.jsx       # User auth, login, register, profile update
│   │   │   ├── CartContext.jsx       # Cart items, quantities, promo engine, totals
│   │   │   └── ToastContext.jsx      # Non-intrusive notification toasts
│   │   ├── pages/               # Application view routes
│   │   │   ├── HomePage.jsx          # Hero, categories, bestsellers, story banner
│   │   │   ├── ShopPage.jsx          # Live search, category & price filter, sort
│   │   │   ├── ProductDetailPage.jsx # Multi-image gallery, specs tabs, quantity
│   │   │   ├── CartPage.jsx          # Full shopping bag page with promo codes
│   │   │   ├── CheckoutPage.jsx      # Demo checkout with validation
│   │   │   ├── OrderConfirmationPage.jsx # Order receipt with tracking timeline
│   │   │   ├── LoginPage.jsx         # Sign in with 1-click Demo Fill
│   │   │   ├── RegisterPage.jsx      # Sign up with validation
│   │   │   ├── AccountPage.jsx       # Orders list, profile & system info
│   │   │   ├── AboutPage.jsx         # Studio story, philosophy & CODSOFT credits
│   │   │   ├── ContactPage.jsx       # Validated dispatch form & showroom FAQs
│   │   │   └── NotFoundPage.jsx      # Editorial 404 page with search
│   │   ├── services/
│   │   │   └── api.js                # Fetch wrapper for /api routes
│   │   ├── App.jsx                   # Route declarations & layout wrapper
│   │   ├── index.css                 # Design tokens, reset, typography
│   │   └── main.jsx                  # React DOM entry point
│   ├── index.html               # HTML5 template with web fonts
│   ├── vite.config.js           # Vite dev server with proxy to Express
│   └── package.json
│
├── server/                      # Node.js + Express API Backend
│   ├── config/
│   │   ├── config.js            # Environment variable aggregator
│   │   └── db.js                # Mongoose connection & fallback handler
│   ├── controllers/
│   │   ├── authController.js    # Register, login, logout, me, profile
│   │   ├── productController.js # List, filter, search, single product
│   │   ├── orderController.js   # Server-side calculation & stock decrement
│   │   └── contactController.js # Newsletter & contact inquiry handlers
│   ├── data/
│   │   ├── seedProducts.js      # 14 curated lifestyle objects
│   │   ├── memoryStore.js       # Authoritative store for demo fallback mode
│   │   └── seed.js              # Standalone MongoDB seeder script
│   ├── middleware/
│   │   ├── authMiddleware.js    # Protect routes via JWT cookie / header
│   │   └── errorMiddleware.js   # 404 & error handlers
│   ├── models/                  # Mongoose Schemas & Models
│   │   ├── User.js              # User schema with bcrypt hook
│   │   ├── Product.js           # Product catalog schema
│   │   └── Order.js             # Order schema with items snapshot
│   ├── routes/                  # Express REST API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── contactRoutes.js
│   ├── tests/
│   │   └── api.test.js          # Automated supertest suite
│   ├── app.js                   # Express application setup & static serving
│   ├── server.js                # Server entry point
│   └── package.json
│
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json                 # Monorepo root script runner
└── README.md                    # Project documentation
```

---

## 4. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: Local MongoDB instance or MongoDB Atlas connection string. If omitted, the application runs automatically in full **Demo Mode**.

---

## 5. Installation and Setup

### 1. Clone or Open the Repository
```bash
git clone https://github.com/your-username/nova-supply.git
cd nova-supply
```

### 2. Install Dependencies
Install dependencies for both client and server:
```bash
# Install root, server, and client packages
npm run install:all

# Or install individually:
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Environment Configuration
Copy `.env.example` to `server/.env` (or configure root environment variables):
```bash
cp .env.example server/.env
```

Configuration variables:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=nova-supply-super-secret-jwt-key-2026
CLIENT_URL=http://localhost:5173

# Optional: MongoDB Connection URI. Leave blank for Demo Mode!
MONGODB_URI=
```

---

## 6. Running the Application

### Option A: Development Mode (Recommended)
Run the backend server and frontend development server simultaneously:

1. **Start the API Server** (Port 5000):
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Vite Client** (Port 5173):
   ```bash
   cd client
   npm run dev
   ```

Open your browser at **`http://localhost:5173`**. The Vite dev server proxies all `/api` calls to `http://localhost:5000`.

### Option B: Production Mode
Build the client and serve everything from the Express server:
```bash
# Build the React frontend
npm run build --prefix client

# Start Express (which serves the API and the static build on port 5000)
npm start --prefix server
```
Open **`http://localhost:5000`**.

---

## 7. Demo Mode & Evaluation Guide

If `MONGODB_URI` is not provided in your environment, the server logs:
```text
[Database] MONGODB_URI not provided. Running in DEMO MODE with authoritative local sample data store.
[MemoryStore] Initialized with 14 sample products and 1 demo user.
```

### Pre-Seeded Demo Account
For rapid reviewer evaluation, a demo customer account is pre-configured:
- **Email**: `alex@novasupply.com`
- **Password**: `Password123!`
- *Convenience Feature*: On the `/login` page, click the **"Quick Demo Login (Alex Vane)"** button to instantly populate credentials.
- Once signed in, navigate to **Account** (`/account`) to view Alex's profile and pre-seeded order history (`NOVA-782194`).

### Active Promo Codes
Test our server-validated promotional discount engine during checkout or in the shopping cart:
- **`NOVA10`** — Grants 10% discount on order subtotal.
- **`WELCOME15`** — Grants 15% discount on order subtotal.

### Demo Checkout Simulation
- The checkout interface at `/checkout` is clearly labelled with an amber demo warning banner.
- **No real money or credit card charges will ever occur.**
- Test card details are pre-filled (`4242 •••• •••• 4242`).
- Submitting an order sends the item list to `POST /api/orders`. The backend validates real-time product stock, calculates taxes and shipping, deducts the purchased quantities from store inventory, and responds with a confirmed order reference (`NOVA-XXXXXX`).

---

## 8. API Endpoint Documentation

Base URL: `/api`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Returns system health, database mode, and catalog count |
| `GET` | `/products` | Public | List products. Supports `category`, `search`, `minPrice`, `maxPrice`, `sort`, `page`, `limit` |
| `GET` | `/products/featured` | Public | Returns curated featured, bestseller, and new arrival sets |
| `GET` | `/products/categories` | Public | Returns distinct category names |
| `GET` | `/products/:id` | Public | Returns single product details by ID or slug |
| `POST` | `/auth/register` | Public | Creates a new user with bcrypt-hashed password |
| `POST` | `/auth/login` | Public | Authenticates credentials and returns JWT token & cookie |
| `POST` | `/auth/logout` | Public | Clears authentication session cookie |
| `GET` | `/auth/me` | Authenticated | Retrieves current logged-in user profile |
| `PUT` | `/auth/profile` | Authenticated | Updates customer name and default delivery address |
| `POST` | `/orders` | Public / Auth | Creates order with server-calculated prices & stock deduction |
| `GET` | `/orders` | Authenticated | Retrieves signed-in user's order history |
| `GET` | `/orders/:id` | Public / Auth | Retrieves specific order details by order number |
| `POST` | `/contact` | Public | Validates and receives customer contact inquiry |
| `POST` | `/contact/newsletter` | Public | Validates email and adds subscriber to journal list |

---

## 9. Automated Testing

The project includes an automated integration test suite utilizing Node.js's native test runner (`node:test`) and `supertest`.

### Run Backend Tests:
```bash
cd server
npm test
```

### Verified Test Cases:
1. **Health Check Endpoint**: Confirms 200 OK and reports store mode.
2. **Catalog Browsing, Search & Filtering**: Tests category filtering (`Audio`), full-text search (`Headphones`), price ranges (`$100-$200`), and single product retrieval.
3. **Authentication Security Flow**: Tests user registration, duplicate email rejection (400), wrong password rejection (401), valid login (200), and protected route token verification (`/api/auth/me`).
4. **Server-Side Price Calculation & Stock Decrement**: Verifies that forged client prices (e.g. attempting to send `$1.00` for a `$68.00` item) are ignored, and order totals are recalculated strictly from authoritative database values. Verifies stock decreases upon order completion.
5. **Inventory Validation Rejection**: Asserts that attempting to purchase quantities exceeding warehouse stock triggers an `Insufficient inventory` 400 error.
6. **Input Validation**: Tests newsletter format validation and contact form field requirements.

---

## 10. Design & UX Highlights

- **Art-Directed Aesthetics**: Refined color scheme (`#FAF8F5` paper white, `#1A1918` charcoal, `#3D4734` forest olive, `#BA5A3A` terracotta accent).
- **Responsive Layout**: Fluid breakpoints covering mobile (<600px), tablet (600–900px), and desktop (>900px).
- **Accessibility**: Keyboard navigable focus rings, ARIA roles, semantic HTML elements (`header`, `main`, `aside`, `nav`, `footer`).
- **Interactive Micro-actions**: Image hover revealing secondary angle, quick-add button with animated checkmark feedback, slide-over cart drawer with free shipping progress bar, live search dropdown.
- **Fail-Safe Imagery**: Inline SVG fallbacks on all product image elements to ensure zero broken image displays regardless of external network connectivity.

---

## 11. Internship Attribution

This project was built for the **CODSOFT Web Development Internship Level 3, Task 1**.

- **Brand**: NOVA SUPPLY
- **Tagline**: *Objects for everyday living.*
- **Level**: Level 3 — Advanced Full-Stack Web Development
- **Task**: Task 1 — Production-Grade E-Commerce Web Application

---

## 12. License

This project is licensed under the MIT License — feel free to explore, learn, and adapt for educational purposes.
