-- Motor-Oid — Membership Grandfathering
-- Run in Supabase SQL Editor (project: pdnjeynugptnavkdbmxh)
--
-- Tracks Patreon members with sequential signup numbers.
-- First 1,000 signups are grandfathered — price locked at their joining tier
-- for life, no matter what Motor-Oid charges in future.
--
-- Tiers:
--   villager → £3/mo  (300p)
--   elder    → £7/mo  (700p)
--   founder  → £15/mo (1500p)
--
-- Prices stored in pence to avoid float arithmetic.
--
-- Open Window Protocol — this schema scales to any asset class
-- (vehicles, property, equipment). Membership grandfathering is
-- independent of what the member lists or sells.
--
-- Safe to re-run: uses IF NOT EXISTS / CREATE SEQUENCE IF NOT EXISTS throughout.
-- RLS: service role only.

-- ─── Sequence ─────────────────────────────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS motor_member_signup_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

-- ─── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS motor_members (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  patreon_id    TEXT        UNIQUE NOT NULL,
  email         TEXT        NOT NULL,
  tier          TEXT        NOT NULL CHECK (tier IN ('villager', 'elder', 'founder')),
  tier_price    INTEGER     NOT NULL CHECK (tier_price IN (300, 700, 1500)), -- Pence at time of joining
  grandfathered BOOLEAN     DEFAULT false,            -- Auto-set true when signup_number <= 1000
  signup_number INTEGER     UNIQUE DEFAULT nextval('motor_member_signup_seq'),
  joined_at     TIMESTAMPTZ DEFAULT now(),
  last_seen     TIMESTAMPTZ
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE motor_members ENABLE ROW LEVEL SECURITY;

-- No public access — membership data, service role only
CREATE POLICY "Service role full access"
  ON motor_members FOR ALL TO service_role
  USING (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS motor_members_patreon_id_idx    ON motor_members (patreon_id);
CREATE INDEX IF NOT EXISTS motor_members_signup_number_idx ON motor_members (signup_number);
CREATE INDEX IF NOT EXISTS motor_members_grandfathered_idx ON motor_members (grandfathered);

-- ─── Trigger: auto-grandfather first 1,000 ───────────────────────────────────
--
-- Fires on INSERT and on UPDATE of signup_number.
-- Sets grandfathered = true automatically when signup_number <= 1000.
-- No manual intervention needed — the system self-governs.

CREATE OR REPLACE FUNCTION motor_members_set_grandfathered()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.signup_number IS NOT NULL AND NEW.signup_number <= 1000 THEN
    NEW.grandfathered := true;
  END IF;
  RETURN NEW;
END;
$$;

-- Drop first so this is safe to re-run
DROP TRIGGER IF EXISTS motor_members_grandfather_trigger ON motor_members;

CREATE TRIGGER motor_members_grandfather_trigger
  BEFORE INSERT OR UPDATE OF signup_number
  ON motor_members
  FOR EACH ROW
  EXECUTE FUNCTION motor_members_set_grandfathered();
