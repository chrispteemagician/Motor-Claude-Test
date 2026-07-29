-- The Exchange — buy/sell surplus AND ask-for-help board, tied to the B2B directory
-- Run this ONCE in the Supabase SQL editor: https://supabase.com/dashboard/project/pdnjeynugptnavkdbmxh/sql
--
-- Posting is a premium perk: only businesses already marked claimed = true in
-- b2b_businesses (i.e. onboarded/paying, same signal used elsewhere in this app)
-- can post. Enforced server-side in create-exchange-post.js, not just in the UI.
-- Anyone can browse/search — that's the whole point, help findable by anyone.

CREATE TABLE IF NOT EXISTS b2b_exchange (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    business_slug TEXT NOT NULL REFERENCES b2b_businesses(slug),
    business_name TEXT NOT NULL,          -- denormalised for fast display
    post_type TEXT NOT NULL CHECK (post_type IN ('for_sale', 'wanted', 'help_request')),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,                        -- reuses b2b_businesses category values, free text
    contact_override TEXT,                -- optional — if different from the business's main contact
    active BOOLEAN DEFAULT TRUE,
    resolved BOOLEAN DEFAULT FALSE        -- flip manually in Supabase once sorted
);

ALTER TABLE b2b_exchange ENABLE ROW LEVEL SECURITY;

-- Anyone can read active, unresolved posts (anon key is fine for reads)
CREATE POLICY "Public read active exchange posts" ON b2b_exchange
    FOR SELECT USING (active = true);

-- Writes go through create-exchange-post Netlify function (service role key only,
-- which also checks the posting business is claimed = true before inserting)
