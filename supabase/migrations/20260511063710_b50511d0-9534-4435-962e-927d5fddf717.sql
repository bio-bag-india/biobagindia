
-- Lock down products write access to admins only
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Lock down product_sizes write access to admins only
DROP POLICY IF EXISTS "Anyone can insert product sizes" ON public.product_sizes;
DROP POLICY IF EXISTS "Anyone can update product sizes" ON public.product_sizes;
DROP POLICY IF EXISTS "Anyone can delete product sizes" ON public.product_sizes;

CREATE POLICY "Admins can insert product sizes" ON public.product_sizes
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update product sizes" ON public.product_sizes
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete product sizes" ON public.product_sizes
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Restrict order_items SELECT to admins only (no longer public)
DROP POLICY IF EXISTS "Order items are publicly readable" ON public.order_items;

CREATE POLICY "Admins can read order items" ON public.order_items
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Secure RPC for tracking order items (verifies order number + email)
CREATE OR REPLACE FUNCTION public.track_order_items(p_order_number text, p_email text)
RETURNS SETOF public.order_items
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT oi.*
  FROM public.order_items oi
  JOIN public.orders o ON o.id = oi.order_id
  WHERE o.order_number = p_order_number
    AND LOWER(o.email) = LOWER(p_email);
$$;
