import { supabaseAdmin } from '@/lib/supabase-admin';
import BlockedDatesManager from './BlockedDatesManager';

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
        <div className="bg-surface border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-black/20 text-secondary text-sm">
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {!bookings || bookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-secondary">
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-primary text-sm whitespace-nowrap">
                        {booking.booking_date} <br/>
                        <span className="text-secondary">{booking.booking_time}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-primary">{booking.name}</div>
                        <div className="text-secondary text-xs">{booking.whatsapp}</div>
                      </td>
                      <td className="p-4 text-primary text-sm">
                        {booking.session_type}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-sm ${
                          booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                          booking.status === 'PAID' ? 'bg-green-500/20 text-green-500' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <BlockedDatesManager blockedDates={blockedDates || []} />
      </div>
    </div>
  );
}
