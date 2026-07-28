-- Community hamlets — shared schema for any hamlet using functions/hamlet-posts.js
-- and functions/hamlet-claim-trial.js (Green Party, Ravers, and any future community
-- hamlet). Skinner Brothers keeps its own separate skinner_posts/skinner_trials
-- tables, untouched by this file.
--
-- Written with IF NOT EXISTS / IF EXISTS guards throughout so it's safe to
-- run again — confirmed 2026-07-26 against a Supabase project where
-- hamlet_posts already existed from an earlier partial run.

CREATE TABLE IF NOT EXISTS hamlet_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  hamlet_slug text NOT NULL,
  content text NOT NULL,
  is_public boolean DEFAULT true,
  author text DEFAULT 'Motor-Oid Village',
  pinned boolean DEFAULT false,
  post_type text DEFAULT 'update'  -- 'update' | 'gig' | 'news' | 'members'
);

ALTER TABLE hamlet_posts ADD COLUMN IF NOT EXISTS hamlet_slug text;
ALTER TABLE hamlet_posts ADD COLUMN IF NOT EXISTS content text;
ALTER TABLE hamlet_posts ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;
ALTER TABLE hamlet_posts ADD COLUMN IF NOT EXISTS author text DEFAULT 'Motor-Oid Village';
ALTER TABLE hamlet_posts ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false;
ALTER TABLE hamlet_posts ADD COLUMN IF NOT EXISTS post_type text DEFAULT 'update';

ALTER TABLE hamlet_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_public" ON hamlet_posts;
CREATE POLICY "anon_read_public" ON hamlet_posts FOR SELECT TO anon USING (is_public = true);

CREATE TABLE IF NOT EXISTS hamlet_trials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  hamlet_slug text NOT NULL,
  trial_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL
);
ALTER TABLE hamlet_trials ENABLE ROW LEVEL SECURITY;
-- service_role bypasses RLS — no additional policy needed for server-side reads/inserts
