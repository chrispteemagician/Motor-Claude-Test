-- Motor-Oid Dealer Network
-- Run in Supabase SQL Editor (project: pdnjeynugptnavkdbmxh)
-- Creates the motor_dealers table for the dealer directory and B2B programme

CREATE TABLE IF NOT EXISTS motor_dealers (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT UNIQUE,                         -- hamlet slug: motor-oid.co.uk/dealers/[slug] (null until assigned)
  name         TEXT NOT NULL,                        -- Display name: "Beck Evans"
  trading_name TEXT,                                 -- Legal trading name if different
  company_reg  TEXT,                                 -- Companies House number (optional)
  location     TEXT NOT NULL,                        -- Town/city: "Bristol"
  postcode     TEXT NOT NULL,                        -- "BS1 1AA"
  services     JSONB DEFAULT '[]'::JSONB,            -- ["Used Cars", "MOT & Servicing", ...]
  hours        JSONB DEFAULT '{}'::JSONB,            -- {"mon":"9-6","tue":"9-6",...}
  contact_phone TEXT,
  contact_email TEXT NOT NULL,
  website      TEXT,
  booking_url  TEXT,
  logo_url     TEXT,
  about        TEXT,                                 -- 1-2 sentence dealer description
  founding     BOOLEAN DEFAULT false,               -- Founding Dealer programme member
  verified     BOOLEAN DEFAULT false,               -- Manually verified by Doc
  active       BOOLEAN DEFAULT true,                -- Show in directory
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Public read: active dealers only
ALTER TABLE motor_dealers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active dealers" ON motor_dealers
  FOR SELECT USING (active = true);

CREATE POLICY "Service role full access" ON motor_dealers
  FOR ALL TO service_role USING (true);

-- Index for common queries
CREATE INDEX IF NOT EXISTS motor_dealers_location_idx ON motor_dealers (location);
CREATE INDEX IF NOT EXISTS motor_dealers_founding_idx ON motor_dealers (founding);
CREATE INDEX IF NOT EXISTS motor_dealers_active_idx ON motor_dealers (active);
CREATE INDEX IF NOT EXISTS motor_dealers_slug_idx ON motor_dealers (slug);
