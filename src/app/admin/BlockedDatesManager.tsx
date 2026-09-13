'use client';

import { useState } from 'react';
import { blockDateAction, unblockDateAction } from './actions';

type BlockedDate = {
  id: string;
  date: string;
  reason: string;
  start_time: string | null;
  end_time: string | null;
};

export default function BlockedDatesManager({ blockedDates }: { blockedDates: BlockedDate[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFullDay, setIsFullDay] = useState(true);

  async function handleBlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await blockDateAction(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
      setIsFullDay(true);
    }
    setLoading(false);
  }

  async function handleUnblock(id: string) {
    if (confirm('Are you sure you want to unblock this?')) {
      await unblockDateAction(id);
    }
  }

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time.substring(0, 5); // "10:00:00" -> "10:00"
  };

  return (
    <div className="bg-surface border border-border p-6 rounded-sm">
      <h2 className="text-xl font-heading text-primary mb-4">Manage Blocked Dates & Times</h2>
      
      <form onSubmit={handleBlock} className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-secondary text-xs mb-1">Select Date</label>
            <input 
              type="date" 
              name="date" 
              required
              className="w-full bg-background border border-border p-2 text-primary focus:border-accent outline-none text-sm"
            />
          </div>
          <div className="flex-1 flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-primary">
              <input 
                type="checkbox" 
                name="isFullDay"
                checked={isFullDay}
                onChange={(e) => setIsFullDay(e.target.checked)}
                className="accent-accent"
              />
              Block Full Day
            </label>
          </div>
        </div>

        {!isFullDay && (
          <div className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex-1">
              <label className="block text-secondary text-xs mb-1">Start Time (e.g. 06:00)</label>
              <input 
                type="time" 
                name="start_time" 
                required={!isFullDay}
                className="w-full bg-background border border-border p-2 text-primary focus:border-accent outline-none text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-secondary text-xs mb-1">End Time (e.g. 10:00)</label>
              <input 
                type="time" 
                name="end_time" 
                required={!isFullDay}
                className="w-full bg-background border border-border p-2 text-primary focus:border-accent outline-none text-sm"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-secondary text-xs mb-1">Reason (Optional)</label>
            <input 
              type="text" 
              name="reason" 
              placeholder="e.g. Guest Spot, Holiday, Break"
              className="w-full bg-background border border-border p-2 text-primary focus:border-accent outline-none text-sm"
            />
          </div>
          <div className="w-full md:w-auto">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white px-6 py-2 h-[38px] hover:bg-white hover:text-accent transition-colors font-heading text-sm uppercase tracking-wider"
            >
              {loading ? 'Blocking...' : 'Block'}
            </button>
          </div>
        </div>
      </form>
      
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="border border-border/50 rounded-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 bg-black/20 text-secondary text-xs">
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Time Block</th>
              <th className="p-3 font-medium">Reason</th>
              <th className="p-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {!blockedDates || blockedDates.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-secondary text-sm">
                  No dates/times are currently blocked.
                </td>
              </tr>
            ) : (
              blockedDates.map((item) => (
                <tr key={item.id} className="border-b border-border/20 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-primary text-sm">{item.date}</td>
                  <td className="p-3 text-primary text-sm">
                    {item.start_time && item.end_time 
                      ? `${formatTime(item.start_time)} - ${formatTime(item.end_time)}` 
                      : 'Full Day'}
                  </td>
                  <td className="p-3 text-secondary text-sm">{item.reason || '-'}</td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleUnblock(item.id)}
                      className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider border border-red-400/30 px-3 py-1 rounded-sm hover:border-red-400 transition-colors"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
