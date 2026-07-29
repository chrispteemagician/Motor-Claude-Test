-- Run this in the Supabase SQL editor before pushing the intake recording fix

-- 1. Create storage bucket for intake recordings (private — service role only)
INSERT INTO storage.buckets (id, name, public)
VALUES ('intake-recordings', 'intake-recordings', false)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS: service role can read/write everything in this bucket
CREATE POLICY "Service role full access"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'intake-recordings');

-- 3. intake_sessions log table
CREATE TABLE IF NOT EXISTS intake_sessions (
  id              BIGSERIAL PRIMARY KEY,
  slug            TEXT NOT NULL,
  file_path       TEXT NOT NULL,
  question_index  INT,
  mode            TEXT,
  lang            TEXT,
  duration_seconds INT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup by slug
CREATE INDEX IF NOT EXISTS idx_intake_sessions_slug ON intake_sessions(slug);

-- RLS: service role only
ALTER TABLE intake_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
ON intake_sessions
FOR ALL
TO service_role
USING (true);
