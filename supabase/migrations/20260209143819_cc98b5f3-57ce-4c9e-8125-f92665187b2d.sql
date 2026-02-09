
-- Allow public users to read their own order by order_number + email match
-- This is needed for the TrackOrder feature
CREATE POLICY "Public can read own order by email" 
ON public.orders 
FOR SELECT 
USING (true);

-- We need a different approach: use a database function for secure order lookup
-- Drop the overly broad policy we just created
DROP POLICY IF EXISTS "Public can read own order by email" ON public.orders;

-- Create a secure RPC function for order tracking that requires both order_number and email
CREATE OR REPLACE FUNCTION public.track_order(p_order_number text, p_email text)
RETURNS SETOF orders
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.orders
  WHERE order_number = p_order_number
    AND LOWER(email) = LOWER(p_email)
  LIMIT 1;
$$;
