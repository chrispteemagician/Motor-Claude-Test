-- Motor-Oid — Spicy Hustler Operator System
-- Run in Supabase SQL Editor (project: pdnjeynugptnavkdbmxh)
--
-- Creates the motor_operators table.
-- Operators buy a £150/10-credit bundle, get an auto-provisioned hamlet,
-- then charge local car sellers £40/car for the 2-minute Walkround service.
-- Motor-Oid takes £15/credit, operator keeps £25/car profit.
--
-- Open Window Protocol — this schema scales to any asset class
-- (vehicles, property, equipment). The operator system is asset-agnostic.
--
-- Safe to re-run: uses IF NOT EXISTS throughout.

-- ─── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS motor_operators (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  patreon_id          TEXT        UNIQUE,                          -- Links to their Patreon membership
  email               TEXT        UNIQUE NOT NULL,
  display_name        TEXT        NOT NULL,                        -- Their public operator name
  hamlet_slug         TEXT        UNIQUE,                          -- e.g. "jacks-motors" — null until provisioned
  hamlet_provisioned  BOOLEAN     DEFAULT false,
  credit_balance      INTEGER     DEFAULT 0,                       -- Current available credits
  kindness_advance    INTEGER     DEFAULT 0,                       -- Credits advanced via Kindness Protocol (tracked for repayment)
  stripe_connect_id   TEXT,                                        -- Their Stripe Connect account (Tap-to-Pay)
  paypal_me_url       TEXT,                                        -- Their paypal.me/ link for client payments
  listing_count       INTEGER     DEFAULT 0,                       -- Total listings ever created (all time)
  grandfathered       BOOLEAN     DEFAULT false,                   -- Price locked at current tier for life
  signup_number       INTEGER,                                     -- Sequential signup number (first 1,000 = grandfathered)
  active              BOOLEAN     DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE motor_operators ENABLE ROW LEVEL SECURITY;

-- Public can see active operators (hamlet directory, referrals)
CREATE POLICY "Public can read active operators"
  ON motor_operators FOR SELECT
  USING (active = true);

-- Service role (Netlify functions, Patreon webhook) has full access
CREATE POLICY "Service role full access"
  ON motor_operators FOR ALL TO service_role
  USING (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS motor_operators_email_idx         ON motor_operators (email);
CREATE INDEX IF NOT EXISTS motor_operators_hamlet_slug_idx   ON motor_operators (hamlet_slug);
CREATE INDEX IF NOT EXISTS motor_operators_patreon_id_idx    ON motor_operators (patreon_id);
CREATE INDEX IF NOT EXISTS motor_operators_signup_number_idx ON motor_operators (signup_number);
