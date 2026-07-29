-- B2B Businesses Table
-- Run this ONCE in the Supabase SQL editor: https://supabase.com/dashboard/project/pdnjeynugptnavkdbmxh/sql
-- This powers the conference mode scanner — listings go live immediately

CREATE TABLE IF NOT EXISTS b2b_businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,       -- seedbank | club | cultivationtech | compliancetech | advocacy
    country TEXT NOT NULL,        -- lowercase: germany, spain, netherlands, uk, etc.
    city TEXT,
    website TEXT,
    contact_email TEXT,
    description TEXT,
    expo_ref TEXT,                -- maryjane26 | spannabis26 | prague420 | cannex | direct
    freebies TEXT,                -- what they've offered the village (discount, sample, etc.)
    b2b_needs TEXT,               -- what they need from the industry (matchmaking)
    b2b_offers TEXT,              -- what they can offer other businesses (matchmaking)
    active BOOLEAN DEFAULT TRUE,
    claimed BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE
);

ALTER TABLE b2b_businesses ENABLE ROW LEVEL SECURITY;

-- Anyone can read active listings (anon key is fine for reads)
CREATE POLICY "Public read active b2b" ON b2b_businesses
    FOR SELECT USING (active = true);

-- Writes go through create-b2b-listing Netlify function (service role key only)
