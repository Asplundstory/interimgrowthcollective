
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin authentication
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles: users can see their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create cms_pages table for page content
CREATE TABLE public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on cms_pages
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can read pages (public content)
CREATE POLICY "Anyone can read pages"
ON public.cms_pages
FOR SELECT
USING (true);

-- Only admins can insert/update/delete pages
CREATE POLICY "Admins can insert pages"
ON public.cms_pages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pages"
ON public.cms_pages
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pages"
ON public.cms_pages
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create cms_navigation table for menus
CREATE TABLE public.cms_navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id text UNIQUE NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on cms_navigation
ALTER TABLE public.cms_navigation ENABLE ROW LEVEL SECURITY;

-- Anyone can read navigation
CREATE POLICY "Anyone can read navigation"
ON public.cms_navigation
FOR SELECT
USING (true);

-- Only admins can modify navigation
CREATE POLICY "Admins can insert navigation"
ON public.cms_navigation
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update navigation"
ON public.cms_navigation
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete navigation"
ON public.cms_navigation
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create cms_site_config table for global settings
CREATE TABLE public.cms_site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on cms_site_config
ALTER TABLE public.cms_site_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read site config
CREATE POLICY "Anyone can read site config"
ON public.cms_site_config
FOR SELECT
USING (true);

-- Only admins can modify site config
CREATE POLICY "Admins can insert site config"
ON public.cms_site_config
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site config"
ON public.cms_site_config
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site config"
ON public.cms_site_config
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_cms_pages_updated_at
BEFORE UPDATE ON public.cms_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_navigation_updated_at
BEFORE UPDATE ON public.cms_navigation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_site_config_updated_at
BEFORE UPDATE ON public.cms_site_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
