-- Add signing fields to generated_documents
ALTER TABLE public.generated_documents
ADD COLUMN IF NOT EXISTS signing_token uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS signing_token_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS signer_email text,
ADD COLUMN IF NOT EXISTS signer_name text,
ADD COLUMN IF NOT EXISTS signer_ip text,
ADD COLUMN IF NOT EXISTS signature_data text;

-- Create index for signing token lookups
CREATE INDEX IF NOT EXISTS idx_generated_documents_signing_token 
ON public.generated_documents(signing_token) 
WHERE signing_token IS NOT NULL;

-- Add policy for public signing access via token
CREATE POLICY "Anyone can view documents with valid signing token"
ON public.generated_documents
FOR SELECT
USING (
  signing_token IS NOT NULL 
  AND signing_token_expires_at > now()
  AND status = 'sent'
);

-- Add policy for public signing updates
CREATE POLICY "Anyone can sign documents with valid token"
ON public.generated_documents
FOR UPDATE
USING (
  signing_token IS NOT NULL 
  AND signing_token_expires_at > now()
  AND status = 'sent'
)
WITH CHECK (
  signing_token IS NOT NULL 
  AND signing_token_expires_at > now()
  AND status = 'sent'
);