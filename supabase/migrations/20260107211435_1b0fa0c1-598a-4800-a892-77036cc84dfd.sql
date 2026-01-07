-- Fix RLS policies for contact_submissions to allow admins to view
DROP POLICY IF EXISTS "Admins can view submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix RLS policies for creator_applications to allow admins to view
DROP POLICY IF EXISTS "Admins can view applications" ON public.creator_applications;
CREATE POLICY "Admins can view applications" 
ON public.creator_applications 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));