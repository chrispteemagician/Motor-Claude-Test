-- {{SITE_NAME}} B2B Table
-- Replace {{SUPABASE_TABLE}} with your table name (e.g. magic_b2b, sail_b2b)
-- Run ONCE in Supabase SQL editor: https://supabase.com/dashboard/project/pdnjeynugptnavkdbmxh/sql

CREATE TABLE IF NOT EXISTS {{SUPABASE_TABLE}} (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT,
    website TEXT,
    contact_email TEXT,
    description TEXT,
    expo_ref TEXT,
    freebies TEXT,
    b2b_needs TEXT,
    b2b_offers TEXT,
    active BOOLEAN DEFAULT TRUE,
    claimed BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE
);

ALTER TABLE {{SUPABASE_TABLE}} ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_{{SUPABASE_TABLE}} ON {{SUPABASE_TABLE}}
    FOR SELECT USING (active = true);
