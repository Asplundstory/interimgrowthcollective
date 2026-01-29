-- Create enum for candidate status
CREATE TYPE public.candidate_status AS ENUM ('new', 'screening', 'interview', 'approved', 'rejected');

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL,
  linkedin_url TEXT,
  portfolio_url TEXT,
  cv_url TEXT,
  status candidate_status NOT NULL DEFAULT 'new',
  availability TEXT,
  hourly_rate INTEGER,
  notes TEXT,
  q1_feeling TEXT,
  q2_structure TEXT,
  q3_pressure TEXT,
  code_of_conduct_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create candidate_references table
CREATE TABLE public.candidate_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  title TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_references ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidates
CREATE POLICY "Admins can manage candidates"
ON public.candidates FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit candidate application"
ON public.candidates FOR INSERT
WITH CHECK (true);

-- RLS Policies for candidate_references
CREATE POLICY "Admins can manage candidate references"
ON public.candidate_references FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit candidate references"
ON public.candidate_references FOR INSERT
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_candidates_status ON public.candidates(status);
CREATE INDEX idx_candidates_email ON public.candidates(email);
CREATE INDEX idx_candidate_references_candidate ON public.candidate_references(candidate_id);

-- Create trigger for updated_at
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidate-cvs', 'candidate-cvs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for CV uploads (anonymous upload, admin read)
CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'candidate-cvs');

CREATE POLICY "Admins can view CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'candidate-cvs' AND public.has_role(auth.uid(), 'admin'));