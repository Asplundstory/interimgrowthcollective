-- Allow first admin creation when no admins exist
-- Or allow admins to manage roles
CREATE POLICY "Allow first admin or admin manages roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  -- Either no admins exist yet (first setup)
  NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
  -- Or the current user is already an admin
  OR public.has_role(auth.uid(), 'admin')
);