import { supabaseAdmin } from '@/lib/supabase-admin';
import BlockedDatesManager from './BlockedDatesManager';
import BookingsTable from './BookingsTable';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: blockedDates } = await supabaseAdmin
    .from('blocked_dates')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    return <div className="text-red-500">Error loading bookings: {error.message}</div>;
  }

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-heading text-primary mb-8">Studio Bookings</h1>
        <BookingsTable bookings={bookings || []} />
      </div>

      <div>
        <BlockedDatesManager blockedDates={blockedDates || []} />
      </div>
    </div>
  );
}
