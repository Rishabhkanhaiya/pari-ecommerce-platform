# Pari Gift Center & Fashion Hub — Hyperlocal E-Commerce Platform

A production-grade, full-stack e-commerce web application engineered for **Pari Gift Center & Fashion Hub** (Kinwat, Maharashtra). Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, PostgreSQL via Supabase, and flexible payment processing (Cash on Delivery + Razorpay UPI / Cards fallback).

---

## Architectural Overview

The application is engineered as a hyperlocal retail engine providing instant product discovery, real-time inventory management, rapid checkout, and live order tracking.

```
┌────────────────────────────────────────────────────────┐
│               Client-Side Storefront                   │
│   (Next.js App Router, React 19, Zustand State)        │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
            ▼                                ▼
┌───────────────────────────┐   ┌────────────────────────┐
│  Server Actions & APIs    │   │   Admin Dashboard      │
│  - /api/orders            │   │   - Orders Workflow    │
│  - /api/admin/upload      │   │   - Product Inventory  │
│  - /api/razorpay/*        │   │   - Category Control   │
└───────────┬───────────────┘   └────────────┬───────────┘
            │                                │
            ▼                                ▼
┌────────────────────────────────────────────────────────┐
│              Supabase Cloud Infrastructure             │
│   - PostgreSQL Database with Row Level Security (RLS)  │
│   - Supabase Storage (Bucket: product-images)          │
│   - Auth & Profile Management                          │
└────────────────────────────────────────────────────────┘
```

---

## Key Platform Capabilities

### Storefront Experience
- **Hyperlocal Dispatch Tracker**: Live 5-stage visual fulfillment status (`Pending` → `Confirmed` → `Packed` → `Out for Delivery` → `Delivered`) with printable invoices.
- **Fast Search & Auto-Suggestions**: Debounced product and category lookup with price, thumbnails, and direct links.
- **Catalog & Variant Selection**: Multi-attribute selection (sizes, shades, styles) with dynamic price calculation and live inventory indicators.
- **Persistent Cart Engine**: Built on Zustand with dynamic free-delivery threshold calculations (Free on orders >= ₹299, ₹40 standard delivery fee).
- **Streamlined Checkout**: Guest checkout support, locality quick-select for Kinwat delivery zones, coupon discount redemption, and multi-mode payment options.
- **Zero-Dependency Mode**: Seamless simulation fallback allows end-to-end shopping, ordering, and admin management out of the box without requiring third-party API keys.

### Merchant & Admin Suite (`/admin`)
- **Real-Time Operational Dashboard**: Order volume metrics, today's revenue, pending orders triage, and low-inventory alerts.
- **Product & Inventory Management**: Add, edit, or archive products; manage sizing and color variants; upload high-resolution photos directly to Supabase Storage via a secure server endpoint (`/api/admin/upload`).
- **Category & Taxonomy Engine**: Organize collections, assign badges, and upload banner photos.
- **Order Lifecycle Controls**: Advance order status, inspect customer contact details, view delivery addresses, and monitor payment verification states.
- **Business Configuration**: Configure delivery fee thresholds, operating hours, return validity window (24 hours), and site-wide announcement banners.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3 (Turbopack, App Router) |
| Runtime | Node.js 20+ / React 19 |
| Styling | Tailwind CSS v4, Lucide Vector Icons, Framer Motion |
| Database | PostgreSQL (Supabase Managed) |
| File Storage | Supabase Storage (`product-images` bucket) |
| State Management | Zustand (Local Cart Persistence) |
| Payments | Cash on Delivery (COD) + Razorpay SDK (with instant test fallback) |
| Authentication | Supabase Auth + Role-Based Access Control (Admin / Customer) |

---

## Getting Started

### Prerequisites
- Node.js 20.0 or higher
- npm 10.0 or higher
- A Supabase project (Free tier supported)

### 1. Clone the Repository
```bash
git clone https://github.com/Rishabhkanhaiya/pari-ecommerce-platform.git
cd pari-ecommerce-platform
```

### 2. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env.local
```

Configure your `.env.local` with your Supabase project credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Razorpay (Optional - Instant approval fallback active when unset)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Store Defaults
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SHOP_NAME=Pari Gift Center
NEXT_PUBLIC_SHOP_PHONE=+919422000000
NEXT_PUBLIC_FREE_DELIVERY_ABOVE=299
NEXT_PUBLIC_DELIVERY_START_HOUR=10
NEXT_PUBLIC_DELIVERY_END_HOUR=20
```

### 3. Database Setup
1. In your Supabase Dashboard, navigate to the **SQL Editor**.
2. Run the database migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_functions_and_policies.sql`
3. Under **Storage**, ensure a public bucket named `product-images` exists with appropriate RLS policies.

### 4. Install Dependencies & Launch
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Directory Structure

```
├── public/                 # Static assets and media files
├── src/
│   ├── app/
│   │   ├── (store)/        # Customer-facing storefront routes
│   │   │   ├── page.tsx    # Homepage
│   │   │   ├── cart/       # Shopping cart
│   │   │   ├── checkout/   # Multi-step checkout
│   │   │   ├── orders/     # Order tracking and invoice print
│   │   │   ├── product/    # Product details page with variants
│   │   │   └── category/   # Category browsing & filters
│   │   ├── admin/          # Merchant management console
│   │   ├── api/            # Server endpoints (upload, orders, payment)
│   │   └── login/          # Storefront and admin access
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin sidebar & widgets
│   │   ├── layout/         # Header, Navbar, Footer
│   │   └── products/       # Product card, filter, search bar
│   ├── lib/                # Database clients, utilities, and types
│   └── store/              # Zustand cart state management
└── supabase/
    └── migrations/         # PostgreSQL schema definitions and RLS policies
```

---

## Build & Production Verification

```bash
# Type-check and build for production
npm run build

# Start production server
npm run start
```

---

## License

Private and proprietary. Developed for Pari Gift Center & Fashion Hub. All rights reserved.
