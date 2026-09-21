-- Simplify the admin workflow without destroying historical pipeline data.
-- The old bookings.stage column is intentionally kept for backwards compatibility,
-- but the admin now uses admin_status plus independent appointments and payments.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS admin_status TEXT NOT NULL DEFAULT 'ACTIVE';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_admin_status_check'
  ) THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_admin_status_check
      CHECK (admin_status IN ('ACTIVE', 'COMPLETED', 'CANCELLED'));
  END IF;
END $$;

UPDATE bookings
SET admin_status = CASE
  WHEN stage = 'COMPLETED' THEN 'COMPLETED'
  WHEN stage = 'CANCELLED' OR status = 'CANCELLED' THEN 'CANCELLED'
  ELSE 'ACTIVE'
END
WHERE admin_status = 'ACTIVE';

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED')),
  source TEXT NOT NULL DEFAULT 'ADMIN_REQUEST'
    CHECK (source IN ('INITIAL_BOOKING', 'ADMIN_REQUEST', 'LEGACY')),
  midtrans_order_id TEXT UNIQUE,
  payment_link TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_midtrans_order_id ON payments(midtrans_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Server actions use the service role and bypass RLS. No public payment access is needed.

-- Preserve the payment history visible in existing bookings. This insert is idempotent.
INSERT INTO payments (
  booking_id,
  description,
  amount,
  status,
  source,
  payment_link,
  paid_at,
  created_at
)
SELECT
  b.id,
  CASE
    WHEN b.session_type = 'custom' THEN 'Initial consultation deposit'
    ELSE 'Initial tattoo deposit'
  END,
  b.deposit,
  CASE
    WHEN b.status = 'PAID' THEN 'PAID'
    WHEN b.status = 'CANCELLED' THEN 'CANCELLED'
    ELSE 'PENDING'
  END,
  'LEGACY',
  b.payment_link,
  CASE WHEN b.status = 'PAID' THEN b.created_at ELSE NULL END,
  b.created_at
FROM bookings b
WHERE COALESCE(b.deposit, 0) > 0
  AND NOT EXISTS (
    SELECT 1 FROM payments p WHERE p.booking_id = b.id
  );
