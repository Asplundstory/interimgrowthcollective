-- Create proposal status enum
CREATE TYPE public.proposal_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'declined');

-- Create proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  status proposal_status NOT NULL DEFAULT 'draft',
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE
);

-- Create proposal_slides table
CREATE TABLE public.proposal_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  slide_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposal_consultants table
CREATE TABLE public.proposal_consultants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  expertise TEXT[] DEFAULT '{}',
  availability TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_consultants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proposals
-- Public can view by slug (the secret URL is the authentication)
CREATE POLICY "Anyone can view proposals by slug"
ON public.proposals
FOR SELECT
USING (true);

-- Admins can do everything
CREATE POLICY "Admins can manage proposals"
ON public.proposals
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for proposal_slides
CREATE POLICY "Anyone can view proposal slides"
ON public.proposal_slides
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage proposal slides"
ON public.proposal_slides
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for proposal_consultants
CREATE POLICY "Anyone can view proposal consultants"
ON public.proposal_consultants
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage proposal consultants"
ON public.proposal_consultants
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_proposals_slug ON public.proposals(slug);
CREATE INDEX idx_proposal_slides_proposal_id ON public.proposal_slides(proposal_id);
CREATE INDEX idx_proposal_consultants_proposal_id ON public.proposal_consultants(proposal_id);

-- Create triggers for updated_at
CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposal_slides_updated_at
BEFORE UPDATE ON public.proposal_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposal_consultants_updated_at
BEFORE UPDATE ON public.proposal_consultants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();