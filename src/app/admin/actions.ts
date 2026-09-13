'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function blockDateAction(formData: FormData) {
  const date = formData.get('date') as string;
  const reason = formData.get('reason') as string;
  const start_time = formData.get('start_time') as string || null;
  const end_time = formData.get('end_time') as string || null;

  if (!date) return { error: 'Date is required' };

  const { error } = await supabaseAdmin
    .from('blocked_dates')
    .insert([{ date, reason, start_time, end_time }]);

  if (error) {
    if (error.code === '23505') {
      return { error: 'Date is already blocked' };
    }
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function unblockDateAction(id: string) {
  const { error } = await supabaseAdmin
    .from('blocked_dates')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}
