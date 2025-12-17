-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (contact form is public)
CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading for authenticated admins (future admin dashboard)
CREATE POLICY "Admins can view submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (false);

-- Create creator_applications table
CREATE TABLE public.creator_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  portfolio_url TEXT NOT NULL,
  q1_feeling TEXT NOT NULL,
  q2_structure TEXT NOT NULL,
  q3_pressure TEXT NOT NULL,
  code_of_conduct_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (application form is public)
CREATE POLICY "Anyone can submit application" 
ON public.creator_applications 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading for authenticated admins (future admin dashboard)
CREATE POLICY "Admins can view applications" 
ON public.creator_applications 
FOR SELECT 
USING (false);