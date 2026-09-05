"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for server actions to bypass RLS if needed
// Or just use the regular client if we set up RLS properly.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getBookedSlots() {
  const { data, error } = await supabase
    .from("booked_slots")
    .select("*");
    
  if (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }
  return data || [];
}

export async function createBooking(bookingData: any) {
  // Using regular anon client. Requires INSERT RLS policy on 'bookings' table.
  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        client_name: bookingData.name,
        client_email: bookingData.email,
        client_whatsapp: bookingData.whatsapp,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        tattoo_type: bookingData.type,
        total_price: bookingData.totalPrice,
        deposit_amount: bookingData.deposit,
        payment_status: "pending",
        // In real life, we generate a Xendit Invoice URL here and save it
        payment_link: "https://mock-xendit-link.com/" + Date.now()
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    throw new Error(error.message);
  }

  return data;
}
