-- Add sender email to track who sent the document
ALTER TABLE public.generated_documents
ADD COLUMN IF NOT EXISTS sender_email text;