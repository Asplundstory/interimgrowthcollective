
-- Lock down SECURITY DEFINER helper functions from direct API execution.
-- They remain callable inside RLS / triggers because Postgres evaluates them as their owner.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- record_proposal_view is intentionally callable by anonymous viewers via the proposal page.
-- Keep it executable but ensure search_path is locked (already set).

-- Remove broad SELECT (listing) policies on public storage buckets.
-- Public file URLs continue to work without a SELECT policy on storage.objects.
DROP POLICY IF EXISTS "Anyone can view CMS images" ON storage.objects;
DROP POLICY IF EXISTS "Email assets are publicly accessible" ON storage.objects;
