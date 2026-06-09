
-- 1. Client portal tables: remove permissive policies
DROP POLICY IF EXISTS "Clients can view their company documents" ON public.client_documents;
DROP POLICY IF EXISTS "Service role can manage sessions" ON public.client_sessions;
DROP POLICY IF EXISTS "Service role can manage client users" ON public.client_users;

-- service_role bypasses RLS automatically, no policy needed for it.
-- client_sessions/client_users now have no anon/authenticated access — only edge functions (service role) can touch them.

-- 2. Add session_token to client_sessions for server-validated portal sessions
ALTER TABLE public.client_sessions
  ADD COLUMN IF NOT EXISTS session_token text UNIQUE;
CREATE INDEX IF NOT EXISTS client_sessions_session_token_idx
  ON public.client_sessions(session_token);

-- 3. Proposals: drop fully open SELECT, add status-scoped one
DROP POLICY IF EXISTS "Anyone can view proposals by slug" ON public.proposals;
CREATE POLICY "Public can view sent or accepted proposals"
  ON public.proposals
  FOR SELECT
  TO anon, authenticated
  USING (status IN ('sent','viewed','accepted'));

DROP POLICY IF EXISTS "Anyone can view proposal slides" ON public.proposal_slides;
CREATE POLICY "Public can view slides of sent or accepted proposals"
  ON public.proposal_slides
  FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.proposals p
    WHERE p.id = proposal_slides.proposal_id
      AND p.status IN ('sent','viewed','accepted')
  ));

DROP POLICY IF EXISTS "Anyone can view proposal consultants" ON public.proposal_consultants;
CREATE POLICY "Public can view consultants of sent or accepted proposals"
  ON public.proposal_consultants
  FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.proposals p
    WHERE p.id = proposal_consultants.proposal_id
      AND p.status IN ('sent','viewed','accepted')
  ));

-- 4. Document templates: admin-only
DROP POLICY IF EXISTS "Anyone can view active templates" ON public.document_templates;

-- 5. Secure RPC to increment proposal view counter for public viewers
CREATE OR REPLACE FUNCTION public.record_proposal_view(_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.proposals
     SET view_count = COALESCE(view_count, 0) + 1,
         last_viewed_at = now(),
         status = CASE WHEN status = 'sent' THEN 'viewed' ELSE status END
   WHERE slug = _slug
     AND status IN ('sent','viewed','accepted');
END;
$$;

REVOKE ALL ON FUNCTION public.record_proposal_view(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_proposal_view(text) TO anon, authenticated;
