-- Additional SQL functions needed for the app
-- Run this AFTER 001_initial_schema.sql

-- Decrement product stock (prevents negative stock)
CREATE OR REPLACE FUNCTION public.decrement_product_stock(p_id UUID, qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - qty)
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Decrement variant stock
CREATE OR REPLACE FUNCTION public.decrement_variant_stock(v_id UUID, qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.product_variants
  SET stock = GREATEST(0, stock - qty)
  WHERE id = v_id;
END;
$$ LANGUAGE plpgsql;

-- Admin can read/update all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can manage all orders
CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can manage all products
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can manage categories
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can manage coupons
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can manage settings
CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can view all order items
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create Storage bucket for product images
-- Run this manually in Supabase Dashboard > Storage or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Make your user an admin (replace with your actual user ID after first login)
-- UPDATE public.profiles SET role = 'admin' WHERE phone = '+91XXXXXXXXXX';
