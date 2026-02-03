-- Add INSERT, UPDATE, DELETE policies for products table
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

-- Add INSERT, UPDATE, DELETE policies for product_sizes table
CREATE POLICY "Anyone can insert product sizes" ON public.product_sizes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update product sizes" ON public.product_sizes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete product sizes" ON public.product_sizes FOR DELETE USING (true);

-- Add UPDATE, DELETE policies for orders table
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete orders" ON public.orders FOR DELETE USING (true);

-- Add UPDATE, DELETE policies for order_items table
CREATE POLICY "Anyone can update order items" ON public.order_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete order items" ON public.order_items FOR DELETE USING (true);

-- Add UPDATE, DELETE policies for contacts table
CREATE POLICY "Anyone can update contacts" ON public.contacts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete contacts" ON public.contacts FOR DELETE USING (true);