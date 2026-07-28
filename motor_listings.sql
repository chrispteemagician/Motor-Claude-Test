-- Motor-Oid — The Walkround — Supabase setup
-- Run this once in the Supabase SQL editor (motor-oid project: pdnjeynugptnavkdbmxh)
--
-- Also needed in Supabase Storage:
--   1. Create bucket named: motor-videos
--   2. Set bucket to Public
--   3. Add storage policy: allow anon INSERT (upload)
--      Policy SQL: (bucket_id = 'motor-videos')

-- ─── Table ────────────────────────────────────────────────────────────────────

create table if not exists motor_listings (
  id                 uuid        default gen_random_uuid() primary key,
  slug               text        unique not null,
  delete_token       text        not null,
  vehicle            jsonb       not null,
  frames             jsonb,
  video_url          text,
  video_storage_path text,
  price              text,
  contact_phone      text,
  contact_email      text,
  social_hooks       jsonb,
  status             text        default 'active',
  created_at         timestamptz default now()
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

alter table motor_listings enable row level security;

-- Public can read active listings (listing.html fetches by slug)
create policy "read active listings"
  on motor_listings for select
  using (status = 'active');

-- Service role (Netlify functions) can insert and update
create policy "service role write"
  on motor_listings for all
  using (auth.role() = 'service_role');
