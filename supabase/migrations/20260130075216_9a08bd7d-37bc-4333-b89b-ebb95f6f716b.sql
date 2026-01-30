-- Add new columns to creator_applications for the application workflow
ALTER TABLE creator_applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE creator_applications ADD COLUMN IF NOT EXISTS invitation_token UUID;
ALTER TABLE creator_applications ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMPTZ;
ALTER TABLE creator_applications ADD COLUMN IF NOT EXISTS invitation_expires_at TIMESTAMPTZ;
ALTER TABLE creator_applications ADD COLUMN IF NOT EXISTS reviewed_by UUID;
ALTER TABLE creator_applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE creator_applications ADD COLUMN IF NOT EXISTS candidate_id UUID REFERENCES candidates(id);

-- Create index for faster token lookup
CREATE INDEX IF NOT EXISTS idx_creator_applications_invitation_token ON creator_applications(invitation_token) WHERE invitation_token IS NOT NULL;

-- RLS policy to allow admins to update applications
CREATE POLICY "Admins can update applications"
ON creator_applications FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));