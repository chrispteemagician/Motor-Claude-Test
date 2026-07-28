-- Motor-Oid — Spicy Hustler Credit Ledger
-- Run in Supabase SQL Editor (project: pdnjeynugptnavkdbmxh)
--
-- Immutable audit trail of all credit movements for the operator system.
-- Every credit gained or spent writes a row here — nothing is ever deleted.
-- Types: 'purchase' | 'use' | 'advance' | 'repay' | 'bonus' | 'refund'
--
-- Open Window Protocol — listing_id is typed to motor_listings today,
-- but the operator credit system is asset-agnostic. When property or
-- equipment listings exist, a foreign key to those tables can be added
-- via the same pattern. The ledger itself never changes.
--
-- Safe to re-run: uses IF NOT EXISTS throughout.
-- RLS: service role only — this is financial data, never public.

-- ─── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS motor_credit_ledger (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID        NOT NULL REFERENCES motor_operators(id),
  type        TEXT        NOT NULL
                          CHECK (type IN ('purchase', 'use', 'advance', 'repay', 'bonus', 'refund')),
  amount      INTEGER     NOT NULL,                    -- Positive = credits added, negative = credits used
  listing_id  UUID        REFERENCES motor_listings(id),  -- Set when type = 'use'
  bundle_ref  TEXT,                                    -- Stripe payment_intent or checkout session ID
  note        TEXT,                                    -- Human-readable: "Kindness Protocol advance — 5 credits"
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE motor_credit_ledger ENABLE ROW LEVEL SECURITY;

-- No public access — financial data, service role only
CREATE POLICY "Service role full access"
  ON motor_credit_ledger FOR ALL TO service_role
  USING (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS motor_credit_ledger_operator_id_idx ON motor_credit_ledger (operator_id);
CREATE INDEX IF NOT EXISTS motor_credit_ledger_type_idx        ON motor_credit_ledger (type);
CREATE INDEX IF NOT EXISTS motor_credit_ledger_created_at_idx  ON motor_credit_ledger (created_at);

-- ─── Function: deduct_credit ──────────────────────────────────────────────────
--
-- Atomic credit deduction. Call from Netlify functions when an operator
-- creates a listing on behalf of a seller.
--
-- Usage: SELECT deduct_credit('<operator_uuid>', '<listing_uuid>');
-- Returns: true on success
-- Raises:  exception if operator has no credits (balance = 0)

CREATE OR REPLACE FUNCTION deduct_credit(
  p_operator_id UUID,
  p_listing_id  UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  -- Lock the operator row for the duration of this transaction
  SELECT credit_balance
    INTO v_balance
    FROM motor_operators
   WHERE id = p_operator_id
     FOR UPDATE;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Operator not found: %', p_operator_id;
  END IF;

  IF v_balance <= 0 THEN
    RAISE EXCEPTION 'No credits available for operator: %', p_operator_id;
  END IF;

  -- Write the ledger entry
  INSERT INTO motor_credit_ledger (operator_id, type, amount, listing_id, note)
  VALUES (p_operator_id, 'use', -1, p_listing_id, 'Credit used — listing created');

  -- Decrement the balance on the operator record
  UPDATE motor_operators
     SET credit_balance = credit_balance - 1,
         listing_count  = listing_count + 1,
         updated_at     = now()
   WHERE id = p_operator_id;

  RETURN true;
END;
$$;
