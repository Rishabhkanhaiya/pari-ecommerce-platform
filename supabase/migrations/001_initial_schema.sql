-- ============================================
-- PARI GIFT CENTER - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PROFILES (extends auth.users)
-- =====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE,
  name TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ADDRESSES
-- =====================
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  landmark TEXT,
  city TEXT NOT NULL DEFAULT 'Kinwat',
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CATEGORIES
-- =====================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PRODUCTS
-- =====================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  stock INT NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  sku TEXT,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PRODUCT VARIANTS (size, color, etc.)
-- =====================
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., "Red - M", "Blue - L"
  price DECIMAL(10,2),
  stock INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- COUPONS
-- =====================
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('percent', 'flat')),
  value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  max_uses INT,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ORDERS
-- =====================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  address_id UUID REFERENCES public.addresses(id),
  -- Snapshot address fields (in case address is deleted later)
  delivery_name TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_pincode TEXT NOT NULL,
  -- Order financials
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  coupon_code TEXT,
  coupon_id UUID REFERENCES public.coupons(id),
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled')
  ),
  payment_method TEXT DEFAULT 'razorpay' CHECK (payment_method IN ('razorpay', 'cod')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  -- Notes
  notes TEXT,
  admin_notes TEXT,
  estimated_delivery TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ORDER ITEMS
-- =====================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  -- Snapshot at time of order
  product_name TEXT NOT NULL,
  variant_name TEXT,
  product_image TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PAYMENTS
-- =====================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  method TEXT, -- upi, card, netbanking, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SETTINGS
-- =====================
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, email, name)
  VALUES (
    NEW.id,
    NEW.phone,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT := 'PGC';
  num INT;
BEGIN
  SELECT COUNT(*) + 1001 INTO num FROM public.orders;
  RETURN prefix || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses: users manage their own
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Categories: public read
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = TRUE);

-- Products: public read
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view variants" ON public.product_variants FOR SELECT USING (TRUE);

-- Coupons: authenticated read (for validation only)
CREATE POLICY "Authenticated users can view active coupons" ON public.coupons FOR SELECT TO authenticated USING (is_active = TRUE);

-- Orders: users see only their own
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- =====================
-- SEED DATA - Categories
-- =====================
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Ladies Fashion', 'ladies-fashion', 'Kurtis, Sarees, Suits & more', 1),
  ('Jewellery', 'jewellery', 'Fashion bangles, earrings, necklaces & rings', 2),
  ('Cosmetics & Beauty', 'cosmetics-beauty', 'Lipstick, kajal, skincare & more', 3),
  ('Toys & Games', 'toys-games', 'Kids toys, board games & fun gifts', 4),
  ('Gifts & Accessories', 'gifts-accessories', 'Gift sets, greeting cards & decor', 5);

INSERT INTO public.categories (name, slug, description, parent_id, sort_order)
SELECT 'Kurtis & Suits', 'kurtis-suits', 'Trendy kurtis and salwar suits', id, 1
FROM public.categories WHERE slug = 'ladies-fashion';

INSERT INTO public.categories (name, slug, description, parent_id, sort_order)
SELECT 'Sarees', 'sarees', 'Beautiful sarees for every occasion', id, 2
FROM public.categories WHERE slug = 'ladies-fashion';

INSERT INTO public.categories (name, slug, description, parent_id, sort_order)
SELECT 'Lehengas', 'lehengas', 'Festive and bridal lehengas', id, 3
FROM public.categories WHERE slug = 'ladies-fashion';

INSERT INTO public.categories (name, slug, description, parent_id, sort_order)
SELECT 'Kids Dresses', 'kids-dresses', 'Frocks and party wear for children', id, 4
FROM public.categories WHERE slug = 'ladies-fashion';

INSERT INTO public.categories (name, slug, description, parent_id, sort_order)
SELECT 'Nightwear', 'nightwear', 'Comfortable nightwear and loungewear', id, 5
FROM public.categories WHERE slug = 'ladies-fashion';

-- =====================
-- SEED DATA - Settings
-- =====================
INSERT INTO public.settings (key, value) VALUES
  ('shop_name', 'Pari Gift Center'),
  ('shop_phone', '+91XXXXXXXXXX'),
  ('shop_whatsapp', '91XXXXXXXXXX'),
  ('shop_address', 'Kinwat, Maharashtra'),
  ('delivery_start', '10'),
  ('delivery_end', '20'),
  ('free_delivery_above', '299'),
  ('delivery_fee', '40'),
  ('gst_number', 'ADD_YOUR_GST_HERE'),
  ('razorpay_key_id', ''),
  ('announcement_bar', '🎉 Free delivery on orders above ₹299 | 30-min delivery in Kinwat!');
