-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  quote_en TEXT,
  role_en TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client logos table
CREATE TABLE public.client_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  href TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- Public read access for published items
CREATE POLICY "Anyone can view published testimonials"
ON public.testimonials FOR SELECT
USING (published = true);

CREATE POLICY "Anyone can view published client logos"
ON public.client_logos FOR SELECT
USING (published = true);

-- Admin full access for testimonials
CREATE POLICY "Admins can do everything with testimonials"
ON public.testimonials FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin full access for client logos
CREATE POLICY "Admins can do everything with client logos"
ON public.client_logos FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update triggers
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_logos_updated_at
BEFORE UPDATE ON public.client_logos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default testimonials
INSERT INTO public.testimonials (quote, author, role, company, quote_en, role_en, sort_order) VALUES
('De förstod vårt varumärke på djupet och levererade resultat som överträffade våra förväntningar.', 'Anna Lindberg', 'CMO', 'TechStartup AB', 'They understood our brand deeply and delivered results that exceeded our expectations.', 'CMO', 1),
('En interimkonsult som verkligen tog ansvar och drev förändring från dag ett.', 'Erik Svensson', 'VD', 'Nordic Brand Co', 'An interim consultant who truly took responsibility and drove change from day one.', 'CEO', 2),
('Professionella, lyhörda och med en fantastisk känsla för kommunikation.', 'Maria Karlsson', 'Marknadschef', 'Retail Group', 'Professional, attentive, and with an excellent sense of communication.', 'Marketing Director', 3);