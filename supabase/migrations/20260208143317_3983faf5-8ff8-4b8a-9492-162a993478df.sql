
-- Drop existing overly permissive policies on contacts
DROP POLICY IF EXISTS "Contacts are publicly readable" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can update contacts" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can delete contacts" ON public.contacts;

-- Create admin-only SELECT policy
CREATE POLICY "Only admins can view contacts"
ON public.contacts
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create admin-only UPDATE policy
CREATE POLICY "Only admins can update contacts"
ON public.contacts
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Create admin-only DELETE policy
CREATE POLICY "Only admins can delete contacts"
ON public.contacts
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));
