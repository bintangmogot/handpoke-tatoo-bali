-- Migration 003: Appointments table + Stage column
-- This enables the multi-stage booking pipeline

-- 1. Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('consultation', 'design_review', 'tattoo_session')),
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration_hours NUMERIC(3,1) DEFAULT 2,
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create indexes for calendar queries
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON appointments(date, status);
CREATE INDEX IF NOT EXISTS idx_appointments_booking_id ON appointments(booking_id);

-- 3. Add stage column to bookings
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'stage'
  ) THEN
    ALTER TABLE bookings ADD COLUMN stage TEXT DEFAULT 'CONSULTATION_BOOKED';
  END IF;
END $$;

-- 4. Backfill existing bookings with correct stage
UPDATE bookings SET stage = 'SESSION_SCHEDULED' WHERE status = 'PAID' AND (stage IS NULL OR stage = 'CONSULTATION_BOOKED');
UPDATE bookings SET stage = 'CANCELLED' WHERE status = 'CANCELLED' AND (stage IS NULL OR stage = 'CONSULTATION_BOOKED');

-- 5. Create appointments for existing bookings (so they show on calendar)
INSERT INTO appointments (booking_id, type, date, time, duration_hours, status, notes)
SELECT 
  id,
  CASE WHEN status = 'PAID' THEN 'tattoo_session' ELSE 'consultation' END,
  booking_date,
  booking_time::TIME,
  2,
  CASE WHEN status = 'CANCELLED' THEN 'CANCELLED' ELSE 'SCHEDULED' END,
  'Migrated from bookings table'
FROM bookings
WHERE id NOT IN (SELECT booking_id FROM appointments WHERE booking_id IS NOT NULL);

-- 6. Enable RLS on appointments (matching project pattern)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on appointments" ON appointments
  FOR ALL
  USING (true)
  WITH CHECK (true);
