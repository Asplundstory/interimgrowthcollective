-- Drop existing restrictive policies on creator_applications
DROP POLICY IF EXISTS "Admins can view applications" ON public.creator_applications;
DROP POLICY IF EXISTS "Anyone can submit application" ON public.creator_applications;

-- Create proper PERMISSIVE policies
-- Only admins can view applications (protects PII)
CREATE POLICY "Admins can view applications"
ON public.creator_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit an application (public form)
CREATE POLICY "Anyone can submit application"
ON public.creator_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);