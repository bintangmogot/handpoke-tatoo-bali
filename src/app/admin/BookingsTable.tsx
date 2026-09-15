'use client';

import { useState, useTransition } from 'react';
import { advanceStage, sendPaymentLinkToCustomer, cancelAppointment, completeAppointment } from './actions';

type Appointment = {
  id: string;
  booking_id: string;
  type: string;
  date: string;
  time: string;
  duration_hours: number;
  status: string;
  notes: string | null;
};

type Booking = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  session_type: string;
  design_url: string | null;
  placement_url: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  stage: string;
  price: number;
  deposit: number;
  placement: string;
  created_at: string;
};

const STAGES = [
  'CONSULTATION_BOOKED',
  'DESIGN_IN_PROGRESS',
  'DEAL_CONFIRMED',
  'SESSION_SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
];

const STAGE_LABELS: Record<string, string> = {
  CONSULTATION_BOOKED: 'Consultation',
  DESIGN_IN_PROGRESS: 'Design',
  DEAL_CONFIRMED: 'Deal',
  SESSION_SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Done',
  CANCELLED: 'Cancelled',
};

const STAGE_COLORS: Record<string, string> = {
  CONSULTATION_BOOKED: 'bg-blue-500/20 text-blue-400',
  DESIGN_IN_PROGRESS: 'bg-purple-500/20 text-purple-400',
  DEAL_CONFIRMED: 'bg-yellow-500/20 text-yellow-400',
  SESSION_SCHEDULED: 'bg-orange-500/20 text-orange-400',
  IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400',
  COMPLETED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  consultation: 'Consultation',
  design_review: 'Design Review',
  tattoo_session: 'Tattoo Session',
};

const DEFAULT_DURATIONS: Record<string, number> = {
  consultation: 1,
  design_review: 1,
  tattoo_session: 4,
};

type FilterTab = 'all' | 'consultation' | 'in_progress' | 'scheduled' | 'completed';

