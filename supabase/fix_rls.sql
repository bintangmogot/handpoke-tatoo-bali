-- 1. Drop the existing view
DROP VIEW IF EXISTS public.booked_slots;

-- 2. Allow anyone to INSERT a new booking (but they can't see others' bookings)
CREATE POLICY "Allow public to insert bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- 3. Recreate the view but SECURITY DEFINER equivalent in PostgreSQL (by changing owner if needed) 
-- Wait, actually in Postgres, views inherently execute with the permissions of the view owner. 
-- Since you run this from Supabase SQL Editor (as postgres user), it already works.
-- But just in case, we can simply recreate it.
CREATE VIEW public.booked_slots AS
SELECT booking_date, booking_time 
FROM public.bookings 
WHERE payment_status IN ('pending', 'paid_deposit', 'completed');
-- (Note: added 'pending' so people don't double-book while someone is checking out)
