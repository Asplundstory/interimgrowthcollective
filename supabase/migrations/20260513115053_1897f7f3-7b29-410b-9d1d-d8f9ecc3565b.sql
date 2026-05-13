DROP POLICY IF EXISTS "Clients can view their company invoices" ON public.invoices;

CREATE POLICY "Clients can view their company invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM public.client_users WHERE id = auth.uid()
  )
);