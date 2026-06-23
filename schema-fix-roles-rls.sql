-- Run in Supabase SQL Editor if profile role stays empty on the dashboard.
-- The roles table needs a public read policy for client-side role joins.

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roles_public_read" ON roles;
CREATE POLICY "roles_public_read" ON roles
  FOR SELECT USING (true);