export default function BookingsTable({ 
  bookings, 
  appointments 
}: { 
  bookings: Booking[]; 
  appointments: Appointment[];
}) {
  const [selected, setSelected] = useState<Booking | null>(null);
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  // Advance stage form state
  const [advDate, setAdvDate] = useState('');
  const [advTime, setAdvTime] = useState('10:00');
  const [advDuration, setAdvDuration] = useState(2);
  const [advPrice, setAdvPrice] = useState('');
  const [advNotes, setAdvNotes] = useState('');

  const getBookingAppointments = (bookingId: string) => {
    return appointments.filter(a => a.booking_id === bookingId);
  };

  const getNextStage = (currentStage: string): string | null => {
    const idx = STAGES.indexOf(currentStage);
    if (idx === -1 || idx >= STAGES.length - 1) return null;
    return STAGES[idx + 1];
  };

  const getNextAppointmentType = (nextStage: string): 'consultation' | 'design_review' | 'tattoo_session' => {
    if (nextStage === 'DESIGN_IN_PROGRESS') return 'design_review';
    if (nextStage === 'SESSION_SCHEDULED' || nextStage === 'IN_PROGRESS') return 'tattoo_session';
    return 'consultation';
  };

  const needsAppointment = (stage: string) => {
    return ['DESIGN_IN_PROGRESS', 'SESSION_SCHEDULED'].includes(stage);
  };

  const needsPrice = (stage: string) => {
    return stage === 'DEAL_CONFIRMED';
  };

  const filteredBookings = bookings.filter(b => {
    if (filterTab === 'all') return true;
    if (filterTab === 'consultation') return b.stage === 'CONSULTATION_BOOKED';
    if (filterTab === 'in_progress') return ['DESIGN_IN_PROGRESS', 'DEAL_CONFIRMED'].includes(b.stage);
    if (filterTab === 'scheduled') return ['SESSION_SCHEDULED', 'IN_PROGRESS'].includes(b.stage);
    if (filterTab === 'completed') return b.stage === 'COMPLETED';
    return true;
  });

  const handleAdvanceStage = async (booking: Booking) => {
    const nextStage = getNextStage(booking.stage);
    if (!nextStage) return;

    setActionMessage('');

    const appointmentData = needsAppointment(nextStage) && advDate ? {
      date: advDate,
      time: advTime,
      duration_hours: advDuration,
      type: getNextAppointmentType(nextStage),
      notes: advNotes || undefined,
    } : undefined;

    const priceUpdate = needsPrice(nextStage) && advPrice ? {
      price: parseInt(advPrice),
    } : undefined;

    startTransition(async () => {
      const result = await advanceStage(booking.id, nextStage, appointmentData, priceUpdate);
      if (result.error) {
        setActionMessage('Error: ' + result.error);
      } else {
        setActionMessage('Stage updated successfully!');
        setShowAdvanceForm(false);
        setAdvDate('');
        setAdvTime('10:00');
        setAdvDuration(2);
        setAdvPrice('');
        setAdvNotes('');
        // Update the selected booking's stage locally
        setSelected(prev => prev ? { ...prev, stage: nextStage, ...(priceUpdate || {}) } : null);
      }
    });
  };

  const handleSendPaymentLink = async (bookingId: string) => {
    startTransition(async () => {
      const result = await sendPaymentLinkToCustomer(bookingId);
      if (result.error) {
        setActionMessage('Error: ' + result.error);
      } else {
        setActionMessage('Payment link sent to customer!');
      }
    });
  };

  const handleCancelAppointment = async (apptId: string) => {
    if (!confirm('Cancel this appointment? The slot will be freed.')) return;
    startTransition(async () => {
      await cancelAppointment(apptId);
      setActionMessage('Appointment cancelled.');
    });
  };

  const handleCompleteAppointment = async (apptId: string) => {
    startTransition(async () => {
      await completeAppointment(apptId);
      setActionMessage('Appointment marked as completed.');
    });
  };

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: bookings.length },
    { key: 'consultation', label: 'Consultation', count: bookings.filter(b => b.stage === 'CONSULTATION_BOOKED').length },
    { key: 'in_progress', label: 'In Progress', count: bookings.filter(b => ['DESIGN_IN_PROGRESS', 'DEAL_CONFIRMED'].includes(b.stage)).length },
    { key: 'scheduled', label: 'Scheduled', count: bookings.filter(b => ['SESSION_SCHEDULED', 'IN_PROGRESS'].includes(b.stage)).length },
    { key: 'completed', label: 'Completed', count: bookings.filter(b => b.stage === 'COMPLETED').length },
  ];

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-sm whitespace-nowrap transition-colors ${
              filterTab === tab.key
                ? 'bg-accent text-white'
                : 'bg-surface border border-border text-secondary hover:text-primary hover:border-accent/30'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/20 text-secondary text-sm">
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Stage</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {!filteredBookings || filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-secondary">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-primary text-sm whitespace-nowrap">
                      {booking.booking_date} <br/>
                      <span className="text-secondary">{booking.booking_time}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-primary">{booking.name}</div>
                      <div className="text-secondary text-xs">{booking.whatsapp}</div>
                    </td>
                    <td className="p-4 text-primary text-sm capitalize">
                      {booking.session_type}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-sm ${STAGE_COLORS[booking.stage] || 'bg-gray-500/20 text-gray-400'}`}>
                        {STAGE_LABELS[booking.stage] || booking.stage}
                      </span>
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
                        onClick={() => { setSelected(booking); setShowAdvanceForm(false); setActionMessage(''); }}
                        className="text-xs uppercase tracking-wider border border-accent/30 text-accent px-3 py-1 rounded-sm hover:bg-accent hover:text-white transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm relative">
            
            {/* Header */}
            <div className="sticky top-0 bg-surface border-b border-border p-4 flex justify-between items-center z-10">
              <h3 className="font-heading text-xl text-primary">
                {selected.name} — {selected.session_type.charAt(0).toUpperCase() + selected.session_type.slice(1)}
              </h3>
              <button 
                onClick={() => setSelected(null)}
                className="text-secondary hover:text-primary p-2 text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Stage Pipeline */}
              <div>
                <div className="text-xs text-secondary mb-3 uppercase tracking-wider">Pipeline</div>
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {STAGES.map((stage, i) => {
                    const currentIdx = STAGES.indexOf(selected.stage);
                    const isActive = stage === selected.stage;
                    const isPast = i < currentIdx;
                    const isCancelled = selected.stage === 'CANCELLED';
                    
                    return (
                      <div key={stage} className="flex items-center">
                        <div className={`px-3 py-1.5 text-xs font-medium rounded-sm whitespace-nowrap ${
                          isCancelled ? 'bg-red-500/10 text-red-400/50' :
                          isActive ? 'bg-accent text-white' :
                          isPast ? 'bg-green-500/20 text-green-400' :
                          'bg-white/5 text-secondary/50'
                        }`}>
                          {STAGE_LABELS[stage]}
                        </div>
                        {i < STAGES.length - 1 && (
                          <div className={`w-4 h-[1px] ${isPast ? 'bg-green-500/50' : 'bg-border'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Client Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-secondary mb-1">Client</div>
                  <div className="text-primary font-medium">{selected.name}</div>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">WhatsApp</div>
                  <a 
                    href={`https://wa.me/${selected.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-sm"
                  >
                    {selected.whatsapp} &#8599;
                  </a>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">Email</div>
                  <div className="text-primary text-sm">{selected.email || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">Placement</div>
                  <div className="text-primary text-sm">{selected.placement}</div>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">Price</div>
                  <div className="text-primary text-sm">IDR {(selected.price || 0).toLocaleString('id-ID')}</div>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">Deposit</div>
                  <div className="text-green-400 text-sm font-medium">IDR {(selected.deposit || 0).toLocaleString('id-ID')}</div>
                </div>
              </div>

              {/* Reference Images */}
              {(selected.design_url || selected.placement_url) && (
                <div className="border-t border-border/50 pt-4">
                  <div className="text-xs text-secondary mb-3 uppercase tracking-wider">Reference Images</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selected.design_url && (
                      <div className="space-y-1">
                        <div className="text-xs text-secondary">Design</div>
                        <div className="relative aspect-square w-full bg-black/50 border border-border/50 rounded-sm overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={selected.design_url} alt="Design" className="object-contain w-full h-full" />
                        </div>
                      </div>
                    )}
                    {selected.placement_url && (
                      <div className="space-y-1">
                        <div className="text-xs text-secondary">Placement</div>
                        <div className="relative aspect-square w-full bg-black/50 border border-border/50 rounded-sm overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={selected.placement_url} alt="Placement" className="object-contain w-full h-full" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Appointments Timeline */}
              <div className="border-t border-border/50 pt-4">
                <div className="text-xs text-secondary mb-3 uppercase tracking-wider">Appointments</div>
                {getBookingAppointments(selected.id).length === 0 ? (
                  <p className="text-secondary text-sm">No appointments yet.</p>
                ) : (
                  <div className="space-y-2">
                    {getBookingAppointments(selected.id).map(appt => (
                      <div key={appt.id} className="flex items-center justify-between bg-white/5 border border-border/30 rounded-sm p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            appt.status === 'SCHEDULED' ? 'bg-blue-400' :
                            appt.status === 'COMPLETED' ? 'bg-green-400' :
                            'bg-red-400'
                          }`} />
                          <div>
                            <div className="text-primary text-sm">
                              {APPOINTMENT_TYPE_LABELS[appt.type] || appt.type} — {appt.date} at {appt.time?.substring(0, 5)}
                            </div>
                            <div className="text-secondary text-xs">
                              {appt.duration_hours}hr &middot; {appt.status}{appt.notes ? ` — ${appt.notes}` : ''}
                            </div>
                          </div>
                        </div>
                        {appt.status === 'SCHEDULED' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCompleteAppointment(appt.id)}
                              disabled={isPending}
                              className="text-xs border border-green-500/30 text-green-400 px-2 py-0.5 rounded-sm hover:bg-green-500 hover:text-white transition-colors"
                            >
                              Done
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(appt.id)}
                              disabled={isPending}
                              className="text-xs border border-red-500/30 text-red-400 px-2 py-0.5 rounded-sm hover:bg-red-500 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              {selected.stage !== 'COMPLETED' && selected.stage !== 'CANCELLED' && (
                <div className="border-t border-border/50 pt-4 space-y-3">
                  
                  {/* Send Payment Link (only for Deal Confirmed) */}
                  {selected.stage === 'DEAL_CONFIRMED' && selected.status !== 'PAID' && (
                    <button
                      onClick={() => handleSendPaymentLink(selected.id)}
                      disabled={isPending}
                      className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-medium text-sm uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50"
                    >
                      {isPending ? 'Sending...' : 'Send Payment Link to Customer'}
                    </button>
                  )}

                  {/* Advance Stage */}
                  {getNextStage(selected.stage) && (
                    <>
                      {!showAdvanceForm ? (
                        <button
                          onClick={() => {
                            setShowAdvanceForm(true);
                            const next = getNextStage(selected.stage)!;
                            const apptType = getNextAppointmentType(next);
                            setAdvDuration(DEFAULT_DURATIONS[apptType] || 2);
                          }}
                          className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-medium text-sm uppercase tracking-wider rounded-sm transition-colors"
                        >
                          Advance to: {STAGE_LABELS[getNextStage(selected.stage)!]}
                        </button>
                      ) : (
                        <div className="bg-white/5 border border-border/50 rounded-sm p-4 space-y-3">
                          <div className="text-xs text-secondary uppercase tracking-wider mb-2">
                            Advance to: {STAGE_LABELS[getNextStage(selected.stage)!]}
                          </div>

                          {/* Price input (for Deal Confirmed) */}
                          {needsPrice(getNextStage(selected.stage)!) && (
                            <div>
                              <label className="block text-secondary text-xs mb-1">Final Price (IDR)</label>
                              <input
                                type="number"
                                value={advPrice}
                                onChange={e => setAdvPrice(e.target.value)}
                                placeholder="e.g. 5500000"
                                className="w-full bg-background border border-border p-2 text-primary focus:border-accent outline-none text-sm"
                              />
                              {advPrice && (
                                <div className="text-xs text-green-400 mt-1">
                                  Deposit (50%): IDR {Math.round(parseInt(advPrice) * 0.5).toLocaleString('id-ID')}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Date/Time (for stages that need appointments) */}
                          {needsAppointment(getNextStage(selected.stage)!) && (
                            <>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-secondary text-xs mb-1">Date</label>
                                  <input
                                    type="date"
                                    value={advDate}
                                    onChange={e => setAdvDate(e.target.value)}
                                    className="w-full bg-background border border-border p-2 text-primary focus:border-accent outline-none text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-secondary text-xs mb-1">Time</label>
                                  <select
                                    value={advTime}
                                    onChange={e => setAdvTime(e.target.value)}
                                    className="w-full bg-background border border-border p-2 text-primary focus:border-accent outline-none text-sm [color-scheme:dark]"
                                  >
                                    {Array.from({ length: 10 }, (_, i) => i + 9).map(h => (
                                      <option key={h} value={`${h.toString().padStart(2, '0')}:00`}>
                                        {h.toString().padStart(2, '0')}:00
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="block text-secondary text-xs mb-1">Duration (hours)</label>
                                <select
                                  value={advDuration}
                                  onChange={e => setAdvDuration(parseFloat(e.target.value))}
                                  className="w-full bg-background border border-border p-2 text-primary focus:border-accent outline-none text-sm [color-scheme:dark]"
                                >
                                  <option value={0.5}>30 min</option>
                                  <option value={1}>1 hour</option>
                                  <option value={2}>2 hours</option>
                                  <option value={3}>3 hours</option>
                                  <option value={4}>4 hours (default custom)</option>
                                  <option value={5}>5 hours</option>
                                  <option value={6}>6 hours</option>
                                  <option value={8}>Full day (8 hours)</option>
                                </select>
                              </div>
                            </>
                          )}

                          {/* Notes */}
                          <div>
                            <label className="block text-secondary text-xs mb-1">Notes (optional)</label>
                            <input
                              type="text"
                              value={advNotes}
                              onChange={e => setAdvNotes(e.target.value)}
                              placeholder="e.g. Half-sleeve, left arm"
                              className="w-full bg-background border border-border p-2 text-primary focus:border-accent outline-none text-sm"
                            />
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAdvanceStage(selected)}
                              disabled={isPending || (needsPrice(getNextStage(selected.stage)!) && !advPrice)}
                              className="flex-1 py-2 bg-accent hover:bg-accent-hover text-white text-sm uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50"
                            >
                              {isPending ? 'Updating...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setShowAdvanceForm(false)}
                              className="px-4 py-2 border border-border text-secondary hover:text-primary text-sm rounded-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Action Message */}
              {actionMessage && (
                <div className={`text-sm p-3 rounded-sm ${
                  actionMessage.startsWith('Error') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                }`}>
                  {actionMessage}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
