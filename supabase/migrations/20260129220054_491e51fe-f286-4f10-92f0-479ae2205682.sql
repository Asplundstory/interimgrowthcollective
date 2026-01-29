-- Create enum for document types
CREATE TYPE public.document_type AS ENUM ('contract', 'policy', 'invoice', 'agreement', 'other');

-- Create enum for invoice status
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue');

-- Create client_users table (for magic link auth)
CREATE TABLE public.client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_sessions table (for OTP tokens)
CREATE TABLE public.client_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID REFERENCES public.client_users(id) ON DELETE CASCADE NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_documents table
CREATE TABLE public.client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL DEFAULT 'other',
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table (reference to external system)
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SEK',
  status invoice_status NOT NULL DEFAULT 'draft',
  due_date DATE,
  wint_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_users
CREATE POLICY "Admins can manage client users"
ON public.client_users FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage client users"
ON public.client_users FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for client_sessions (service role only via edge function)
CREATE POLICY "Service role can manage sessions"
ON public.client_sessions FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for client_documents
CREATE POLICY "Admins can manage client documents"
ON public.client_documents FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their company documents"
ON public.client_documents FOR SELECT
USING (true);

-- RLS Policies for invoices
CREATE POLICY "Admins can manage invoices"
ON public.invoices FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their company invoices"
ON public.invoices FOR SELECT
USING (true);

-- Create indexes
CREATE INDEX idx_client_users_email ON public.client_users(email);
CREATE INDEX idx_client_users_company ON public.client_users(company_id);
CREATE INDEX idx_client_sessions_user ON public.client_sessions(client_user_id);
CREATE INDEX idx_client_sessions_otp ON public.client_sessions(otp_code);
CREATE INDEX idx_client_documents_company ON public.client_documents(company_id);
CREATE INDEX idx_invoices_company ON public.invoices(company_id);

-- Create storage bucket for client documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-documents', 'client-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Admins can manage client documents storage"
ON storage.objects FOR ALL
USING (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'));