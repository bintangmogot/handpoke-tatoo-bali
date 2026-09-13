'use client';

import { useState } from 'react';
import Image from 'next/image';

type Booking = {
  id: string;
  name: string;
  whatsapp: string;
  session_type: string;
  design_url: string | null;
  placement_url: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
};

export default function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [selected, setSelected] = useState<Booking | null>(null);

  return (
    <>
      <div className="bg-surface border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/20 text-secondary text-sm">
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {!bookings || bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-secondary">
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
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelected(booking)}
                        className="text-xs uppercase tracking-wider border border-accent/30 text-accent px-3 py-1 rounded-sm hover:bg-accent hover:text-white transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm relative">
            <div className="sticky top-0 bg-surface border-b border-border p-4 flex justify-between items-center z-10">
              <h3 className="font-heading text-xl text-primary">Booking Details</h3>
              <button 
                onClick={() => setSelected(null)}
                className="text-secondary hover:text-primary p-2 text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-secondary mb-1">Client Name</div>
                  <div className="text-primary font-medium">{selected.name}</div>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">WhatsApp</div>
                  <div className="text-primary">
                    <a 
                      href={`https://wa.me/${selected.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline flex items-center gap-2"
                    >
                      {selected.whatsapp} &#8599;
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">Schedule</div>
                  <div className="text-primary">{selected.booking_date} at {selected.booking_time}</div>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">Session Type</div>
                  <div className="text-primary capitalize">{selected.session_type}</div>
                </div>
              </div>

              {(selected.design_url || selected.placement_url) && (
                <div className="border-t border-border/50 pt-6 mt-6">
                  <h4 className="text-sm font-heading text-primary mb-4 uppercase tracking-wider">Reference Images</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selected.design_url && (
                      <div className="space-y-2">
                        <div className="text-xs text-secondary">Tattoo Design</div>
                        <div className="relative aspect-square w-full bg-black/50 border border-border/50 rounded-sm overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={selected.design_url} 
                            alt="Design" 
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                    {selected.placement_url && (
                      <div className="space-y-2">
                        <div className="text-xs text-secondary">Body Placement</div>
                        <div className="relative aspect-square w-full bg-black/50 border border-border/50 rounded-sm overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={selected.placement_url} 
                            alt="Placement" 
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
