import { Suspense } from "react";
import BookingEngine from "@/components/booking/BookingEngine";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialType = (params.type as "flash" | "custom") || "flash";

  return (
    <div className="min-h-screen pt-32 pb-24 bg-primary flex flex-col items-center">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h3 className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">
            Secure Your Slot
          </h3>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary uppercase tracking-wide mb-4">
            Booking & Consultation
          </h1>
          <p className="text-secondary font-sans font-light">
            Follow the steps below to lock in your appointment with Silver Jerry.
          </p>
        </div>

        {/* Client-side Booking Engine */}
        <BookingEngine initialType={initialType} />
      </div>
    </div>
  );
}
