
-- Fix orders table: remove overly permissive policies, add admin-only access
DROP POLICY IF EXISTS "Orders are publicly readable" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;

-- Admin-only SELECT
CREATE POLICY "Admins can read orders" 
ON public.orders 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Admin-only UPDATE
CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin')) 
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admin-only DELETE
CREATE POLICY "Admins can delete orders" 
ON public.orders 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Keep "Anyone can create orders" INSERT policy for public order placement

-- Fix order_items table: restrict UPDATE and DELETE to admins
DROP POLICY IF EXISTS "Anyone can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can delete order items" ON public.order_items;

-- Admin-only UPDATE for order_items
CREATE POLICY "Admins can update order items" 
ON public.order_items 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin')) 
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admin-only DELETE for order_items
CREATE POLICY "Admins can delete order items" 
ON public.order_items 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Keep public INSERT and SELECT on order_items (needed for order creation and tracking)
